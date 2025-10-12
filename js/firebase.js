// js/firebase.js
import {
  collection, doc, getDoc, setDoc, onSnapshot, runTransaction,
  updateDoc, deleteField
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

let _db = null;
let _statusRef = null;

export function initFirebase(db){
  _db = db;
  _statusRef = doc(collection(_db, "usage"), "status"); // fields: { active: [], locales: { [name]: "en" } }
}

export function getStatusRef(){ return _statusRef; }

export async function ensureStatusDoc(){
  const snap = await getDoc(_statusRef);
  if (!snap.exists()) {
    await setDoc(_statusRef, { active: [], locales: {} }, { merge: true });
  } else if (!snap.data()?.locales) {
    // backfill the locales object once for older docs
    await setDoc(_statusRef, { locales: {} }, { merge: true });
  }
}

/* ---------- usage list ---------- */
export function listenStatus(cb){
  return onSnapshot(_statusRef, (snap) => {
    const data = snap.data() || { active: [] };
    const active = Array.isArray(data.active) ? data.active : [];
    cb(active);
  });
}

export async function txStart(name, limit){
  await runTransaction(_db, async (tx) => {
    const docSnap = await tx.get(_statusRef);
    const data = docSnap.exists() ? docSnap.data() : { active: [] };
    const active = Array.from(new Set((data.active || []).filter(Boolean)));
    if (active.includes(name)) return;
    if (active.length >= limit) throw new Error("FULL");
    active.push(name);
    tx.set(_statusRef, { active }, { merge: true });
  });
}

export async function txStop(name){
  await runTransaction(_db, async (tx) => {
    const docSnap = await tx.get(_statusRef);
    const data = docSnap.exists() ? docSnap.data() : { active: [] };
    let active = Array.from(new Set((data.active || []).filter(Boolean)));
    if (!active.includes(name)) return;
    active = active.filter(n => n !== name);
    tx.set(_statusRef, { active }, { merge: true });
  });
}

/* ---------- NEW: per-user language prefs ---------- */
/** Subscribe to the whole { [name]: locale } map. */
export function listenLocales(cb){
  return onSnapshot(_statusRef, (snap) => {
    cb(snap.data()?.locales || {});
  });
}

/** Get one user’s saved locale (returns null if none). */
export async function getUserLocale(name){
  if (!name) return null;
  const snap = await getDoc(_statusRef);
  return snap.data()?.locales?.[name] ?? null;
}

/** Save/overwrite one user’s locale without clobbering others. */
export async function setUserLocale(name, locale){
  if (!name || !locale) return;
  await updateDoc(_statusRef, { [`locales.${name}`]: locale });
}

/** Optional helper to remove a stored locale. */
export async function clearUserLocale(name){
  if (!name) return;
  await updateDoc(_statusRef, { [`locales.${name}`]: deleteField() });
}
