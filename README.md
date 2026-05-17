# Emmanuel Rojas Studio

Portal premium para fotógrafo profesional. Sitio público + dashboard admin con galerías privadas protegidas por PIN.

## Stack
- Next.js 15 (App Router) + React 19 + TypeScript
- bcryptjs · sharp · framer-motion · nodemailer
- Storage 100% local: `data/db.json` + `uploads/`
- Build standalone para Hostinger Node.js

## Setup
```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # genera .next/standalone/server.js
```

## Credenciales admin
El usuario inicial es `emma`. El PIN inicial ya está hasheado en `src/lib/admin-auth/config.ts`; no se guarda en texto plano dentro del proyecto.

Para rotar el hash:
```bash
node -e "require('bcryptjs').hash('NUEVO_PIN', 12).then(console.log)"
```

## Deploy en Hostinger
1. Subir repo, `npm install && npm run build` en el servidor.
2. Copiar estáticos: `cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/`.
3. hPanel → Node.js → apuntar a `.next/standalone/server.js`, Node 20+.
4. `chmod 755 data uploads` y dar ownership al usuario de Node.

## Estructura
Ver `docs/proyecto-emmanuel-rojas-studio.pdf` para la especificación completa.
