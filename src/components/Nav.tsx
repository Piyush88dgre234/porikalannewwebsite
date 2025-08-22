import React from 'react';
export default function Nav({ onNavigate, route, onLogout, user }:{ onNavigate:(r:string)=>void; route:string; onLogout:()=>void; user:any }){
  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="font-extrabold text-lg sm:text-xl">Porikalan — Admin</div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={()=>onNavigate('dashboard')} className={`px-3 py-1 rounded ${route==='dashboard'?'bg-blue-600 text-white':'hover:bg-gray-100'}`}>Dashboard</button>
            <button onClick={()=>onNavigate('verify')} className={`px-3 py-1 rounded ${route==='verify'?'bg-blue-600 text-white':'hover:bg-gray-100'}`}>Verify</button>
            {user && <button onClick={onLogout} className="px-3 py-1 rounded bg-red-500 text-white">Logout</button>}
          </div>
        </div>
      </div>
    </div>
  )
}