// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.manifest?.extra?.API_KEY,
  authDomain: Constants.manifest?.extra?.AUTH_DOMAIN,
  projectId: Constants.manifest?.extra?.PROJECT_ID,
  storageBucket: Constants.manifest?.extra?.STORAGE_BUCKET,
  messagingSenderId: Constants.manifest?.extra?.MESSENGER_SENDER_ID,
  appId: Constants.manifest?.extra?.APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
