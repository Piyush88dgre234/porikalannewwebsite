import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'public', 'certs');
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const name = Date.now() + '_' + file.originalname.replace(/\s+/g,'_');
    cb(null, name);
  }
});
const upload = multer({ storage });

const handler = nextConnect({
  onError(err, req, res){ res.status(500).json({ error: err.message }) }
});
handler.use(upload.single('file'));

handler.post((req, res) => {
  const { name, cert } = req.body;
  if(!name || !cert || !req.file) return res.status(400).json({ ok:false, message:'Missing fields' });
  const dataPath = path.join(process.cwd(),'data','certs.json');
  let db = [];
  if(fs.existsSync(dataPath)){
    try{ db = JSON.parse(fs.readFileSync(dataPath,'utf8')) }catch(e){ db=[] }
  }
  db.push({ name: name.trim(), cert: cert.trim(), file: req.file.filename });
  fs.writeFileSync(dataPath, JSON.stringify(db, null, 2));
  res.status(200).json({ ok:true, file: req.file.filename });
});

export const config = { api: { bodyParser: false } };
export default handler;
