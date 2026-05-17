import bcrypt from "bcryptjs";

const COST_FACTOR = 12;

export async function hashPin(pin: string) {
  return bcrypt.hash(pin, COST_FACTOR);
}

export async function verifyPin(pin: string, hash: string) {
  if (!pin || !hash) {
    return false;
  }

  return bcrypt.compare(pin, hash);
}

export function isValidClientPin(pin: string) {
  return /^\d{4,6}$/.test(pin);
}
