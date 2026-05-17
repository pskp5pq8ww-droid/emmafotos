import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";

type ZipInput = {
  absolutePath: string;
  filename: string;
};

type PreparedZipInput = ZipInput & {
  archiveName: string;
  size: number;
};

const crcTable = new Uint32Array(256).map((_, index) => {
  let c = index;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function crc32Update(crc: number, buffer: Buffer | Uint8Array) {
  let next = crc;
  for (const byte of buffer) {
    next = crcTable[(next ^ byte) & 0xff] ^ (next >>> 8);
  }
  return next >>> 0;
}

function dosDateTime(date = new Date()) {
  const time =
    (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = Math.max(date.getFullYear() - 1980, 0);
  return {
    time,
    date: (year << 9) | (month << 5) | day,
  };
}

function localHeader(filename: Buffer, crc: number, size: number, useDataDescriptor = false) {
  const { time, date } = dosDateTime();
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(useDataDescriptor ? 0x08 : 0, 6);
  header.writeUInt16LE(0, 8);
  header.writeUInt16LE(time, 10);
  header.writeUInt16LE(date, 12);
  header.writeUInt32LE(useDataDescriptor ? 0 : crc, 14);
  header.writeUInt32LE(useDataDescriptor ? 0 : size, 18);
  header.writeUInt32LE(useDataDescriptor ? 0 : size, 22);
  header.writeUInt16LE(filename.length, 26);
  header.writeUInt16LE(0, 28);
  return Buffer.concat([header, filename]);
}

function dataDescriptor(crc: number, size: number) {
  const descriptor = Buffer.alloc(16);
  descriptor.writeUInt32LE(0x08074b50, 0);
  descriptor.writeUInt32LE(crc, 4);
  descriptor.writeUInt32LE(size, 8);
  descriptor.writeUInt32LE(size, 12);
  return descriptor;
}

function centralHeader(filename: Buffer, crc: number, size: number, offset: number) {
  const { time, date } = dosDateTime();
  const header = Buffer.alloc(46);
  header.writeUInt32LE(0x02014b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(20, 6);
  header.writeUInt16LE(0, 8);
  header.writeUInt16LE(0, 10);
  header.writeUInt16LE(time, 12);
  header.writeUInt16LE(date, 14);
  header.writeUInt32LE(crc, 16);
  header.writeUInt32LE(size, 20);
  header.writeUInt32LE(size, 24);
  header.writeUInt16LE(filename.length, 28);
  header.writeUInt16LE(0, 30);
  header.writeUInt16LE(0, 32);
  header.writeUInt16LE(0, 34);
  header.writeUInt16LE(0, 36);
  header.writeUInt32LE(0, 38);
  header.writeUInt32LE(offset, 42);
  return Buffer.concat([header, filename]);
}

function endOfCentralDirectory(entries: number, centralSize: number, centralOffset: number) {
  const header = Buffer.alloc(22);
  header.writeUInt32LE(0x06054b50, 0);
  header.writeUInt16LE(0, 4);
  header.writeUInt16LE(0, 6);
  header.writeUInt16LE(entries, 8);
  header.writeUInt16LE(entries, 10);
  header.writeUInt32LE(centralSize, 12);
  header.writeUInt32LE(centralOffset, 16);
  header.writeUInt16LE(0, 20);
  return header;
}

function archiveName(filename: string, used: Map<string, number>) {
  const parsed = path.parse(path.basename(filename) || "photo");
  const base = parsed.name || "photo";
  const ext = parsed.ext;
  const key = `${base}${ext}`;
  const current = used.get(key) ?? 0;
  used.set(key, current + 1);
  return current === 0 ? key : `${base}-${current + 1}${ext}`;
}

export async function prepareZip(files: ZipInput[]) {
  const usedNames = new Map<string, number>();
  const prepared: PreparedZipInput[] = [];

  for (const file of files) {
    try {
      const fileStat = await stat(file.absolutePath);
      if (!fileStat.isFile()) {
        continue;
      }
      prepared.push({
        ...file,
        archiveName: archiveName(file.filename, usedNames),
        size: fileStat.size,
      });
    } catch {
      continue;
    }
  }

  const localAndDataSize = prepared.reduce(
    (total, file) => total + 30 + Buffer.byteLength(file.archiveName) + file.size + 16,
    0,
  );
  const centralSize = prepared.reduce(
    (total, file) => total + 46 + Buffer.byteLength(file.archiveName),
    0,
  );

  return {
    files: prepared,
    byteLength: localAndDataSize + centralSize + 22,
  };
}

export async function* streamZip(files: PreparedZipInput[]) {
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const filename = Buffer.from(file.archiveName);
    const local = localHeader(filename, 0, file.size, true);
    yield local;

    let crc = 0xffffffff;
    for await (const chunk of createReadStream(file.absolutePath)) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      crc = crc32Update(crc, buffer);
      yield buffer;
    }

    const finalCrc = (crc ^ 0xffffffff) >>> 0;
    const descriptor = dataDescriptor(finalCrc, file.size);
    yield descriptor;
    centralParts.push(centralHeader(filename, finalCrc, file.size, offset));
    offset += local.byteLength + file.size + descriptor.byteLength;
  }

  const central = Buffer.concat(centralParts);
  yield central;
  yield endOfCentralDirectory(files.length, central.byteLength, offset);
}

export async function createZip(files: ZipInput[]) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const chunks: Buffer[] = [];
    for await (const chunk of createReadStream(file.absolutePath)) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const data = Buffer.concat(chunks);
    const filename = Buffer.from(path.basename(file.filename));
    const crc = crc32(data);
    const local = localHeader(filename, crc, data.byteLength);
    localParts.push(local, data);
    centralParts.push(centralHeader(filename, crc, data.byteLength, offset));
    offset += local.byteLength + data.byteLength;
  }

  const central = Buffer.concat(centralParts);
  const end = endOfCentralDirectory(files.length, central.byteLength, offset);
  return Buffer.concat([...localParts, central, end]);
}
