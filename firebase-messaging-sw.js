importScripts(
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js"
);

/* =========================
FIREBASE
========================= */

firebase.initializeApp({

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
    "1:554099099014:web:48a1346267826961681807"

});

const messaging =
firebase.messaging();

/* =========================
NOTIFICACION EN BACKGROUND
========================= */

messaging.onBackgroundMessage(

    (payload) => {

        console.log(
            "🔥 Background message",
            payload
        );

        self.registration.showNotification(

            payload.notification.title,

            {

                body:
                payload.notification.body,

                icon:
                "https://viveros-estanislao.vercel.app/img/logo.png",

                badge:
                "https://viveros-estanislao.vercel.app/img/logo.png",

                vibrate:
                [200,100,200],

                data: {

                    url:
                    "https://viveros-estanislao.vercel.app/admin.html"

                }

            }

        );

    }

);

/* =========================
CLICK NOTIFICACION
========================= */

self.addEventListener(

    "notificationclick",

    (event) => {

        event.notification.close();

        event.waitUntil(

            clients.openWindow(

                event.notification.data.url

            )

        );

    }

);