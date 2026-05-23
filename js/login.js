/* =========================
FIREBASE
========================= */

import {

    initializeApp

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {

    getAuth,

    signInWithEmailAndPassword,

    createUserWithEmailAndPassword,

    sendPasswordResetEmail,

    updateProfile

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

/* =========================
CONFIG
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

const auth =
getAuth(app);

/* =========================
BOTONES
========================= */

const btnLogin =
document.getElementById(
    "btnLogin"
);

const btnRegistro =
document.getElementById(
    "btnRegistro"
);

const btnRecuperar =
document.getElementById(
    "btnRecuperar"
);

const btnUbicacion =
document.getElementById(
    "btnUbicacion"
);

/* =========================
SEGURIDAD
========================= */

let intentos = 0;

let bloqueado = false;

/* =========================
SI YA HAY SESION
========================= */

const sesionActiva =

localStorage.getItem(
    "sesionActiva"
);

const correoActivo =

localStorage.getItem(
    "correoActivo"
);

if(

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
UBICACION
========================= */

let ubicacionGuardada = null;

if(btnUbicacion){

    btnUbicacion.addEventListener(
        "click",
        () => {

            navigator.geolocation.getCurrentPosition(

                posicion => {

                    const lat =
                    posicion.coords.latitude;

                    const lng =
                    posicion.coords.longitude;

                    ubicacionGuardada = {

                        lat,
                        lng

                    };

                    localStorage.setItem(

                        "ubicacion",

                        JSON.stringify(
                            ubicacionGuardada
                        )

                    );

                    alert(
                        "Ubicación guardada 📍"
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

}

/* =========================
LOGIN
========================= */

if(btnLogin){

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

            if(textoLogin){

                textoLogin.style.display =
                "none";

            }

            if(loaderLogin){

                loaderLogin.style.display =
                "block";

            }

            try{

                const userCredential =

                await signInWithEmailAndPassword(

                    auth,
                    correo,
                    password

                );

                const usuario =
                userCredential.user;

                intentos = 0;

                /* SESION */

                localStorage.setItem(
                    "sesionActiva",
                    "true"
                );

                localStorage.setItem(
                    "correoActivo",
                    correo
                );

                /* USUARIO */

                localStorage.setItem(

                    "usuario",

                    JSON.stringify({

                        nombre:
                        usuario.displayName ||
                        "Cliente",

                        correo:
                        usuario.email,

                        ubicacion:
                        JSON.parse(
                            localStorage.getItem(
                                "ubicacion"
                            )
                        ) || null

                    })

                );

                /* ADMIN */

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

                if(textoLogin){

                    textoLogin.style.display =
                    "block";

                }

                if(loaderLogin){

                    loaderLogin.style.display =
                    "none";

                }

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

                    },60000);

                }

            }

        }
    );

}

/* =========================
REGISTRO
========================= */

if(btnRegistro){

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

                const userCredential =

                await createUserWithEmailAndPassword(

                    auth,
                    correo,
                    password

                );

                /* GUARDAR NOMBRE */

                await updateProfile(

                    userCredential.user,

                    {

                        displayName:nombre

                    }

                );

                /* LOCAL */

                localStorage.setItem(

                    "usuario",

                    JSON.stringify({

                        nombre,

                        correo,

                        ubicacion:
                        JSON.parse(
                            localStorage.getItem(
                                "ubicacion"
                            )
                        ) || null

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

}

/* =========================
RECUPERAR
========================= */

if(btnRecuperar){

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

}