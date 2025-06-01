
// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfigValues = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Define placeholder values to check against
const placeholderValues = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  projectId: "your_project_id",
  storageBucket: "your_storage_bucket",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id",
};

let criticalConfigError = false;
let firebaseConfigIssueMessage = "";

if (firebaseConfigValues.apiKey === placeholderValues.apiKey) {
  firebaseConfigIssueMessage += 'NEXT_PUBLIC_FIREBASE_API_KEY is still set to the placeholder "your_api_key". ';
  criticalConfigError = true;
} else if (!firebaseConfigValues.apiKey) {
  firebaseConfigIssueMessage += 'NEXT_PUBLIC_FIREBASE_API_KEY is missing. ';
  criticalConfigError = true;
}

if (firebaseConfigValues.authDomain === placeholderValues.authDomain) {
  firebaseConfigIssueMessage += 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is still set to the placeholder "your_auth_domain". ';
  criticalConfigError = true;
} else if (!firebaseConfigValues.authDomain) {
  firebaseConfigIssueMessage += 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing. ';
  criticalConfigError = true;
}

if (firebaseConfigValues.projectId === placeholderValues.projectId) {
  firebaseConfigIssueMessage += 'NEXT_PUBLIC_FIREBASE_PROJECT_ID is still set to the placeholder "your_project_id". ';
  criticalConfigError = true;
} else if (!firebaseConfigValues.projectId) {
  firebaseConfigIssueMessage += 'NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing. ';
  criticalConfigError = true;
}

if (criticalConfigError) {
  console.error(
    `CRITICAL FIREBASE CONFIG ERROR: ${firebaseConfigIssueMessage}Please update these in your .env file with the actual values from your Firebase project settings (Project settings -> General -> Your apps -> Web app). Also, ensure your Firebase project has the Email/Password sign-in provider enabled in Authentication -> Sign-in method. Firebase initialization might fail or lead to errors like "auth/api-key-not-valid".`
  );
}

const firebaseConfig = {
  apiKey: firebaseConfigValues.apiKey,
  authDomain: firebaseConfigValues.authDomain,
  projectId: firebaseConfigValues.projectId,
  storageBucket: firebaseConfigValues.storageBucket,
  messagingSenderId: firebaseConfigValues.messagingSenderId,
  appId: firebaseConfigValues.appId,
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);

export { app, auth };
