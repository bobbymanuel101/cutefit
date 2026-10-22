// Stand-in for the storage API the app used inside Claude.
// Saves to IndexedDB on the phone, which has room for machine photos.
const DB = "cutefit";
const STORE = "kv";

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run(mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req.result);
    tx.onerror = () => reject(tx.error);
  });
}

window.storage = {
  async get(key) {
    const value = await run("readonly", (s) => s.get(key));
    return value === undefined ? null : { key, value };
  },
  async set(key, value) {
    await run("readwrite", (s) => s.put(value, key));
    return { key, value };
  },
  async delete(key) {
    await run("readwrite", (s) => s.delete(key));
    return { key, deleted: true };
  },
};

// Ask the browser not to clear saved data when the phone is low on space
if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
