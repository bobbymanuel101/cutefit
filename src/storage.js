// Stand-in for the storage API the app used inside Claude.
// Saves to IndexedDB on the phone, which has room for machine photos.
// When someone is logged in, every key is stored under their user id, so two
// people sharing a phone never see each other's data.
const DB = "cutefit";
const STORE = "kv";
const CLAIMED = "cutefit:device-data-claimed";

let prefix = "";

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

const allKeys = () => run("readonly", (s) => s.getAllKeys());

window.storage = {
  async get(key) {
    const value = await run("readonly", (s) => s.get(prefix + key));
    return value === undefined ? null : { key, value };
  },
  async set(key, value) {
    await run("readwrite", (s) => s.put(value, prefix + key));
    return { key, value };
  },
  async delete(key) {
    await run("readwrite", (s) => s.delete(prefix + key));
    return { key, deleted: true };
  },
};

// Called when someone logs in (id) or the app runs without login (null).
// The first person to log in on this phone takes over the data that was saved
// before login existed, so nobody loses their history.
export async function setStorageUser(userId) {
  prefix = userId ? `u:${userId}:` : "";
  if (!userId) return;
  try {
    const claimed = await run("readonly", (s) => s.get(CLAIMED));
    if (claimed) return;
    const keys = (await allKeys()).filter((k) => typeof k === "string" && !k.startsWith("u:") && k !== CLAIMED);
    for (const k of keys) {
      const v = await run("readonly", (s) => s.get(k));
      await run("readwrite", (s) => s.put(v, `u:${userId}:${k}`));
      await run("readwrite", (s) => s.delete(k));
    }
    await run("readwrite", (s) => s.put(userId, CLAIMED));
  } catch (e) {
    console.error("Could not move saved data to this account", e);
  }
}

// Removes everything this phone stored for one user (after deleting their account).
export async function clearStorageFor(userId) {
  const mine = (await allKeys()).filter((k) => typeof k === "string" && k.startsWith(`u:${userId}:`));
  for (const k of mine) await run("readwrite", (s) => s.delete(k));
}

// Ask the browser not to clear saved data when the phone is low on space
if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
