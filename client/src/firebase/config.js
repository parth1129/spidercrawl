// Firebase configuration
// IMPORTANT: Replace these placeholder values with your actual Firebase project config.
// Get your config from: Firebase Console → Project Settings → Your Apps → Web App → Config
//
// SECURITY NOTE:
//  - Firebase web config keys are safe to include in client-side code; they identify
//    your project but do NOT grant admin access.
//  - Access is controlled by Firestore Security Rules and Firebase Auth.
//  - Never commit service-account JSON (admin SDK) to version control.

import { initializeApp }      from 'firebase/app';
import { getFirestore }        from 'firebase/firestore';
import { getAuth }             from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'YOUR_API_KEY',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'YOUR_PROJECT.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'YOUR_PROJECT_ID',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| 'YOUR_SENDER_ID',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);
export default app;
