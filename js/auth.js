/* VERIFICAR SESION */

const sesionActiva =

localStorage.getItem(
    "sesionActiva"
);

const correoActivo =

localStorage.getItem(
    "correoActivo"
);

/* SI NO HAY SESION */

if(

    sesionActiva !== "true"

){

    window.location.href =
    "index.html";

}

/* PROTEGER ADMIN */

const paginaActual =

window.location.pathname;

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