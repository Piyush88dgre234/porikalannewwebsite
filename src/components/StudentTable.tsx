import React, { useMemo, useState } from 'react';
import { Student } from '../types';
import { formatDate } from '../utils';

export default function StudentTable({ data, onPreview, onDelete }:{
  data: Student[];
  onPreview: (s: Student) => void;
  onDelete: (s: Student) => void;
}) {
  const [q, setQ] = useState('');
  const filtered = useMemo(()=>{
    return data.filter(s =>
      [s.name, s.roll, s.course, s.certId].some(v => v.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q, data]);

  return (
    <div className="bg-white border rounded-2xl overflow-hidden">
      <div className="p-3 border-b flex items-center justify-between gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} className="border p-2 rounded w-full" placeholder="Search by name, roll, course or certificate ID..." />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Roll</th>
              <th className="text-left p-3">Course</th>
              <th className="text-left p-3">Issued</th>
              <th className="text-left p-3">Cert ID</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3">{s.roll}</td>
                <td className="p-3">{s.course}</td>
                <td className="p-3">{formatDate(s.issuedOn)}</td>
                <td className="p-3 font-mono">{s.certId}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={()=>onPreview(s)} className="px-2 py-1 rounded bg-blue-600 text-white">Preview</button>
                  <button onClick={()=>onDelete(s)} className="px-2 py-1 rounded bg-red-500 text-white">Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length===0 && (
              <tr><td className="p-3 text-gray-500" colSpan={6}>No records</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}