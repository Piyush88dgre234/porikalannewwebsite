import React, { useEffect, useMemo, useState } from "react";
import Gallery from "./components/Gallery";

type Course = { id: string; name: string; price: string; desc?: string; duration?: string; };
type TimetableEntry = { id: string; day: string; course: string; time: string; room?: string; };
type Notice = { id: string; title: string; body: string; date: string; };
type User = { role: "admin" | "student"; name: string } | null;

const INSTITUTE_NAME = "Porikalan Computer Institute";
const CONTACT_PHONE = "7896587787";
const CONTACT_WHATSAPP = `https://wa.me/91${CONTACT_PHONE}`;
const CONTACT_ADDRESS = "Rowriah Nefa Gate, Jorhat, Assam";

const LS = { USER:"pori_user", COURSES:"pori_courses", TIMETABLE:"pori_timetable", NOTICES:"pori_notices" };

function loadLS<T>(key: string, fallback: T): T { try{ const raw = localStorage.getItem(key); return raw? JSON.parse(raw) as T : fallback; } catch { return fallback; } }
function saveLS<T>(key: string, value: T) { try{ localStorage.setItem(key, JSON.stringify(value)); } catch {} }

function seedIfEmpty() {
  const courses = loadLS<Course[]>(LS.COURSES, [] as Course[]);
  if (!courses.length) {
    saveLS(LS.COURSES, [
      { id: crypto.randomUUID(), name: "DCA (Diploma in Computer Applications)", price: "₹1000", duration: "6 months" },
      { id: crypto.randomUUID(), name: "ADCA (Advanced Diploma in Computer Applications)", price: "₹1000", duration: "6 months (Evening)" },
      { id: crypto.randomUUID(), name: "Advance Jana", price: "₹1000", duration: "3 months (Advance)" },
    ]);
  }
  const tt = loadLS<TimetableEntry[]>(LS.TIMETABLE, [] as TimetableEntry[]);
  if (!tt.length) {
    saveLS(LS.TIMETABLE, [
      { id: crypto.randomUUID(), day: "Monday", course: "DCA - Basics", time: "6:00 PM - 8:00 PM", room: "Room A" },
      { id: crypto.randomUUID(), day: "Wednesday", course: "ADCA - Practical", time: "6:00 PM - 8:00 PM", room: "Room B" },
      { id: crypto.randomUUID(), day: "Saturday", course: "Advance Jana - Project", time: "10:00 AM - 1:00 PM", room: "Lab 1" },
    ]);
  }
  const notices = loadLS<Notice[]>(LS.NOTICES, [] as Notice[]);
  if (!notices.length) {
    saveLS(LS.NOTICES, [{ id: crypto.randomUUID(), title: "New Batch Starting", body: "DCA new batch starts Sept 1. Register now!", date: new Date().toISOString() }]);
  }
}

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>);
const Section: React.FC<{ id?: string; title?: string; subtitle?: string; children?: React.ReactNode }> = ({ id, title, subtitle, children }) => (
  <section id={id} className="py-12 sm:py-16">
    <Container>
      {title && <h2 className="text-2xl sm:text-3xl font-bold mb-3">{title}</h2>}
      {subtitle && <p className="mb-6 max-w-2xl text-gray-600">{subtitle}</p>}
      {children}
    </Container>
  </section>
);

function NavBar({ route, onNavigate, user, onLogout }: { route: string; onNavigate: (r: string) => void; user: User; onLogout: () => void; }) {
  const links = ["home","courses","timetable","contact"] as const;
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <Container>
        <div className="flex items-center justify-between py-3">
          <div className="font-extrabold text-lg">{INSTITUTE_NAME}</div>
          <div className="hidden md:flex items-center gap-3">
            {links.map(l=>(
              <button key={l} onClick={()=>onNavigate(l)} className={`px-3 py-1 rounded ${route===l? "bg-blue-600 text-white":"text-gray-700"}`}>
                {l[0].toUpperCase()+l.slice(1)}
              </button>
            ))}
            {user ? (<>
              <button onClick={()=>onNavigate("dashboard")} className={`px-3 py-1 rounded ${route==="dashboard"?"bg-blue-600 text-white":"text-gray-700"}`}>Dashboard</button>
              {user.role==="admin" && <button onClick={()=>onNavigate("admin")} className={`px-3 py-1 rounded ${route==="admin"?"bg-blue-600 text-white":"text-gray-700"}`}>Admin</button>}
              <button onClick={onLogout} className="px-3 py-1 rounded bg-red-500 text-white">Logout</button>
            </>) : (<button onClick={()=>onNavigate("login")} className="px-3 py-1 rounded bg-green-600 text-white">Login</button>)}
          </div>
        </div>
      </Container>
    </div>
  );
}

const Hero: React.FC<{ onCTA: () => void }> = ({ onCTA }) => (
  <div className="bg-gradient-to-b from-blue-50 to-transparent py-12">
    <Container>
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="mb-3 text-sm font-medium">Professional Computer Training</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Join <span className="text-blue-600">{INSTITUTE_NAME}</span></h1>
          <p className="mt-4 text-gray-700 max-w-xl">Smart timetable, practical labs, and result oriented coaching. Join our batches and start learning today.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={onCTA} className="px-4 py-2 bg-blue-600 text-white rounded">View Timetable</button>
            <a href={CONTACT_WHATSAPP} target="_blank" rel="noreferrer"><button className="px-4 py-2 bg-green-600 text-white rounded">WhatsApp: {CONTACT_PHONE}</button></a>
          </div>
        </div>
        <div>
          <div className="rounded-2xl p-6 bg-white border shadow">
            <div className="grid grid-cols-1 gap-3">
              <div className="font-semibold">Expert Mentors</div>
              <div className="font-semibold">Complete Notes</div>
              <div className="font-semibold">Result Focused</div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>
);

function CoursesList() {
  const [courses, setCourses] = useState<Course[]>(() => loadLS<Course[]>(LS.COURSES, []));
  useEffect(()=>setCourses(loadLS<Course[]>(LS.COURSES, [])),[]);
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {courses.map(c=>(
        <div key={c.id} className="p-4 bg-white border rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{c.name}</h3>
            <div className="text-sm font-medium">{c.price}</div>
          </div>
          {c.duration && <div className="text-xs text-gray-500 mt-1">Duration: {c.duration}</div>}
          {c.desc && <div className="text-sm text-gray-700 mt-2">{c.desc}</div>}
          <div className="mt-4">
            <a href={CONTACT_WHATSAPP} target="_blank" rel="noreferrer" className="inline-block px-3 py-2 bg-blue-600 text-white rounded">Enroll / WhatsApp</a>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimetableTable({ data }: { data: TimetableEntry[] }) {
  const daysOrder = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const sorted = useMemo(()=>[...data].sort((a,b)=>daysOrder.indexOf(a.day)-daysOrder.indexOf(b.day)),[data]);
  return (
    <div className="overflow-x-auto border rounded-2xl bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-100"><tr><th className="text-left p-3">Day</th><th className="text-left p-3">Course</th><th className="text-left p-3">Time</th><th className="text-left p-3">Room</th></tr></thead>
        <tbody>
          {sorted.map(r=>(
            <tr key={r.id} className="border-t">
              <td className="p-3 font-medium">{r.day}</td>
              <td className="p-3">{r.course}</td>
              <td className="p-3">{r.time}</td>
              <td className="p-3">{r.room ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Login({ onLogin }: { onLogin: (u: { role: "admin" | "student"; name: string }) => void }) {
  const [mobile, setMobile] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  const submit = (e?: React.FormEvent) => { e?.preventDefault();
    if (mobile==="admin" && password==="admin123") { onLogin({ role:"admin", name:"Admin" }); return; }
    if (/^\d{10}$/.test(mobile) && password===mobile.slice(-4)) { onLogin({ role:"student", name:`Student ${mobile.slice(-4)}` }); return; }
    setError("Invalid credentials. Use admin/admin123 or student: 10-digit mobile & password = last4.");
  };
  return (
    <div className="max-w-md mx-auto p-4 bg-white border rounded-2xl">
      <h3 className="font-bold mb-3">Login</h3>
      <form onSubmit={submit} className="space-y-2">
        <input value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Mobile or 'admin'" className="w-full border p-2 rounded" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border p-2 rounded" />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2">
          <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Login</button>
          <button type="button" onClick={()=>{setMobile("");setPassword("");setError("");}} className="px-3 py-2 bg-gray-200 rounded">Clear</button>
        </div>
        <div className="text-xs text-gray-500 mt-2">Demo: admin/admin123 OR student: 10-digit mobile & password = last 4 digits.</div>
      </form>
    </div>
  );
}

function Contact() {
  const [name, setName] = useState(""); const [mobile, setMobile] = useState(""); const [message, setMessage] = useState(""); const [submitted, setSubmitted] = useState(false);
  const submit = (e?: React.FormEvent) => { e?.preventDefault(); setSubmitted(true); setName(""); setMobile(""); setMessage(""); };
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="p-4 bg-white border rounded-2xl">
        <h4 className="font-semibold mb-2">Send us a message</h4>
        <form onSubmit={submit} className="space-y-2">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your Name" className="w-full border p-2 rounded" />
          <input value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Mobile" className="w-full border p-2 rounded" />
          <textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Message" className="w-full border p-2 rounded" />
          <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Submit</button>
          {submitted && <div className="text-green-600 text-sm">Thanks! We received your message.</div>}
        </form>
      </div>
      <div className="p-4 bg-white border rounded-2xl">
        <h4 className="font-semibold mb-2">Direct Contact</h4>
        <div className="mb-2">Phone/WhatsApp: <a href={CONTACT_WHATSAPP} target="_blank" rel="noreferrer" className="underline">{CONTACT_PHONE}</a></div>
        <div className="mb-2">Address: {CONTACT_ADDRESS}</div>
        <iframe title="Map" className="w-full h-48 rounded-xl border" loading="lazy" allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0!2d0!3d0"></iframe>
      </div>
    </div>
  );
}

const Footer: React.FC = () => (
  <footer className="border-t mt-12">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div>© {new Date().getFullYear()} {INSTITUTE_NAME}. All rights reserved.</div>
        <div className="flex items-center gap-2">
          <a href="#" className="underline">Privacy</a>
          <a href="#" className="underline">Terms</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App(): JSX.Element {
  const [route, setRoute] = useState<string>("home");
  const [user, setUser] = useState<User>(null);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);

  useEffect(()=>{ seedIfEmpty(); setTimetable(loadLS<TimetableEntry[]>(LS.TIMETABLE, [])); },[]);

  const onLogin = (u: { role: "admin" | "student"; name: string }) => { setUser(u); setRoute("dashboard"); };
  const onLogout = () => { setUser(null); setRoute("home"); };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <NavBar route={route} onNavigate={setRoute} user={user} onLogout={onLogout} />

      {route==="home" && (<>
        <Hero onCTA={()=>setRoute("timetable")} />
        <Section id="courses" title="Our Courses" subtitle="Carefully designed courses for practical skills.">
          <CoursesList />
        </Section>
        <Gallery />
        <Section id="timetable" title="Weekly Timetable" subtitle="Plan ahead and stay consistent.">
          <TimetableTable data={timetable} />
        </Section>
        <Section id="contact" title="Get in touch" subtitle="Questions about batches, fees, or demo classes?">
          <Contact />
        </Section>
      </>)}

      {route==="courses" && (<Section id="courses-page" title="Courses" subtitle="Pick a course and start today."><CoursesList /></Section>)}
      {route==="timetable" && (<Section id="timetable-page" title="Weekly Timetable" subtitle="Updated regularly by admin."><TimetableTable data={timetable} /></Section>)}
      {route==="contact" && (<Section id="contact-page" title="Contact Us" subtitle="We usually respond within a day."><Contact /></Section>)}
      {route==="login" && (<Section id="login" title="Login" subtitle="Students use your mobile; Admin use admin/admin123."><Login onLogin={(u)=>{onLogin(u)}} /></Section>)}
      {route==="dashboard" && user && (<Section id="dashboard" title="Dashboard" subtitle="Access notices and quick links."><div className="p-4 bg-white border rounded-2xl">Welcome, {user.name}.</div></Section>)}

      <Footer />
    </div>
  );
}
