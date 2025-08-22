import React, { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Admin from './components/Admin';
import Verify from './components/Verify';
import { User } from './types';

const INSTITUTE = { name: 'Porikalan Computer Institute' };

const LS_USER = 'porikalan_user';

function loadLS<T>(key:string, fallback:T):T{
  try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; }catch{ return fallback; }
}
function saveLS<T>(key:string, val:T){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch{} }

export default function App(){
  const [route, setRoute] = useState<'dashboard'|'verify'>('dashboard');
  const [user, setUser] = useState<User>(loadLS<User>(LS_USER, null));

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    if(params.get('verify')) setRoute('verify');
  }, []);

  const onLogout = ()=>{ setUser(null); saveLS(LS_USER, null); };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Nav onNavigate={setRoute} route={route} onLogout={onLogout} user={user} />
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {route==='dashboard' && <Admin />}
          {route==='verify' && <Verify />}
        </div>
      </section>

      <footer className="border-t mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 text-sm text-center">© {new Date().getFullYear()} {INSTITUTE.name}. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}