import React, { useEffect, useState } from 'react';
import { Student } from '../types';
import { uuid } from '../utils';
import StudentTable from './StudentTable';
import { putCert, getCert, deleteCert } from '../db';

const LS_STUDENTS = 'porikalan_students';
const LS_USER = 'porikalan_user';

function loadLS<T>(key:string, fallback:T):T{
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  }catch{ return fallback; }
}
function saveLS<T>(key:string, val:T){
  try{ localStorage.setItem(key, JSON.stringify(val)); }catch{}
}

export default function Admin(){
  const [user, setUser] = useState<any>(loadLS(LS_USER, null));
  const [students, setStudents] = useState<Student[]>(loadLS<Student[]>(LS_STUDENTS, []));
  const [form, setForm] = useState<{name:string; roll:string; course:string; issuedOn:string; file:File|null}>({
    name:'', roll:'', course:'', issuedOn: new Date().toISOString().slice(0,10), file: null
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>('');

  useEffect(()=>{ saveLS(LS_STUDENTS, students); },[students]);

  const login = (mobile:string, pass:string)=>{
    if(mobile==='admin' && pass==='admin123'){
      const u = { role:'admin', name:'Admin'}; setUser(u); saveLS(LS_USER, u);
    } else {
      alert('Use admin/admin123 for this demo.');
    }
  };
  const logout = ()=>{ setUser(null); saveLS(LS_USER, null); };

  const addStudent = async ()=>{
    if(!form.name || !form.roll || !form.course || !form.file){
      alert('Please fill all fields and choose a certificate file.');
      return;
    }
    const id = uuid();
    const certId = uuid().slice(0,8).toUpperCase();
    const issuedOnISO = new Date(form.issuedOn).toISOString();
    await putCert(certId, form.file);
    const rec: Student = { id, name: form.name, roll: form.roll, course: form.course, issuedOn: issuedOnISO, certId };
    setStudents(prev => [rec, ...prev]);
    setForm({ name:'', roll:'', course:'', issuedOn: new Date().toISOString().slice(0,10), file:null });
    alert('Student & certificate saved.');
  };

  const onPreview = async (s: Student)=>{
    const blob = await getCert(s.certId);
    if(!blob){ alert('Certificate blob not found (maybe cleared browser storage).'); return; }
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setPreviewName(`${s.name} — ${s.certId}`);
  };

  const onDelete = async (s: Student)=>{
    if(!confirm('Delete this student & certificate?')) return;
    await deleteCert(s.certId);
    setStudents(prev => prev.filter(x=>x.id!==s.id));
  };

  if(!user){
    let mobile = ''; let pass='';
    return (
      <div className="max-w-md mx-auto p-6 bg-white border rounded-2xl mt-10">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <div className="space-y-3">
          <input onChange={e=>mobile=e.target.value} className="w-full border p-2 rounded" placeholder="Username: admin" />
          <input onChange={e=>pass=e.target.value} className="w-full border p-2 rounded" placeholder="Password: admin123" type="password" />
          <button onClick={()=>login(mobile, pass)} className="px-4 py-2 rounded bg-blue-600 text-white">Login</button>
        </div>
        <p className="text-xs text-gray-500 mt-3">Demo credentials: admin / admin123</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button onClick={logout} className="px-3 py-1 rounded bg-red-500 text-white">Logout</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 p-4 bg-white border rounded-2xl">
          <h3 className="font-semibold mb-3">Add Student & Certificate</h3>
          <div className="space-y-2">
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full border p-2 rounded" placeholder="Student Name" />
            <input value={form.roll} onChange={e=>setForm({...form, roll:e.target.value})} className="w-full border p-2 rounded" placeholder="Roll No." />
            <input value={form.course} onChange={e=>setForm({...form, course:e.target.value})} className="w-full border p-2 rounded" placeholder="Course" />
            <input value={form.issuedOn} onChange={e=>setForm({...form, issuedOn:e.target.value})} type="date" className="w-full border p-2 rounded" />
            <input onChange={e=>setForm({...form, file: e.target.files?.[0] ?? null})} type="file" accept=".pdf,image/*" className="w-full border p-2 rounded" />
            <button onClick={addStudent} className="px-3 py-2 bg-blue-600 text-white rounded w-full">Save</button>
            <p className="text-xs text-gray-500">Accepted: PDF/JPG/PNG. Files are stored <b>locally</b> in your browser (IndexedDB).</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <StudentTable data={students} onPreview={onPreview} onDelete={onDelete} />
          {previewUrl && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6">
              <div className="bg-white rounded-2xl w-full max-w-3xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{previewName}</div>
                  <button className="px-2 py-1 rounded bg-gray-200" onClick={()=>{ URL.revokeObjectURL(previewUrl!); setPreviewUrl(null); }}>Close</button>
                </div>
                <div className="h-[70vh] overflow-auto border rounded">
                  <iframe src={previewUrl} title="Preview" className="w-full h-full" />
                </div>
                <div className="mt-3 flex gap-2">
                  <a href={previewUrl} download className="px-3 py-2 rounded bg-blue-600 text-white">Download</a>
                  <button onClick={()=>{ navigator.clipboard.writeText(window.location.origin + '/?verify=' ); alert('Share the certificate ID with student.'); }} className="px-3 py-2 rounded bg-green-600 text-white">Copy Verify Link</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}