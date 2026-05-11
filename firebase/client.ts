// Console-ийн web app firebaseConfig = .env.local дахь NEXT_PUBLIC_FIREBASE_* (түлхүүрийг кодонд битгий хатуу бич)
import {
  initializeApp,
  getApps,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

function getFirebaseConfig(): FirebaseOptions {
  const base: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "__BUILD__",
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "build.localhost",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "build",
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "build.appspot.com",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "000000000000",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:0:web:build",
  };
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
  return measurementId ? { ...base, measurementId } : base;
}

function createFirebaseApp(): FirebaseApp {
  if (getApps().length) {
    return getApps()[0]!;
  }
  return initializeApp(getFirebaseConfig());
}

export const firebaseApp = createFirebaseApp();
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "__BUILD__",
  );
}

/** Analytics зөвхөн браузерт; SSR дээр дуудахгүй. */
export function initFirebaseAnalytics(): void {
  if (typeof window === "undefined") return;
  void import("firebase/analytics").then(async ({ getAnalytics, isSupported }) => {
    try {
      if (await isSupported()) {
        getAnalytics(firebaseApp);
      }
    } catch {
      /* жижиг хөтөч / хориглолт */
    }
  });
}
