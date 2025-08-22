const DB_NAME = 'porikalan_cert_db';
const DB_VERSION = 1;
const STORE_CERTS = 'certs';

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_CERTS)) {
        db.createObjectStore(STORE_CERTS);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putCert(certId: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_CERTS, 'readwrite');
    tx.objectStore(STORE_CERTS).put(blob, certId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getCert(certId: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_CERTS, 'readonly');
    const req = tx.objectStore(STORE_CERTS).get(certId);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteCert(certId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_CERTS, 'readwrite');
    tx.objectStore(STORE_CERTS).delete(certId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}