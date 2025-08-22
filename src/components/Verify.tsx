import React, { useState } from 'react';
import { getCert } from '../db';

export default function Verify(){
  const [certId, setCertId] = useState('');
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const check = async ()=>{
    setError(''); setUrl(null);
    if(!certId){ setError('Enter Certificate ID.'); return; }
    const blob = await getCert(certId.trim());
    if(!blob){ setError('Certificate not found on this device.'); return; }
    const u = URL.createObjectURL(blob);
    setUrl(u);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border rounded-2xl">
      <h2 className="text-xl font-bold mb-2">Verify Certificate</h2>
      <p className="text-sm text-gray-600 mb-4">Enter the Certificate ID provided by the institute.</p>
      <div className="flex gap-2">
        <input value={certId} onChange={e=>setCertId(e.target.value)} className="border p-2 rounded w-full" placeholder="e.g., 1A2B3C4D" />
        <button onClick={check} className="px-3 py-2 rounded bg-blue-600 text-white">Verify</button>
      </div>
      {error && <div className="text-red-600 mt-3 text-sm">{error}</div>}
      {url && (
        <div className="mt-4">
          <div className="font-semibold mb-2">Certificate Preview</div>
          <div className="h-96 border rounded overflow-hidden">
            <iframe src={url} className="w-full h-full" title="Certificate" />
          </div>
          <a href={url} download className="inline-block mt-3 px-3 py-2 rounded bg-green-600 text-white">Download</a>
        </div>
      )}
    </div>
  );
}