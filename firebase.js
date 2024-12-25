import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { ref as storageRef } from "firebase/storage"; 
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
export const firebaseConfigSensitive = {
    apiKey: process.env.CAMPUSXPERIENCE_FIREBASE_APIKEY,
    authDomain: process.env.CAMPUSXPERIENCE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.CAMPUSXPERIENCE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.CAMPUSXPERIENCE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.CAMPUSXPERIENCE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.CAMPUSXPERIENCE_FIREBASE_APP_ID,
    databaseURL: process.env.CAMPUSXPERIENCE_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfigSensitive);

const db = getDatabase(app);
const fireDb = getFirestore(app)
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const storage = getStorage(app)

export { auth, db, fireDb, storage, storageRef }