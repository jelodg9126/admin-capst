// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getDatabase, ref, set, get, child, query,
    orderByChild,
    equalTo,
    limitToFirst,
    onValue,
    update,
    push,
    remove,} from "firebase/database";




const firebaseConfig = {
    apiKey: "AIzaSyC1-rPcvqin2WWSAA96N5Gp2L1538PCuJ8",
    authDomain: "easyq-s.firebaseapp.com",
    databaseURL: "https://easyq-s-default-rtdb.firebaseio.com",
    projectId: "easyq-s",
    storageBucket: "easyq-s.firebasestorage.app",
    messagingSenderId: "485410986210",
    appId: "1:485410986210:web:aa2dab9b4e00917212a6bb",
    measurementId: "G-VC0BZM9ERT",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);




export { auth, database, app };