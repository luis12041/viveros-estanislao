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

/* DATOS */

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

/* GUARDAR PEDIDO */

async function guardarPedido(){

    if(
        carritoProductos.length === 0
    ){
        return;
    }

    let total = 0;

    carritoProductos.forEach(
        producto => {

            total +=
            Number(producto.precio);

        }
    );

    await addDoc(

        collection(db,"pedidos"),

        {

            cliente:
            usuario?.nombre ||
            "Cliente",

            correo:
            usuario?.correo ||
            "Sin correo",

            ubicacion,

            productos:
            carritoProductos,

            total,

            estado:
            "Pendiente",

            fecha:
            new Date()
            .toLocaleDateString()

        }

    );

    /* DESCONTAR STOCK */

    for(const producto of carritoProductos){

        const ref = doc(
            db,
            "plantas",
            producto.id
        );

        const snap =
        await getDoc(ref);

        if(
            snap.exists()
        ){

            const stockActual =
            snap.data().stock;

            const nuevoStock =
            stockActual - 1;

            await updateDoc(
                ref,
                {
                    stock:nuevoStock
                }
            );

        }

    }

    /* LIMPIAR */

    localStorage.removeItem(
        "carritoTemporal"
    );

}

guardarPedido();