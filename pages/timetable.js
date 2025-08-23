import Link from 'next/link'
export default function Page(){return <div>
<header className="header">
  <div className="container nav">
    <div className="brand">Porikalan Computer Institute</div>
    <nav className="navlinks">
      <Link href="/"><a>Home</a></Link>
      <Link href="/timetable"><a className="active">Timetable</a></Link>
      <Link href="/timetable"><a>Timetable</a></Link>
      <Link href="/contact"><a>Contact</a></Link>
      <Link href="/admin"><a style={{background:'#0b1223',color:'#fff',padding:'8px 12px',borderRadius:6}}>Admin</a></Link>
    </nav>
  </div>
</header>
<main className="container" style={{padding:'40px 0'}}>
  <h2>Timetable</h2>
  <p style={{color:'#6b7280'}}>Content for Timetable page.</p>
</main>
<footer className="footer">© Porikalan</footer>
</div>}