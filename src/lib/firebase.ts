import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Must pass firestoreDatabaseId from firebaseConfig
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.warn('Firestore Error Context:', JSON.stringify(errInfo));
  return errInfo;
}

// Test connection on boot (non-blocking)
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network restricted.');
    } else {
      console.log('Firebase initialized in project:', firebaseConfig.projectId);
    }
    return false;
  }
}

// Save Order to Firestore
export async function saveOrderToFirestore(orderData: any): Promise<boolean> {
  const path = `orders/${orderData.id}`;
  try {
    await setDoc(doc(db, 'orders', orderData.id), {
      ...orderData,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

// Save Prescription to Firestore
export async function savePrescriptionToFirestore(rxData: any): Promise<boolean> {
  const path = `prescriptions/${rxData.id}`;
  try {
    await setDoc(doc(db, 'prescriptions', rxData.id), {
      ...rxData,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

// Save Chat Message to Firestore
export async function saveChatMessageToFirestore(
  conversationId: string, 
  message: { id: string; sender: string; text: string; timestamp: string }
): Promise<boolean> {
  const path = `conversations/${conversationId}/messages/${message.id}`;
  try {
    await setDoc(doc(db, 'conversations', conversationId), {
      id: conversationId,
      customer: 'عميل صيدليات البنداري',
      channel: 'web',
      status: 'active',
      lastMessage: message.text,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    await setDoc(doc(db, 'conversations', conversationId, 'messages', message.id), {
      ...message,
      conversationId
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

// Run non-blocking connection check
testConnection();
