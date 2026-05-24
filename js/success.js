/* =========================
FIREBASE
========================= */

import {

    initializeApp

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {

    getFirestore,

    collection,

    addDoc,

    updateDoc,

    doc,

    getDoc

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/* =========================
FIREBASE CONFIG
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
DATOS
========================= */

const carritoProductos =

JSON.parse(

    localStorage.getItem(
        "carritoTemporal"
    )

) || [];

const usuario =

JSON.parse(

    localStorage.getItem(
        "usuario"
    )

);

const ubicacion =

JSON.parse(

    localStorage.getItem(
        "ubicacion"
    )

);

/* =========================
GUARDAR PEDIDO
========================= */

async function guardarPedido(){

    /* SI NO HAY PRODUCTOS */

    if(
        carritoProductos.length === 0
    ){

        return;

    }

    try{

        /* TOTAL */

        let total = 0;

        carritoProductos.forEach(
            producto => {

                total +=
                Number(producto.precio);

            }
        );

        /* GUARDAR PEDIDO */

        await addDoc(

            collection(db,"pedidos"),

            {

                cliente:
                usuario?.nombre ||
                "Cliente",

                correo:
                usuario?.correo ||
                "Sin correo",

                ubicacion:

                ubicacion ||

                {

                    direccion:

                    document.getElementById(
                        "direccionEntrega"
                    )?.value ||

                    "Sin dirección"

                },

                productos:
                carritoProductos,

                total,

                estado:
                "Pendiente",

                fecha:
                new Date()
                .toLocaleDateString(),

                timestamp:
                Date.now()

            }

        );

        /* =========================
        RESTAR STOCK
        ========================= */

        for(const producto of carritoProductos){

            /* VALIDAR ID */

            if(!producto.id){

                continue;

            }

            const ref = doc(

                db,

                "plantas",

                producto.id

            );

            const snap =
            await getDoc(ref);

            /* EXISTE */

            if(
                snap.exists()
            ){

                const data =
                snap.data();

                const stockActual =

                Number(
                    data.stock
                ) || 0;

                /* NUEVO STOCK */

                let nuevoStock =
                stockActual - 1;

                /* EVITAR NEGATIVOS */

                if(
                    nuevoStock < 0
                ){

                    nuevoStock = 0;

                }

                /* ACTUALIZAR */

                await updateDoc(

                    ref,

                    {

                        stock:
                        nuevoStock

                    }

                );

            }

        }

        /* =========================
        LIMPIAR CARRITO
        ========================= */

        localStorage.removeItem(
            "carritoTemporal"
        );

        console.log(
            "Pedido guardado correctamente 🌿"
        );

    }catch(error){

        console.log(
            "Error al guardar pedido",
            error
        );

    }

}

/* =========================
INICIAR
========================= */

guardarPedido();