
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4JtoiTOEeO6IaN8e4HbCSG8SPEsNUFVs",
    authDomain: "leaderboard-3e600.firebaseapp.com",
    databaseURL: "https://leaderboard-3e600-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "leaderboard-3e600",
    storageBucket: "leaderboard-3e600.firebasestorage.app",
    messagingSenderId: "715413667571",
    appId: "1:715413667571:web:25c481155a5b0eb8ec8186"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);