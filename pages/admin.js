import {useState} from 'react'
import Link from 'next/link'
export default function Admin(){
  const [ok, setOk] = useState(false)
  const [msg, setMsg] = useState('')
  const login = (e)=>{ e.preventDefault(); const pw = e.target.pw.value; if(pw==='porikalanAdmin123') setOk(true); else alert('Wrong password') }
  const upload = async (e)=>{
    e.preventDefault();
    setMsg('')
    const form = new FormData()
    form.append('name', e.target.name.value)
    form.append('cert', e.target.cert.value)
    form.append('file', e.target.file.files[0])
    const res = await fetch('/api/upload',{method:'POST',body:form})
    const data = await res.json()
    if(data.ok){ setMsg('Uploaded successfully') } else setMsg(data.message || 'Error')
  }
  return (<div>
    <header className="header">
      <div className="container nav">
        <div className="brand">Porikalan Computer Institute</div>
        <nav className="navlinks">
          <Link href="/"><a>Home</a></Link>
          <Link href="/courses"><a>Courses</a></Link>
          <Link href="/timetable"><a>Timetable</a></Link>
          <Link href="/contact"><a>Contact</a></Link>
          <Link href="/admin"><a className="active" style={{background:'#0b1223',color:'#fff',padding:'8px 12px',borderRadius:6}}>Admin</a></Link>
        </nav>
      </div>
    </header>
    <main className="container" style={{padding:'40px 0'}}>
      <h2>Admin Panel</h2>
      {!ok? <form onSubmit={login} style={{maxWidth:480}}><input name="pw" placeholder="Admin password"/><button type="submit" className="btn btn-primary" style={{marginLeft:8}}>Login</button></form> :
      <div>
        <p style={{color:'#6b7280'}}>Upload certificate PDF for student (this demo saves file to server's /public/certs folder — not persistent on many serverless hosts).</p>
        <form onSubmit={upload} style={{maxWidth:480}}>
          <input name="name" placeholder="Student Name"/><br/>
          <input name="cert" placeholder="Certificate Number"/><br/>
          <input name="file" type="file" accept="application/pdf"/><br/><br/>
          <button type="submit" className="btn btn-primary">Upload</button>
        </form>
        <p style={{color:'#1b7a2f'}}>{msg}</p>
      </div>
      }
    </main>
    <footer className="footer">© Porikalan</footer>
  </div>)
}