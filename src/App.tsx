import React, { useEffect, useMemo, useState } from "react";

// =========================
// Porikalan — App.tsx (TypeScript React)
// Clean, dependency-light single-file app suitable for Vite (React + TS)
// Save as src/App.tsx in a Vite + React + TypeScript project.
// =========================

// ---------------- Types ----------------
type Course = {
  id: string;
  name: string;
  price: string;
  desc?: string;
  duration?: string;
};

type TimetableEntry = {
  id: string;
  day: string;
  course: string;
  time: string;
  room?: string;
};

type Notice = {
  id: string;
  title: string;
  body: string;
  date: string; // ISO
};

type ContactEntry = {
  id: string;
  name: string;
  mobile: string;
  message: string;
  date: string;
};

type User = { role: "admin" | "student"; name: string } | null;

// ---------------- Constants & LocalStorage Keys ----------------
const INSTITUTE_NAME = "Porikalan Computer Institute";
const CONTACT_PHONE = "7896587787";
const CONTACT_WHATSAPP = `https://wa.me/91${CONTACT_PHONE}`; // international prefix for wa.me
const CONTACT_ADDRESS = "Rowriah Nefa Gate, Jorhat, Assam";

const LS = {
  USER: "porikalan_user",
  COURSES: "porikalan_courses",
  TIMETABLE: "porikalan_timetable",
  NOTICES: "porikalan_notices",
  CONTACTS: "porikalan_contacts",
};

// Generic localStorage helpers
function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// ---------------- Seed Data (first run) ----------------
function seedIfEmpty() {
  const courses = loadLS<Course[]>(LS.COURSES, [] as Course[]);
  if (!courses || courses.length === 0) {
    const seedCourses: Course[] = [
      { id: crypto.randomUUID(), name: "DCA (Diploma in Computer Applications)", price: "₹1000", duration: "6 months" },
      { id: crypto.randomUUID(), name: "ADCA (Advanced Diploma in Computer Applications)", price: "₹1000", duration: "6 months (Evening)" },
      { id: crypto.randomUUID(), name: "Advance Jana", price: "₹1000", duration: "3 months (Advance)" },
    ];
    saveLS(LS.COURSES, seedCourses);
  }

  const tt = loadLS<TimetableEntry[]>(LS.TIMETABLE, [] as TimetableEntry[]);
  if (!tt || tt.length === 0) {
    const seedTT: TimetableEntry[] = [
      { id: crypto.randomUUID(), day: "Monday", course: "DCA - Basics", time: "6:00 PM - 8:00 PM", room: "Room A" },
      { id: crypto.randomUUID(), day: "Wednesday", course: "ADCA - Practical", time: "6:00 PM - 8:00 PM", room: "Room B" },
      { id: crypto.randomUUID(), day: "Saturday", course: "Advance Jana - Project", time: "10:00 AM - 1:00 PM", room: "Lab 1" },
    ];
    saveLS(LS.TIMETABLE, seedTT);
  }

  const notices = loadLS<Notice[]>(LS.NOTICES, [] as Notice[]);
  if (!notices || notices.length === 0) {
    const seedNotices: Notice[] = [
      { id: crypto.randomUUID(), title: "New Batch Starting", body: "DCA new batch starts Sept 1. Register now!", date: new Date().toISOString() },
    ];
    saveLS(LS.NOTICES, seedNotices);
  }
}

// ---------------- Small UI Atoms ----------------
const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
);

const Section: React.FC<{ id?: string; title?: string; subtitle?: string; children?: React.ReactNode }> = ({ id, title, subtitle, children }) => (
  <section id={id} className="py-12 sm:py-16">
    <Container>
      {title && <h2 className="text-2xl sm:text-3xl font-bold mb-3">{title}</h2>}
      {subtitle && <p className="text-muted-foreground mb-6 max-w-2xl">{subtitle}</p>}
      {children}
    </Container>
  </section>
);

// ---------------- NavBar ----------------
function NavBar({ route, onNavigate, user, onLogout }: { route: string; onNavigate: (r: string) => void; user: User; onLogout: () => void; }) {
  const [open, setOpen] = useState(false);
  const links = ["home", "courses", "timetable", "contact"] as const;

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <Container>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="font-extrabold text-lg">{INSTITUTE_NAME}</div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {links.map((l) => (
              <button key={l} onClick={() => onNavigate(l)} className={`px-3 py-1 rounded ${route === l ? "bg-blue-600 text-white" : "text-gray-700"}`}>
                {l[0].toUpperCase() + l.slice(1)}
              </button>
            ))}

            {user ? (
              <>
                <button onClick={() => onNavigate("dashboard")} className={`px-3 py-1 rounded ${route === "dashboard" ? "bg-blue-600 text-white" : "text-gray-700"}`}>Dashboard</button>
                {user.role === "admin" && <button onClick={() => onNavigate("admin")} className={`px-3 py-1 rounded ${route === "admin" ? "bg-blue-600 text-white" : "text-gray-700"}`}>Admin</button>}
                <button onClick={onLogout} className="px-3 py-1 rounded bg-red-500 text-white">Logout</button>
              </>
            ) : (
              <button onClick={() => onNavigate("login")} className="px-3 py-1 rounded bg-green-600 text-white">Login</button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setOpen((s) => !s)} className="px-3 py-1 rounded bg-gray-100">Menu</button>
          </div>
        </div>
        {open && (
          <div className="md:hidden pb-3 flex flex-col gap-2">
            {links.map((l) => (
              <button key={l} onClick={() => { onNavigate(l); setOpen(false); }} className={`text-left px-3 py-2 rounded ${route === l ? "bg-blue-600 text-white" : "text-gray-700"}`}>{l[0].toUpperCase()+l.slice(1)}</button>
            ))}
            {user ? (
              <>
                <button onClick={() => { onNavigate("dashboard"); setOpen(false); }} className="text-left px-3 py-2 rounded">Dashboard</button>
                {user.role === "admin" && <button onClick={() => { onNavigate("admin"); setOpen(false); }} className="text-left px-3 py-2 rounded">Admin</button>}
                <button onClick={() => { onLogout(); setOpen(false); }} className="text-left px-3 py-2 rounded text-red-600">Logout</button>
              </>
            ) : (
              <button onClick={() => { onNavigate("login"); setOpen(false); }} className="text-left px-3 py-2 rounded bg-green-600 text-white">Login</button>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

// ---------------- Hero ----------------
const Hero: React.FC<{ onCTA: () => void }> = ({ onCTA }) => (
  <div className="bg-gradient-to-b from-blue-50 to-transparent py-12">
    <Container>
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="mb-3 text-sm font-medium">Professional Computer Training</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Join <span className="text-blue-600">{INSTITUTE_NAME}</span></h1>
          <p className="mt-4 text-gray-700 max-w-xl">Smart timetable, practical labs, && result oriented coaching. Join our batches && start learning today.</p>
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

// ---------------- Courses ----------------
function CoursesList() {
  const [courses, setCourses] = useState<Course[]>(() => loadLS<Course[]>(LS.COURSES, []));

  useEffect(() => {
    setCourses(loadLS<Course[]>(LS.COURSES, []));
  }, []);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {courses.map((c) => (
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

// ---------------- Timetable ----------------
function TimetableTable({ data }: { data: TimetableEntry[] }) {
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sorted = useMemo(() => [...data].sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)), [data]);

  return (
    <div className="overflow-x-auto border rounded-2xl bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Day</th>
            <th className="text-left p-3">Course</th>
            <th className="text-left p-3">Time</th>
            <th className="text-left p-3">Room</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
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

// ---------------- Admin Timetable Editor ----------------
function AdminTimetableEditor({ timetable, setTimetable }: { timetable: TimetableEntry[]; setTimetable: (t: TimetableEntry[]) => void; }) {
  const empty = { id: "", day: "Monday", course: "", time: "", room: "" };
  const [form, setForm] = useState<TimetableEntry>(empty as TimetableEntry);

  useEffect(() => {
    if (!form.id) setForm({ ...form, id: crypto.randomUUID() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addRow = () => {
    const row = { ...form, id: crypto.randomUUID() } as TimetableEntry;
    const next = [...timetable, row];
    setTimetable(next);
    saveLS(LS.TIMETABLE, next);
    setForm({ ...empty, id: crypto.randomUUID() } as TimetableEntry);
  };

  const removeRow = (id: string) => {
    const next = timetable.filter((r) => r.id != id);
    setTimetable(next);
    saveLS(LS.TIMETABLE, next);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="border p-2 rounded" placeholder="Day (e.g., Monday)" />
        <input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="border p-2 rounded" placeholder="Course" />
        <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="border p-2 rounded" placeholder="Time" />
        <input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className="border p-2 rounded" placeholder="Room" />
      </div>
      <div className="flex gap-2">
        <button onClick={addRow} className="px-3 py-2 bg-blue-600 text-white rounded">Add Row</button>
      </div>

      <div className="overflow-x-auto border rounded-2xl bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Day</th>
              <th className="text-left p-3">Course</th>
              <th className="text-left p-3">Time</th>
              <th className="text-left p-3">Room</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-medium">{r.day}</td>
                <td className="p-3">{r.course}</td>
                <td className="p-3">{r.time}</td>
                <td className="p-3">{r.room ?? "-"}</td>
                <td className="p-3">
                  <button onClick={() => removeRow(r.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- Auth (simple demo) ----------------
function Login({ onLogin }: { onLogin: (u: { role: "admin" | "student"; name: string }) => void }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    // Demo logic:
    // admin: mobile === "admin" && password === "admin123"
    // student: mobile is 10-digit, password = last4
    if (mobile === "admin" && password === "admin123") {
      onLogin({ role: "admin", name: "Admin" });
      return;
    }
    if (/^\d{10}$/.test(mobile) && password === mobile.slice(-4)) {
      onLogin({ role: "student", name: `Student ${mobile.slice(-4)}` });
      return;
    }
    setError("Invalid credentials. Use admin/admin123 or student: 10-digit mobile & password = last4.");
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white border rounded-2xl">
      <h3 className="font-bold mb-3">Login</h3>
      <form onSubmit={submit} className="space-y-2">
        <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile or 'admin'" className="w-full border p-2 rounded" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border p-2 rounded" />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2">
          <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Login</button>
          <button type="button" onClick={() => { setMobile(""); setPassword(""); setError(""); }} className="px-3 py-2 bg-gray-200 rounded">Clear</button>
        </div>
        <div className="text-xs text-gray-500 mt-2">Demo: admin/admin123 OR student: 10-digit mobile & password = last 4 digits.</div>
      </form>
    </div>
  );
}

// ---------------- Dashboard ----------------
function Dashboard({ user }: { user: NonNullable<User> }) {
  const notices = loadLS<Notice[]>(LS.NOTICES, []);

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2">
        <div className="p-4 bg-white border rounded-2xl">
          <h3 className="font-semibold">Welcome, {user.name}</h3>
          <p className="text-sm text-gray-600">Here are the latest notices.</p>
          <ul className="mt-4 space-y-3">
            {notices.map((n) => (
              <li key={n.id} className="border rounded p-3">
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm text-gray-600">{n.body}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="p-4 bg-white border rounded-2xl">
          <h4 className="font-semibold">Quick Actions</h4>
          <div className="mt-3 flex flex-col gap-2">
            <a href="#timetable" className="px-3 py-2 bg-blue-600 text-white rounded text-center">View Timetable</a>
            <a href={CONTACT_WHATSAPP} target="_blank" rel="noreferrer" className="px-3 py-2 bg-green-600 text-white rounded text-center">WhatsApp Institute</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Admin Panel ----------------
function AdminPanel({ timetable, setTimetable }: { timetable: TimetableEntry[]; setTimetable: (t: TimetableEntry[]) => void; }) {
  const [notices, setNotices] = useState<Notice[]>(loadLS<Notice[]>(LS.NOTICES, []));
  const [nTitle, setNTitle] = useState("");
  const [nBody, setNBody] = useState("");

  const addNotice = () => {
    if (!nTitle.trim()) return;
    const next = [{ id: crypto.randomUUID(), title: nTitle, body: nBody, date: new Date().toISOString() }, ...notices];
    setNotices(next);
    saveLS(LS.NOTICES, next);
    setNTitle(""); setNBody("");
  };

  const removeNotice = (id: string) => {
    const next = notices.filter((n) => n.id !== id);
    setNotices(next);
    saveLS(LS.NOTICES, next);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white border rounded-2xl">
        <h4 className="font-semibold mb-2">Create Notice</h4>
        <input value={nTitle} onChange={(e) => setNTitle(e.target.value)} placeholder="Title" className="w-full border p-2 rounded mb-2" />
        <textarea value={nBody} onChange={(e) => setNBody(e.target.value)} placeholder="Body" className="w-full border p-2 rounded mb-2" />
        <div className="flex gap-2">
          <button onClick={addNotice} className="px-3 py-2 bg-blue-600 text-white rounded">Publish Notice</button>
        </div>
      </div>

      <div className="p-4 bg-white border rounded-2xl">
        <h4 className="font-semibold mb-2">All Notices</h4>
        <ul className="space-y-3">
          {notices.map((n) => (
            <li key={n.id} className="border rounded p-3 flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm text-gray-600">{n.body}</div>
              </div>
              <button onClick={() => removeNotice(n.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 bg-white border rounded-2xl">
        <h4 className="font-semibold mb-2">Edit Timetable</h4>
        <AdminTimetableEditor timetable={timetable} setTimetable={setTimetable} />
      </div>
    </div>
  );
}

// ---------------- Contact ----------------
function Contact() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const all = loadLS<ContactEntry[]>(LS.CONTACTS, []);
    const next = [{ id: crypto.randomUUID(), name, mobile, message, date: new Date().toISOString() }, ...all];
    saveLS(LS.CONTACTS, next);
    setSubmitted(true);
    setName(""); setMobile(""); setMessage("");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="p-4 bg-white border rounded-2xl">
        <h4 className="font-semibold mb-2">Send us a message</h4>
        <form onSubmit={submit} className="space-y-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full border p-2 rounded" />
          <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile" className="w-full border p-2 rounded" />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="w-full border p-2 rounded" />
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

// ---------------- Footer ----------------
const Footer: React.FC = () => (
  <footer className="border-t mt-12">
    <Container>
      <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div>© {new Date().getFullYear()} {INSTITUTE_NAME}. All rights reserved.</div>
        <div className="flex items-center gap-2">
          <a href="#" className="underline">Privacy</a>
          <a href="#" className="underline">Terms</a>
        </div>
      </div>
    </Container>
  </footer>
);

// ---------------- Root App ----------------
export default function App(): JSX.Element {
  const [route, setRoute] = useState<string>("home");
  const [user, setUser] = useState<User>(loadLS<User>(LS.USER, null));
  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => loadLS<TimetableEntry[]>(LS.TIMETABLE, []));

  useEffect(() => {
    seedIfEmpty();
    setTimetable(loadLS<TimetableEntry[]>(LS.TIMETABLE, []));
    const u = loadLS<User>(LS.USER, null);
    setUser(u);
  }, []);

  const onLogin = (u: { role: "admin" | "student"; name: string }) => {
    setUser(u); saveLS(LS.USER, u); setRoute("dashboard");
  };

  const onLogout = () => {
    setUser(null); saveLS(LS.USER, null); setRoute("home");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <NavBar route={route} onNavigate={setRoute} user={user} onLogout={onLogout} />

      {route === "home" && (
        <>
          <Hero onCTA={() => setRoute("timetable")} />
          <Section id="courses" title="Our Courses" subtitle="Carefully designed courses for practical skills.">
            <CoursesList />
          </Section>
          <Section id="timetable" title="Weekly Timetable" subtitle="Plan ahead && stay consistent.">
            <TimetableTable data={timetable} />
          </Section>
          <Section id="contact" title="Get in touch" subtitle="Questions about batches, fees, or demo classes?">
            <Contact />
          </Section>
        </>
      )}

      {route === "courses" && (
        <Section id="courses-page" title="Courses" subtitle="Pick a course && start today.">
          <CoursesList />
        </Section>
      )}

      {route === "timetable" && (
        <Section id="timetable-page" title="Weekly Timetable" subtitle="Updated regularly by admin.">
          <TimetableTable data={timetable} />
        </Section>
      )}

      {route === "contact" && (
        <Section id="contact-page" title="Contact Us" subtitle="We usually respond within a day.">
          <Contact />
        </Section>
      )}

      {route === "login" && (
        <Section id="login" title="Login" subtitle="Students use your mobile; Admin use admin/admin123.">
          <Login onLogin={onLogin} />
        </Section>
      )}

      {route === "dashboard" && user && (
        <Section id="dashboard" title="Dashboard" subtitle="Access notices && quick links.">
          <Dashboard user={user} />
        </Section>
      )}

      {route === "admin" && user?.role === "admin" && (
        <Section id="admin" title="Admin Panel" subtitle="Manage notices && timetable.">
          <AdminPanel timetable={timetable} setTimetable={(t) => { setTimetable(t); saveLS(LS.TIMETABLE, t); }} />
        </Section>
      )}

      <Footer />
    </div>
  );
}
