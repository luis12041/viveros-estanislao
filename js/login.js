import {

    initializeApp

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {

    getAuth,

    signInWithEmailAndPassword,

    createUserWithEmailAndPassword,

    sendPasswordResetEmail

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

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

const auth =
getAuth(app);

/* BOTONES */

const btnLogin =
document.getElementById("btnLogin");

const btnRegistro =
document.getElementById("btnRegistro");

const btnRecuperar =
document.getElementById("btnRecuperar");

const btnUbicacion =
document.getElementById("btnUbicacion");

/* SEGURIDAD */

let intentos = 0;

let bloqueado = false;

/* UBICACION */

btnUbicacion.addEventListener(
    "click",
    () => {

        navigator.geolocation.getCurrentPosition(

            posicion => {

                const lat =
                posicion.coords.latitude;

                const lng =
                posicion.coords.longitude;

                localStorage.setItem(

                    "ubicacion",

                    JSON.stringify({

                        lat,
                        lng

                    })

                );

                alert(
                    "Ubicación guardada correctamente 📍"
                );

            },

            () => {

                alert(
                    "No se pudo obtener la ubicación"
                );

            }

        );

    }
);

/* LOGIN */

btnLogin.addEventListener(
    "click",
    async () => {

        if(bloqueado){

            alert(
                "Acceso bloqueado temporalmente"
            );

            return;

        }

        const correo =
        document.getElementById(
            "correoLogin"
        ).value;

        const password =
        document.getElementById(
            "passwordLogin"
        ).value;

        const textoLogin =
        document.getElementById(
            "textoLogin"
        );

        const loaderLogin =
        document.getElementById(
            "loaderLogin"
        );

        textoLogin.style.display =
        "none";

        loaderLogin.style.display =
        "block";

        try{

            await signInWithEmailAndPassword(

                auth,
                correo,
                password

            );

            intentos = 0;

            localStorage.setItem(
                "sesionActiva",
                "true"
            );

            localStorage.setItem(

                "correoActivo",

                correo

            );

            if(
                correo ===
                "admin@vivero.com"
            ){

                window.location.href =
                "admin.html";

            }else{

                window.location.href =
                "catalogo.html";

            }

        }catch(error){

            textoLogin.style.display =
            "block";

            loaderLogin.style.display =
            "none";

            intentos++;

            alert(
                "Correo o contraseña incorrectos"
            );

            if(intentos >= 5){

                bloqueado = true;

                alert(
                    "Demasiados intentos. Espera 1 minuto."
                );

                setTimeout(() => {

                    bloqueado = false;

                    intentos = 0;

                }, 60000);

            }

        }

    }
);

/* REGISTRO */

btnRegistro.addEventListener(
    "click",
    async () => {

        const nombre =
        document.getElementById(
            "nombreRegistro"
        ).value;

        const correo =
        document.getElementById(
            "correoRegistro"
        ).value;

        const password =
        document.getElementById(
            "passwordRegistro"
        ).value;

        if(

            nombre === "" ||
            correo === "" ||
            password === ""

        ){

            alert(
                "Completa todos los campos"
            );

            return;

        }

        try{

            await createUserWithEmailAndPassword(

                auth,
                correo,
                password

            );

            localStorage.setItem(

                "usuario",

                JSON.stringify({

                    nombre,

                    direccion:
                    "Ubicación GPS",

                    correo

                })

            );

            alert(
                "Cuenta creada correctamente 🌿"
            );

            document.getElementById(
                "modalRegistro"
            ).classList.remove(
                "activo"
            );

            document.getElementById(
                "correoLogin"
            ).value = correo;

            document.getElementById(
                "passwordLogin"
            ).value = password;

        }catch(error){

            alert(
                "Error al crear cuenta"
            );

        }

    }
);

/* RECUPERAR */

btnRecuperar.addEventListener(
    "click",
    async () => {

        const correo =
        document.getElementById(
            "correoLogin"
        ).value;

        if(correo === ""){

            alert(
                "Escribe tu correo"
            );

            return;

        }

        try{

            await sendPasswordResetEmail(

                auth,
                correo

            );

            alert(
                "Se envió un enlace a tu correo 📧"
            );

        }catch(error){

            alert(
                "Error al enviar correo"
            );

        }

    }
);

/* SESION ACTIVA */

const sesionActiva =
localStorage.getItem(
    "sesionActiva"
);

const correoActivo =
localStorage.getItem(
    "correoActivo"
);

if(

    sesionActiva === "true" &&

    correoActivo !== null

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