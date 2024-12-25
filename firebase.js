import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { ref as storageRef } from "firebase/storage";
import { getStorage } from "firebase/storage";
import  Constants  from 'expo-constants';

// Your web app's Firebase configuration
export const firebaseConfigSensitive = Constants.expoConfig.extra.firebaseConfig;

const app = initializeApp(firebaseConfigSensitive);

const db = getDatabase(app);
const fireDb = getFirestore(app)
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const storage = getStorage(app)

export { auth, db, fireDb, storage, storageRef }