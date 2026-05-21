import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {

    getFirestore

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {

    apiKey:
    "AIzaSyA8ej8spinBzMQ6loUSRvvLQQhiKjubC-c",

    authDomain:
    "viveros-estanislao.firebaseapp.com",

    projectId:
    "viveros-estanislao",

    storageBucket:
    "viveros-estanislao.firebasestorage.app",

    messagingSenderId:
    "554099099014",

    appId:
    "1:554099099014:web:48a1346267826961681807",

    measurementId:
    "G-56ZH3HG1P8"

};

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

export { db };

console.log(
    "🔥 Firebase conectado"
);