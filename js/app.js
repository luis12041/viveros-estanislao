import { db } from "../firebase.js";

import {

    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/* VARIABLES */

window.imagenURL = "";

const catalogo =
document.getElementById("catalogo");

const carrito =
document.getElementById("carrito");

const abrirCarrito =
document.getElementById("abrirCarrito");

const cerrarCarrito =
document.getElementById("cerrarCarrito");

const carritoItems =
document.getElementById("carritoItems");

const contador =
document.getElementById("contador");

const totalTexto =
document.getElementById("total");

const listaPedidos =
document.getElementById("listaPedidos");

const listaInventario =
document.getElementById("listaInventario");

const botonGuardar =
document.getElementById("guardar");

const costo =
document.getElementById("costo");

const ganancia =
document.getElementById("ganancia");

const precioFinal =
document.getElementById("precio");

const buscador =
document.getElementById("buscador");

const filtroLuz =
document.getElementById("filtroLuz");

const filtroRiego =
document.getElementById("filtroRiego");

let carritoProductos = [];

/* CALCULAR PRECIO */

if(costo && ganancia){

    function calcularPrecio(){

        const costoValor =
        parseFloat(costo.value) || 0;

        const gananciaValor =
        parseFloat(ganancia.value) || 0;

        const resultado =

        costoValor +

        (
            costoValor *
            (gananciaValor / 100)
        );

        precioFinal.value =
        Math.round(resultado);

    }

    costo.addEventListener(
        "input",
        calcularPrecio
    );

    ganancia.addEventListener(
        "input",
        calcularPrecio
    );

}

/* GUARDAR PLANTA */

if(botonGuardar){

    botonGuardar.addEventListener(
        "click",
        guardarPlanta
    );

}

async function guardarPlanta(){

    const nombre =
    document.getElementById("nombre").value;

    const precio =
    document.getElementById("precio").value;

    const descripcion =
    document.getElementById("descripcion").value;

    const riego =
    document.getElementById("riego").value;

    const luz =
    document.getElementById("luz").value;

    const stock =
    document.getElementById("stock").value;

    if(

        nombre === "" ||
        precio === "" ||
        descripcion === "" ||
        riego === "" ||
        luz === "" ||
        stock === "" ||
        window.imagenURL === ""

    ){

        alert(
            "Completa todos los campos"
        );

        return;

    }

    const planta = {

        nombre,
        precio,
        descripcion,
        riego,
        luz,
        stock,
        imagen:
        window.imagenURL

    };

    await addDoc(

        collection(db,"plantas"),

        planta

    );

    alert(
        "Planta guardada correctamente 🌿"
    );

    location.reload();

}

/* ABRIR CARRITO */

if(abrirCarrito){

    abrirCarrito.addEventListener("click", () => {

        carrito.classList.add("activo");

    });

}

if(cerrarCarrito){

    cerrarCarrito.addEventListener("click", () => {

        carrito.classList.remove("activo");

    });

}

/* FILTROS */

if(buscador){

    buscador.addEventListener(
        "input",
        filtrarPlantas
    );

}

if(filtroLuz){

    filtroLuz.addEventListener(
        "change",
        filtrarPlantas
    );

}

if(filtroRiego){

    filtroRiego.addEventListener(
        "change",
        filtrarPlantas
    );

}

/* MOSTRAR PLANTAS */

if(catalogo){

    mostrarPlantas();

}

async function mostrarPlantas(){

    const querySnapshot =
    await getDocs(
        collection(db,"plantas")
    );

    const plantas = [];

    querySnapshot.forEach(doc => {

        plantas.push({

            id:doc.id,

            ...doc.data()

        });

    });

    renderizarPlantas(plantas);

}

/* FILTRAR */

async function filtrarPlantas(){

    const texto =
    buscador.value.toLowerCase();

    const luz =
    filtroLuz.value;

    const riego =
    filtroRiego.value;

    const querySnapshot =
    await getDocs(
        collection(db,"plantas")
    );

    const plantas = [];

    querySnapshot.forEach(doc => {

        plantas.push({

            id:doc.id,

            ...doc.data()

        });

    });

    const filtradas =
    plantas.filter(planta => {

        const coincideNombre =

        planta.nombre
        .toLowerCase()
        .includes(texto);

        const coincideLuz =

        luz === "" ||

        planta.luz === luz;

        const coincideRiego =

        riego === "" ||

        planta.riego === riego;

        return (

            coincideNombre &&
            coincideLuz &&
            coincideRiego

        );

    });

    renderizarPlantas(filtradas);

}

/* RENDERIZAR */

function renderizarPlantas(plantas){

    if(!catalogo) return;

    catalogo.innerHTML = "";

    plantas.forEach((planta) => {

        let alertaStock = "";

        let botonStock = "";

        if(Number(planta.stock) <= 30){

            alertaStock = `

                <p class="stock-bajo">

                    ⚠️ Producto casi agotado

                </p>

            `;

        }

        if(Number(planta.stock) <= 0){

            botonStock = `

                <button class="btn-agotado">

                    Agotado

                </button>

            `;

        }else{

            botonStock = `

                <button 
                    class="btn"
                    onclick='agregarCarrito(
                        "${planta.nombre}",
                        "${planta.precio}",
                        "${planta.imagen}",
                        "${planta.id}",
                        ${planta.stock}
                    )'
                >

                    Agregar al carrito

                </button>

            `;

        }

        catalogo.innerHTML += `

            <div class="card">

                <img 
                    src="${planta.imagen}"
                    onclick='abrirModal(
                        "${planta.nombre}",
                        "${planta.precio}",
                        "${planta.descripcion}",
                        "${planta.riego}",
                        "${planta.luz}",
                        "${planta.imagen}"
                    )'
                >

                <div class="info">

                    <h3>
                        ${planta.nombre}
                    </h3>

                    <p class="precio">

                        $${planta.precio}

                    </p>

                    <p>

                        📦 Stock:
                        ${planta.stock}

                    </p>

                    ${alertaStock}

                    ${botonStock}

                </div>

            </div>

        `;

    });

}

/* AGREGAR CARRITO */

window.agregarCarrito = function(

    nombre,
    precio,
    imagen,
    id,
    stock
    

){

    carritoProductos.push({

        nombre,
        precio,
        imagen,
        id,
        stock

    });
    localStorage.setItem(

    "carritoTemporal",

    JSON.stringify(carritoProductos)

);

    actualizarCarrito();

};

/* ACTUALIZAR CARRITO */

function actualizarCarrito(){

    if(!carritoItems) return;

    carritoItems.innerHTML = "";

    let total = 0;

    carritoProductos.forEach((producto,index) => {

        total += Number(producto.precio);

        carritoItems.innerHTML += `

            <div class="item-carrito">

                <img src="${producto.imagen}">

                <div>

                    <h4>
                        ${producto.nombre}
                    </h4>

                    <p>
                        $${producto.precio}
                    </p>

                </div>

                <button
                    onclick="eliminarProducto(${index})"
                >

                    ✖

                </button>

            </div>

        `;

    });

    contador.textContent =
    carritoProductos.length;

    totalTexto.textContent =
    "Total: $" + total;

}

/* ELIMINAR PRODUCTO */

window.eliminarProducto = function(index){

    carritoProductos.splice(index,1);

    actualizarCarrito();

};

/* FINALIZAR COMPRA */

const finalizarCompra =
document.getElementById(
    "finalizarCompra"
);

if(finalizarCompra){

    finalizarCompra.addEventListener(
        "click",
        async () => {

            if(
                carritoProductos.length === 0
            ){

                alert(
                    "Tu carrito está vacío"
                );

                return;

            }

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

            for(const producto of carritoProductos){

                const nuevoStock =

                producto.stock - 1;

                await updateDoc(

                    doc(
                        db,
                        "plantas",
                        producto.id
                    ),

                    {

                        stock:nuevoStock

                    }

                );

            }

            alert(
                "Pedido realizado correctamente 🌿"
            );

            carritoProductos = [];

            actualizarCarrito();

            carrito.classList.remove(
                "activo"
            );

            mostrarPlantas();

            mostrarInventario();

            mostrarPedidos();

        }
    );

}

/* MODAL */

window.abrirModal = function(

    nombre,
    precio,
    descripcion,
    riego,
    luz,
    imagen

){

    const modal =
    document.createElement("div");

    modal.classList.add("modal");

    modal.innerHTML = `

        <div class="modal-contenido">

            <span class="cerrar">

                &times;

            </span>

            <img src="${imagen}">

            <h2>
                ${nombre}
            </h2>

            <p class="precio">
                $${precio}
            </p>

            <p>
                ${descripcion}
            </p>

            <p>
                💧 ${riego}
            </p>

            <p>
                ☀️ ${luz}
            </p>

        </div>

    `;

    document.body.appendChild(modal);

    modal.querySelector(".cerrar")
    .addEventListener("click", () => {

        modal.remove();

    });

};

/* PEDIDOS ADMIN */

if(listaPedidos){

    mostrarPedidos();

}

async function mostrarPedidos(){

    const querySnapshot =
    await getDocs(
        collection(db,"pedidos")
    );

    listaPedidos.innerHTML = "";

    querySnapshot.forEach(docu => {

        const pedido =
        docu.data();

        listaPedidos.innerHTML += `

            <div class="pedido">

                <h3>
                    👤 ${pedido.cliente}
                </h3>

                <p>
                    📧 ${pedido.correo}
                </p>

                <p>
                    📅 ${pedido.fecha}
                </p>

                <p>
                    Estado:
                    ${pedido.estado}
                </p>

                <h2>
                    Total:
                    $${pedido.total}
                </h2>

                <button
                    class="btn-entregado"
                    onclick="entregarPedido(
                        '${docu.id}'
                    )"
                >

                    Entregado

                </button>

            </div>

        `;

    });

}

/* ENTREGAR PEDIDO */

window.entregarPedido =
async function(id){

    await deleteDoc(
        doc(db,"pedidos",id)
    );

    mostrarPedidos();

};

/* INVENTARIO ADMIN */

if(listaInventario){

    mostrarInventario();

}

async function mostrarInventario(){

    const querySnapshot =
    await getDocs(
        collection(db,"plantas")
    );

    listaInventario.innerHTML = "";

    querySnapshot.forEach(docu => {

        const planta =
        docu.data();

        let alerta = "";

        if(Number(planta.stock) <= 30){

            alerta = `

                <p class="stock-bajo">

                    ⚠️ Poco stock

                </p>

            `;

        }

        listaInventario.innerHTML += `

            <div class="inventario-card">

                <img 
                    src="${planta.imagen}"
                >

                <div class="inventario-info">

                    <h3>
                        ${planta.nombre}
                    </h3>

                    <p>
                        💲 ${planta.precio}
                    </p>

                    <p>
                        📦 Stock:
                        ${planta.stock}
                    </p>

                    ${alerta}

                </div>

                <div class="acciones-admin">

                    <button
                        class="btn-editar"
                        onclick="editarPlanta(
                            '${docu.id}',
                            '${planta.nombre}',
                            '${planta.precio}',
                            '${planta.stock}'
                        )"
                    >

                        ✏️ Editar

                    </button>

                    <button
                        class="btn-eliminar"
                        onclick="eliminarPlanta(
                            '${docu.id}'
                        )"
                    >

                        🗑️ Eliminar

                    </button>

                </div>

            </div>

        `;

    });

}

/* ELIMINAR PLANTA */

window.eliminarPlanta =
async function(id){

    const confirmar =
    confirm(
        "¿Eliminar planta?"
    );

    if(!confirmar) return;

    await deleteDoc(
        doc(db,"plantas",id)
    );

    mostrarInventario();

    mostrarPlantas();

};

/* EDITAR PLANTA */

window.editarPlanta =
async function(

    id,
    nombreActual,
    precioActual,
    stockActual

){

    const nuevoNombre =
    prompt(
        "Nuevo nombre",
        nombreActual
    );

    if(!nuevoNombre) return;

    const nuevoPrecio =
    prompt(
        "Nuevo precio",
        precioActual
    );

    if(!nuevoPrecio) return;

    const nuevoStock =
    prompt(
        "Nuevo stock",
        stockActual
    );

    if(!nuevoStock) return;

    await updateDoc(

        doc(db,"plantas",id),

        {

            nombre:nuevoNombre,

            precio:nuevoPrecio,

            stock:nuevoStock

        }

    );

    alert(
        "Planta actualizada 🌿"
    );

    mostrarInventario();

    mostrarPlantas();

};