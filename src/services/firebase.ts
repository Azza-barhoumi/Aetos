import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  orderBy,
  getDocs
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, ChatSession } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    await provisionUser(result.user);
    return result.user;
  } catch (error) {
    console.error("Auth Error:", error);
    throw error;
  }
};

async function provisionUser(user: User) {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Initializing the Career Twin profile
    const newUser: UserProfile = {
      name: user.displayName || 'Ambassador',
      email: user.email || '',
      persona: [],
      careerMatches: [],
    };

    await setDoc(userRef, {
      ...newUser,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export const saveSession = async (userId: string, session: Partial<ChatSession>) => {
  const sessionId = session.id || doc(collection(db, 'users', userId, 'sessions')).id;
  const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
  
  await setDoc(sessionRef, {
    ...session,
    id: sessionId,
    userId,
    updatedAt: serverTimestamp(),
    createdAt: session.createdAt || serverTimestamp(),
  }, { merge: true });
  
  return sessionId;
};

export const getSessions = async (userId: string): Promise<ChatSession[]> => {
  const sessionsRef = collection(db, 'users', userId, 'sessions');
  const q = query(sessionsRef, orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  
  return snap.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  } as ChatSession));
};

export const getSession = async (userId: string, sessionId: string): Promise<ChatSession | null> => {
  const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
  const snap = await getDoc(sessionRef);
  if (snap.exists()) {
    return { ...snap.data(), id: snap.id } as ChatSession;
  }
  return null;
};

export const logout = () => auth.signOut();

export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
};
