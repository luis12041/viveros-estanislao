/* VERIFICAR SESION */

const sesionActiva =

localStorage.getItem(
    "sesionActiva"
);

const correoActivo =

localStorage.getItem(
    "correoActivo"
);

/* PAGINA ACTUAL */

const paginaActual =

window.location.pathname;

/* SI ESTA EN LOGIN */

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

/* SI NO HAY SESION */

if(

    !paginaActual.includes(
        "index.html"
    ) &&

    sesionActiva !== "true"

){

    window.location.href =
    "index.html";

}

/* PROTEGER ADMIN */

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