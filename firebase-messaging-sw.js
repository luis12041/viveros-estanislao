importScripts(
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js"
);

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

/* NOTIFICACION */

messaging.onBackgroundMessage(
    (payload) => {

        self.registration.showNotification(

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