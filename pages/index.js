import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [msg, setMsg] = useState('')
  const check = async (e) => {
    e.preventDefault()
    setMsg('')
    const name = e.target.name.value.trim()
    const cert = e.target.certNo.value.trim()
    if(!name || !cert){ setMsg('Please fill both fields'); return; }
    const res = await fetch('/api/certificates?name='+encodeURIComponent(name)+'&cert='+encodeURIComponent(cert))
    const data = await res.json()
    if(data.ok){
      window.location.href = '/certs/' + data.file
    } else {
      setMsg(data.message || 'Not found')
    }
  }
  return (
    <div>
      <header className="header">
        <div className="container nav">
          <div className="brand">Porikalan Computer Institute</div>
          <nav className="navlinks">
            <Link href="/"><a className="active">Home</a></Link>
            <Link href="/courses"><a>Courses</a></Link>
            <Link href="/timetable"><a>Timetable</a></Link>
            <Link href="/contact"><a>Contact</a></Link>
            <Link href="/admin"><a style={{background:'#0b1223',color:'#fff',padding:'8px 12px',borderRadius:6}}>Admin</a></Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container grid">
            <div>
              <p style={{color:'#6b7280',margin:0}}>Professional Computer Training</p>
              <h1>Join <span style={{color:'#2b7df0'}}>Porikalan Computer Institute</span></h1>
              <p>Smart timetable, practical labs & result oriented coaching. Join our batches & start learning today.</p>
              <div style={{marginTop:16}}>
                <Link href="/timetable"><a className="btn btn-primary">View Timetable</a></Link>
                <a className="btn btn-green" style={{marginLeft:8}} href="https://wa.me/918965877787">WhatsApp: 7896587787</a>
              </div>
            </div>
            <div className="card">
              <h3 style={{marginTop:0}}>Expert Mentors</h3>
              <ul style={{paddingLeft:18,color:'#6b7280'}}>
                <li>Complete Notes</li>
                <li>Result Focused</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="container photos">
          <img src="/images/IMG_4640.jpg" alt="photo1" />
          <img src="/images/IMG_4641.jpg" alt="photo2" />
        </section>

        <section className="certificate-section">
          <h2>Download Your Certificate</h2>
          <div className="certificate-box">
            <form onSubmit={check}>
              <input name="name" placeholder="Enter Your Name" />
              <input name="certNo" placeholder="Enter Certificate Number" />
              <button type="submit">Download</button>
            </form>
            <p style={{color:'#c0392b'}}>{msg}</p>
          </div>
        </section>

        <section className="courses-section container">
          <h2>Our Courses</h2>
          <p style={{color:'#6b7280'}}>Carefully designed courses for practical skills.</p>
          <div className="cards" style={{marginTop:12}}>
            <div className="card">
              <h4>DCA (Diploma in Computer Applications)</h4>
              <p style={{color:'#6b7280'}}>Duration: 6 months</p>
              <div style={{marginTop:12}}><a className="btn btn-primary" href="#">Enroll / WhatsApp</a></div>
            </div>
            <div className="card">
              <h4>ADCA (Advanced Diploma in Computer Applications)</h4>
              <p style={{color:'#6b7280'}}>Duration: 6 months (Evening)</p>
              <div style={{marginTop:12}}><a className="btn btn-primary" href="#">Enroll / WhatsApp</a></div>
            </div>
            <div className="card">
              <h4>Advance Jana</h4>
              <p style={{color:'#6b7280'}}>Duration: 3 months (Advance)</p>
              <div style={{marginTop:12}}><a className="btn btn-primary" href="#">Enroll / WhatsApp</a></div>
            </div>
          </div>
        </section>

        <footer className="footer">
          © Porikalan Computer Institute — Contact: 7896587787
        </footer>
      </main>
    </div>
  )
}
