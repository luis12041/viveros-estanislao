const stripe = Stripe(
    "pk_test_51TZljrDgvnZjTIsjfco8dMzlMHszOd5tSbGz5uHhDZEuOBNcxDyfInkHX7f2byBzwttb9AC9TAlMDV1bMCwhsVTx00OKTM0ZJC"
);

const finalizarCompra =
document.getElementById(
    "finalizarCompra"
);

if(finalizarCompra){

    finalizarCompra.addEventListener(
        "click",
        async () => {

            const carritoProductos =

            JSON.parse(
                localStorage.getItem(
                    "carritoTemporal"
                )
            ) || [];

            const direccion =

            document.getElementById(
                "direccionEntrega"
            ).value;

            if(
                carritoProductos.length === 0
            ){

                alert(
                    "Tu carrito está vacío"
                );

                return;

            }

            if(
                direccion.trim() === ""
            ){

                alert(
                    "Agrega una dirección"
                );

                return;

            }

            /* GUARDAR DIRECCION */

            localStorage.setItem(

                "direccionEntrega",

                direccion

            );

            /* LOADING */

            finalizarCompra.disabled =
            true;

            finalizarCompra.innerHTML =

            "⏳ Procesando pago...";

            try{

                const response =
                await fetch(

                    "https://backend-viveros.onrender.com/crear-pago",

                    {

                        method:"POST",

                        headers:{

                            "Content-Type":
                            "application/json"

                        },

                        body:JSON.stringify({

                            productos:
                            carritoProductos

                        })

                    }

                );

                const session =
                await response.json();

                /* REDIRECT */

                await stripe.redirectToCheckout({

                    sessionId:
                    session.id

                });

            }catch(error){

                console.log(error);

                alert(
                    "Error con Stripe"
                );

                finalizarCompra.disabled =
                false;

                finalizarCompra.innerHTML =

                "Finalizar compra";

            }

        }
    );

}