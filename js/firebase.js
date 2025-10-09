// js/firebase.js
import {
  collection, doc, getDoc, setDoc, onSnapshot, runTransaction
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

let _db = null;
let _statusRef = null;

export function initFirebase(db){
  _db = db;
  _statusRef = doc(collection(_db, "usage"), "status");
}

export function getStatusRef(){
  return _statusRef;
}

export async function ensureStatusDoc(){
  const snap = await getDoc(_statusRef);
  if(!snap.exists()){
    await setDoc(_statusRef, { active: [] }, { merge: true });
  }
}

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
