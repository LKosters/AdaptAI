// Import the Firebase SDK components
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2FdxlSBCs5R2LfTMoA6PxgOEJSdIdc20",
  authDomain: "adaptai-2e3e2.firebaseapp.com",
  projectId: "adaptai-2e3e2",
  storageBucket: "adaptai-2e3e2.firebasestorage.app",
  messagingSenderId: "407627575973",
  appId: "1:407627575973:web:de235b1cf56fb16c63534c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("firebase", {
    app,
    auth,
    db,
    storage,
  });
});
