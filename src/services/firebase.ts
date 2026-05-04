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

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      await provisionUser(result.user);
    }
    return result.user;
  } catch (error) {
    console.error("Auth Error:", error);
    // If it's a popup closed by user, don't throw too aggressively maybe?
    // But better to throw so UI can react
    throw error;
  }
};

async function provisionUser(user: User) {
  const userRef = doc(db, 'users', user.uid);
  try {
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
      console.log("User provisioned successfully");
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
}

export const saveSession = async (userId: string, session: Partial<ChatSession>) => {
  const sessionId = session.id || doc(collection(db, 'users', userId, 'sessions')).id;
  const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
  
  try {
    await setDoc(sessionRef, {
      ...session,
      id: sessionId,
      userId,
      updatedAt: serverTimestamp(),
      createdAt: session.createdAt || serverTimestamp(),
    }, { merge: true });
    
    return sessionId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/sessions/${sessionId}`);
    return sessionId;
  }
};

export const getSessions = async (userId: string): Promise<ChatSession[]> => {
  const sessionsRef = collection(db, 'users', userId, 'sessions');
  const q = query(sessionsRef, orderBy('updatedAt', 'desc'));
  try {
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as ChatSession));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `users/${userId}/sessions`);
    return [];
  }
};

export const getSession = async (userId: string, sessionId: string): Promise<ChatSession | null> => {
  const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
  try {
    const snap = await getDoc(sessionRef);
    if (snap.exists()) {
      return { ...snap.data(), id: snap.id } as ChatSession;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${userId}/sessions/${sessionId}`);
    return null;
  }
};

export const logout = () => auth.signOut();

export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', userId);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${userId}`);
    return null;
  }
};
