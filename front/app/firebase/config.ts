import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCKXdOs1vb2Ktld_hum8-Nj5BZ5q0uBGbY",
    authDomain: "nest-next-test.firebaseapp.com",
    projectId: "nest-next-test",
    storageBucket: "nest-next-test.appspot.com",
    messagingSenderId: "195170438312",
    appId: "1:195170438312:web:fbb8f3d82a1d12ff83c69d"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);