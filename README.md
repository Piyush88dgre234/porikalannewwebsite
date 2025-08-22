# Porikalan — Admin Dashboard (Certificates)

React + TypeScript (Vite) app with:
- **Admin login** (demo: `admin` / `admin123`)
- **Upload student certificate files** (PDF/JPG/PNG) to **IndexedDB**
- **Student table** with search, preview, delete
- **Public Verify page** to check certificate by ID

> ⚠️ Static app (no server). Files are saved **locally in the browser (IndexedDB)** of the device where you upload them. For real online storage for all users, connect a backend (Supabase/S3/Firebase).

## Run locally
```bash
npm install
npm run dev
```

## Deploy (Vercel)
- Push to GitHub, import in Vercel.
- Framework: **Vite**
- Build: `npm run build`
- Output: `dist`

## How it works
1. Go to **Dashboard** → Login with `admin/admin123`
2. Fill **Name, Roll, Course, Issued date**, choose a **certificate file** and **Save**
3. A short **Certificate ID** (e.g., `1A2B3C4D`) is generated.
4. Use **Preview** to view/download. Share the ID with students.
5. Anyone can open the site → **Verify** tab → enter ID to view/download (works only on the device where uploaded, unless you add a backend).

## Backup/Restore
Use browser devtools → Application → IndexedDB to export blobs, or extend `db.ts` for export/import.
