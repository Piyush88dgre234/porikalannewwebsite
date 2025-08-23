import fs from 'fs'
import path from 'path'

export default function handler(req, res){
  const { name, cert } = req.query
  const dataPath = path.join(process.cwd(),'data','certs.json')
  let db = []
  if(fs.existsSync(dataPath)){
    try{ db = JSON.parse(fs.readFileSync(dataPath,'utf8')) }catch(e){ db=[] }
  }
  const found = db.find(r => r.name.toLowerCase() === (name||'').toLowerCase() && r.cert === (cert||''))
  if(found){
    res.status(200).json({ ok:true, file: found.file })
  } else {
    res.status(200).json({ ok:false, message:'No record found' })
  }
}
