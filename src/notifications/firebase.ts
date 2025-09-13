// src/notifications/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import {firebaseConfig} from "@/notifications/firebaseConfig";
import { toastMessage } from "@/lib/utils/toast-message";

// Firebase config type
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Initialize Firebase (safe for SSR)
const app: FirebaseApp = initializeApp(firebaseConfig);

// Only initialize messaging in the browser
let messaging: any;
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

const generateToken = async (): Promise<string | null | undefined> => {
  if (!messaging) return null; // prevent SSR crash

  try {
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

    if (permission === "granted" && vapidKey) {
      const token = await getToken(messaging, { vapidKey });
      return token;
    }
    return null;
  } catch (error) {
    console.error("Error generating FCM token:", error);
    return null;
  }
};

export { messaging, generateToken };
