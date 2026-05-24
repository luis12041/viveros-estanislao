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

/* =========================
FIREBASE
========================= */

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
SERVICE WORKER
========================= */

if(
    "serviceWorker" in navigator
){

    navigator.serviceWorker.register(

        "/firebase-messaging-sw.js"

    )

    .then(() => {

        console.log(
            "🔥 Service Worker listo"
        );

    })

    .catch((error) => {

        console.log(
            "❌ Error Service Worker",
            error
        );

    });

}

/* =========================
NOTIFICACIONES
========================= */

const messaging =
getMessaging(app);

/* =========================
PEDIR PERMISO
========================= */

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

            alert(token);

            /* GUARDAR TOKEN */

            localStorage.setItem(

                "tokenNotificacion",

                token

            );

        }

        else{

            console.log(
                "❌ Permiso denegado"
            );

        }

    }catch(error){

        console.log(
            "❌ Error notificaciones",
            error
        );

    }

}

/* =========================
ACTIVAR
========================= */

window.addEventListener(

    "load",

    () => {

        setTimeout(() => {

            activarNotificaciones();

        },2000);

    }

);

/* =========================
NOTIFICACION ABIERTA
========================= */

onMessage(

    messaging,

    (payload) => {

        console.log(
            "📩 Notificación recibida",
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