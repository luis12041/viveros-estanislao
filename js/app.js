/* =========================
IMPORTS FIREBASE
========================= */

import { db } from "../firebase.js";

import {

    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    onSnapshot

} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/* =========================
VARIABLES
========================= */

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

const cerrarSesion =
document.getElementById("cerrarSesion");

/* =========================
CATEGORIAS
========================= */

const botonesCategoria =

document.querySelectorAll(
    ".categoria-btn"
);

let categoriaActiva =
"Todas";

botonesCategoria.forEach(btn => {

    btn.addEventListener(
        "click",
        () => {

            botonesCategoria.forEach(b => {

                b.classList.remove(
                    "activa"
                );

            });

            btn.classList.add(
                "activa"
            );

            categoriaActiva =

            btn.innerText
            .replace("☀️","")
            .replace("🌑","")
            .replace("🌤️","")
            .replace("🌿","")
            .trim();

            filtrarPlantas();

        }
    );

});

/* =========================
USUARIO CONECTADO
========================= */

const usuarioGuardado =

JSON.parse(

    localStorage.getItem(
        "usuario"
    )

);

if(

    usuarioGuardado &&
    document.getElementById(
        "saludoUsuario"
    )

){

    document.getElementById(
        "saludoUsuario"
    ).innerHTML =

    `👋 Hola ${usuarioGuardado.nombre}`;

}

/* =========================
GUARDAR DIRECCION
========================= */

const inputDireccion =

document.getElementById(
    "direccionEntrega"
);

if(inputDireccion){

    inputDireccion.value =

    localStorage.getItem(
        "direccionEntrega"
    ) || "";

    inputDireccion.addEventListener(
        "input",
        () => {

            localStorage.setItem(

                "direccionEntrega",

                inputDireccion.value

            );

        }
    );

}

/* =========================
FAVORITOS
========================= */

let favoritos =

JSON.parse(

    localStorage.getItem(
        "favoritos"
    )

) || [];

/* =========================
CARRITO
========================= */

let carritoProductos =

JSON.parse(

    localStorage.getItem(
        "carritoTemporal"
    )

) || [];

actualizarCarrito();

/* =========================
TOAST
========================= */

function mostrarToast(texto){

    const toast =
    document.createElement("div");

    toast.classList.add(
        "toast"
    );

    toast.innerText = texto;

    document.body.appendChild(
        toast
    );

    setTimeout(() => {

        toast.remove();

    },3000);

}

/* =========================
CERRAR SESION
========================= */

if(cerrarSesion){

    cerrarSesion.addEventListener(
        "click",
        () => {

            sessionStorage.removeItem(
                "sesionActiva"
            );

            sessionStorage.removeItem(
                "correoActivo"
            );

            localStorage.removeItem(
                "usuario"
            );

            localStorage.removeItem(
                "carritoTemporal"
            );

            mostrarToast(
                "Sesión cerrada 👋"
            );

            setTimeout(() => {

                window.location.href =
                "index.html";

            },1000);

        }
    );

}

/* =========================
CALCULAR PRECIO
========================= */

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

/* =========================
GUARDAR PLANTA
========================= */

if(botonGuardar){

    botonGuardar.addEventListener(
        "click",
        guardarPlanta
    );

}

async function guardarPlanta(){

    const nombre =
    document.getElementById("nombre")?.value;

    const precio =
    document.getElementById("precio")?.value;

    const descripcion =
    document.getElementById("descripcion")?.value;

    const riego =
    document.getElementById("riego")?.value;

    const luz =
    document.getElementById("luz")?.value;

    const stock =
    document.getElementById("stock")?.value;

    if(

        nombre === "" ||
        precio === "" ||
        descripcion === "" ||
        riego === "" ||
        luz === "" ||
        stock === "" ||
        window.imagenURL === ""

    ){

        mostrarToast(
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

    mostrarToast(
        "Planta guardada 🌿"
    );

    setTimeout(() => {

        location.reload();

    },1200);

}

/* =========================
ABRIR CARRITO
========================= */

if(abrirCarrito){

    abrirCarrito.addEventListener(
        "click",
        () => {

            carrito.classList.add(
                "activo"
            );

        }
    );

}

if(cerrarCarrito){

    cerrarCarrito.addEventListener(
        "click",
        () => {

            carrito.classList.remove(
                "activo"
            );

        }
    );

}

/* =========================
FILTROS
========================= */

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

/* =========================
MOSTRAR PLANTAS
========================= */

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

/* =========================
FILTRAR
========================= */

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

        let coincideCategoria =
        true;

        if(
            categoriaActiva === "Sol"
        ){

            coincideCategoria =
            planta.luz === "Sol";

        }

        if(
            categoriaActiva === "Sombra"
        ){

            coincideCategoria =
            planta.luz === "Sombra";

        }

        if(
            categoriaActiva === "Resolana"
        ){

            coincideCategoria =
            planta.luz === "Luz indirecta";

        }

        return (

            coincideNombre &&
            coincideLuz &&
            coincideRiego &&
            coincideCategoria

        );

    });

    renderizarPlantas(
        filtradas
    );

}

/* =========================
RENDERIZAR
========================= */

function renderizarPlantas(plantas){

    if(!catalogo) return;

    catalogo.innerHTML = "";

    plantas.forEach((planta) => {

        let alertaStock = "";

        let botonStock = "";

        const esFavorito =
        favoritos.includes(planta.id);

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

                <button 
                    class="btn-favorito ${esFavorito ? "activo" : ""}"
                    onclick="toggleFavorito('${planta.id}',this)"
                >

                    ❤️

                </button>

                <img 
                    src="${planta.imagen}"
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

                    <button 
                        class="btn-info"
                        onclick="toggleInfo(this)"
                    >

                        Ver información

                    </button>

                    <div class="info-extra">

                        <p>
                            💧 ${planta.riego}
                        </p>

                        <p>
                            ☀️ ${planta.luz}
                        </p>

                        <p>
                            🌿 ${planta.descripcion}
                        </p>

                    </div>

                    ${botonStock}

                </div>

            </div>

        `;

    });

}

/* =========================
INFO DESPLEGABLE
========================= */

window.toggleInfo = function(btn){

    const info =

    btn.nextElementSibling;

    info.classList.toggle(
        "activa"
    );

};

/* =========================
FAVORITOS
========================= */

window.toggleFavorito = function(id,btn){

    if(
        favoritos.includes(id)
    ){

        favoritos =
        favoritos.filter(
            fav => fav !== id
        );

        btn.classList.remove(
            "activo"
        );

        mostrarToast(
            "Favorito eliminado ❌"
        );

    }else{

        favoritos.push(id);

        btn.classList.add(
            "activo"
        );

        mostrarToast(
            "Favorito agregado ❤️"
        );

    }

    localStorage.setItem(

        "favoritos",

        JSON.stringify(
            favoritos
        )

    );

};

/* =========================
AGREGAR CARRITO
========================= */

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

    mostrarToast(
        "Producto agregado 🛒"
    );

};

/* =========================
ACTUALIZAR CARRITO
========================= */

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

/* =========================
ELIMINAR PRODUCTO
========================= */

window.eliminarProducto = function(index){

    carritoProductos.splice(index,1);

    localStorage.setItem(

        "carritoTemporal",

        JSON.stringify(carritoProductos)

    );

    actualizarCarrito();

    mostrarToast(
        "Producto eliminado ❌"
    );

};

/* =========================
PEDIDOS TIEMPO REAL
========================= */

if(listaPedidos){

    onSnapshot(

        collection(db,"pedidos"),

        (querySnapshot) => {

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
                            📍 ${pedido.direccion || "Sin dirección"}
                        </p>

                        <p>
                            📅 ${pedido.fecha}
                        </p>

                        <div class="estado-box">

                            <p class="estado-texto">

                                Estado:
                                <span class="estado-${pedido.estado.toLowerCase()}">

                                    ${pedido.estado}

                                </span>

                            </p>

                            <select
                                onchange="cambiarEstado(
                                    '${docu.id}',
                                    this.value
                                )"
                            >

                                <option
                                    value="Pendiente"
                                    ${pedido.estado === "Pendiente" ? "selected" : ""}
                                >

                                    Pendiente

                                </option>

                                <option
                                    value="Enviado"
                                    ${pedido.estado === "Enviado" ? "selected" : ""}
                                >

                                    Enviado

                                </option>

                                <option
                                    value="Entregado"
                                    ${pedido.estado === "Entregado" ? "selected" : ""}
                                >

                                    Entregado

                                </option>

                            </select>

                        </div>

                        <h2>
                            Total:
                            $${pedido.total}
                        </h2>

                    </div>

                `;

            });

        }

    );

}

/* =========================
CAMBIAR ESTADO
========================= */

window.cambiarEstado =
async function(id,estado){

    if(
        estado === "Entregado"
    ){

        await deleteDoc(
            doc(db,"pedidos",id)
        );

        mostrarToast(
            "Pedido entregado ✅"
        );

        return;

    }

    await updateDoc(

        doc(db,"pedidos",id),

        {

            estado:estado

        }

    );

    mostrarToast(
        "Estado actualizado 🚚"
    );

};

/* =========================
HISTORIAL PEDIDOS
========================= */

const historialPedidos =

document.getElementById(
    "historialPedidos"
);

if(historialPedidos){

    onSnapshot(

        collection(db,"pedidos"),

        (querySnapshot) => {

            historialPedidos.innerHTML =
            "";

            querySnapshot.forEach(docu => {

                const pedido =
                docu.data();

                if(

                    pedido.correo ===
                    usuarioGuardado?.correo

                ){

                    historialPedidos.innerHTML += `

                        <div class="historial-item">

                            <h3>

                                🌿 Pedido realizado

                            </h3>

                            <p>

                                📅 ${pedido.fecha}

                            </p>

                            <p>

                                💰 Total:
                                $${pedido.total}

                            </p>

                            <p>

                                🚚 Estado:
                                ${pedido.estado}

                            </p>

                            <p>

                                📍 ${pedido.direccion}

                            </p>

                        </div>

                    `;

                }

            });

        }

    );

}