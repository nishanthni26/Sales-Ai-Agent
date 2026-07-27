import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Auth instance
export const auth = getAuth(app);

// Firestore instance with custom databaseId if specified
const dbId = (firebaseConfig as any).firestoreDatabaseId;
export const db = dbId && dbId !== "(default)" ? getFirestore(app, dbId) : getFirestore(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const microsoftProvider = new OAuthProvider("microsoft.com");

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  limit,
};
export type { FirebaseUser };

// Helper to save user profile to Firestore
export async function saveUserProfileToFirestore(user: FirebaseUser, extraData?: { companyName?: string; role?: string }) {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || user.email?.split("@")[0] || "Sales Executive",
      photoURL: user.photoURL || "",
      companyName: extraData?.companyName || "Acme Sales Corp",
      role: extraData?.role || "Account Executive",
      createdAt: new Date().toISOString(),
    });
  } else if (extraData) {
    await updateDoc(userRef, {
      ...extraData,
      updatedAt: new Date().toISOString(),
    });
  }
}

// Auth login methods
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  if (result.user) {
    await saveUserProfileToFirestore(result.user);
  }
  return result.user;
}

export async function loginWithMicrosoft() {
  const result = await signInWithPopup(auth, microsoftProvider);
  if (result.user) {
    await saveUserProfileToFirestore(result.user);
  }
  return result.user;
}
