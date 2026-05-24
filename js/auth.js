import {

    initializeApp

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {

    getFirestore,
    doc,
    setDoc

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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
VERIFICAR SESION
========================= */

const sesionActiva =

localStorage.getItem(
    "sesionActiva"
);

const correoActivo =

localStorage.getItem(
    "correoActivo"
);

/* =========================
PAGINA ACTUAL
========================= */

const paginaActual =

window.location.pathname;

/* =========================
SI ESTA EN LOGIN
========================= */

if(

    paginaActual.includes(
        "index.html"
    ) &&

    sesionActiva === "true"

){

    if(

        correoActivo ===
        "admin@vivero.com"

    ){

        window.location.href =
        "admin.html";

    }else{

        window.location.href =
        "catalogo.html";

    }

}

/* =========================
SI NO HAY SESION
========================= */

if(

    !paginaActual.includes(
        "index.html"
    ) &&

    sesionActiva !== "true"

){

    window.location.href =
    "index.html";

}

/* =========================
PROTEGER ADMIN
========================= */

if(

    paginaActual.includes(
        "admin.html"
    )

){

    if(

        correoActivo !==
        "admin@vivero.com"

    ){

        alert(
            "Acceso denegado"
        );

        window.location.href =
        "catalogo.html";

    }

}

/* =========================
GUARDAR TOKEN ADMIN
========================= */

async function guardarTokenAdmin(){

    try{

        const token =

        localStorage.getItem(
            "tokenNotificacion"
        );

        if(
            !token
        ){

            console.log(
                "❌ No hay token"
            );

            return;

        }

        if(

            correoActivo ===
            "admin@vivero.com"

        ){

            await setDoc(

                doc(
                    db,
                    "configuracion",
                    "admin"
                ),

                {

                    tokenAdmin:
                    token

                }

            );

            console.log(
                "🔥 Token admin guardado"
            );

        }

    }catch(error){

        console.log(
            error
        );

    }

}

/* =========================
ACTIVAR
========================= */

guardarTokenAdmin();