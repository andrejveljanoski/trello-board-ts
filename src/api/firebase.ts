import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyASNIfkvn3CtMpxVVMFjLMKaGYo1ORoD40",
  authDomain: "trellofirebase-13164.firebaseapp.com",
  projectId: "trellofirebase-13164",
  storageBucket: "trellofirebase-13164.appspot.com",
  messagingSenderId: "1068635476513",
  appId: "1:1068635476513:web:ad96266efe6a9447cc8960",
  measurementId: "G-KQE2T22BWR",
};

// Initialize Firebase
let app = initializeApp(firebaseConfig);
let analytics = getAnalytics(app);
let db = getFirestore(app);

export { app, analytics, db };
