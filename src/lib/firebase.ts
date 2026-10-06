import { initializeApp, getApps } from "firebase/app";
import {
  getMessaging,
  isSupported,
  onMessage,
  MessagePayload,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const getFirebaseMessaging = async () => {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.projectId) return null;
  try {
    if (await isSupported()) {
      return getMessaging(app);
    }
  } catch (err) {
    console.error("[Firebase] getMessaging failed:", err);
  }
  return null;
};

export const onForegroundMessage = async (
  callback: (payload: MessagePayload) => void,
): Promise<(() => void) | null> => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;
  return onMessage(messaging, callback);
};

export { app };
