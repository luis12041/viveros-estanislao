import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {

    getFirestore

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {

    getMessaging,
    getToken,
    onMessage

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging.js";

/* FIREBASE */

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

/* =========================
NOTIFICACIONES
========================= */

const messaging =
getMessaging(app);

/* PEDIR PERMISO */

async function activarNotificaciones(){

    try{

        const permiso =
        await Notification.requestPermission();

        if(
            permiso === "granted"
        ){

            console.log(
                "✅ Permiso concedido"
            );

            const token =
            await getToken(

                messaging,

                {

                    vapidKey:
                    "BJLkj1kaaABdTZayvEsYa3SkAosXCo8SM2NmozHUYPdTWm7FWCpDIqHS3WAL6pyjEWMDBk0wHpYMDUE9q13-pwE"

                }

            );

            console.log(
                "🔥 TOKEN:",
                token
            );

            /* GUARDAR TOKEN */

            localStorage.setItem(
                "tokenNotificacion",
                token
            );

        }

    }catch(error){

        console.log(
            error
        );

    }

}

/* ACTIVAR */

activarNotificaciones();

/* NOTIFICACION ABIERTA */

onMessage(

    messaging,

    (payload) => {

        console.log(
            payload
        );

        new Notification(

            payload.notification.title,

            {

                body:
                payload.notification.body,

                icon:
                "/img/logo.png"

            }

        );

    }

);

export { db };

console.log(
    "🔥 Firebase conectado"
);