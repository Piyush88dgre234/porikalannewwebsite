
Porikalan Next.js Project (Demo)
--------------------------------
Files included:
- pages/* : Next.js pages (index, courses, timetable, contact, admin)
- pages/api/* : API routes - certificates (GET) and upload (POST)
- public/images/* : photos (jpg placeholders) + original HEICs
- public/certs/* : sample.pdf (demo certificate uploaded)
- data/certs.json : demo mapping (Rahul Kumar - 12345 -> sample.pdf)
- styles/globals.css : site styles
- package.json, next.config.js

How it works:
- Home page has a certificate download form which calls GET /api/certificates?name=...&cert=...
- Admin page allows uploading a PDF using POST /api/upload (multipart/form-data)
- The upload handler saves the PDF to public/certs and appends mapping to data/certs.json

Important deployment notes:
- This demo stores uploaded files on the server filesystem (public/certs) and mapping in data/certs.json.
  On many serverless hosts (Vercel, Netlify) the filesystem is ephemeral and writes won't persist between deployments.
- For production you should use a persistent storage (S3 / Cloud Storage) and a proper database (Mongo, Supabase, etc.).
- If you want, I can convert the upload to use Vercel serverless + S3 or Supabase storage — tell me and I'll prepare steps.

Admin credentials (demo): porikalanAdmin123
Demo student: Rahul Kumar / 12345

How to run locally:
1. unzip and run `npm install`
2. `npm run dev`
3. Open http://localhost:3000
