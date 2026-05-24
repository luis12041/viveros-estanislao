const express = require("express");

const cors = require("cors");

const Stripe = require("stripe");

const admin = require("firebase-admin");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

/* =========================
STRIPE
========================= */

const stripe = Stripe(
    process.env.STRIPE_SECRET_KEY
);

/* =========================
FIREBASE ADMIN
========================= */

const serviceAccount = {

    type:
    "service_account",

    project_id:
    "viveros-estanislao",

    private_key_id:
    process.env.FIREBASE_PRIVATE_KEY_ID,

    private_key:
    process.env.FIREBASE_PRIVATE_KEY.replace(
        /\\n/g,
        "\n"
    ),

    client_email:
    process.env.FIREBASE_CLIENT_EMAIL,

    client_id:
    process.env.FIREBASE_CLIENT_ID,

    auth_uri:
    "https://accounts.google.com/o/oauth2/auth",

    token_uri:
    "https://oauth2.googleapis.com/token",

    auth_provider_x509_cert_url:
    "https://www.googleapis.com/oauth2/v1/certs",

    client_x509_cert_url:
    process.env.FIREBASE_CERT_URL

};

admin.initializeApp({

    credential:
    admin.credential.cert(
        serviceAccount
    )

});

/* =========================
CREAR PAGO
========================= */

app.post(

    "/crear-pago",

    async (req,res) => {

        try{

            const {

                productos,
                tokenNotificacion

            } = req.body;

            const line_items =

            productos.map(

                producto => ({

                    price_data: {

                        currency:
                        "mxn",

                        product_data: {

                            name:
                            producto.nombre

                        },

                        unit_amount:

                        Number(
                            producto.precio
                        ) * 100

                    },

                    quantity:1

                })

            );

            /* TOTAL */

            let total = 0;

            productos.forEach(
                producto => {

                    total +=
                    Number(
                        producto.precio
                    );

                }
            );

            /* STRIPE */

            const session =

            await stripe.checkout.sessions.create({

                payment_method_types:
                ["card"],

                line_items,

                mode:
                "payment",

                success_url:
                "https://viveros-estanislao.vercel.app/success.html",

                cancel_url:
                "https://viveros-estanislao.vercel.app/cancel.html"

            });

            /* =========================
            NOTIFICACION
            ========================= */

            if(
                tokenNotificacion
            ){

                await admin.messaging().send({

                    token:
                    tokenNotificacion,

                    notification: {

                        title:
                        "🌿 Nueva compra",

                        body:
                        `Se realizó una compra de $${total}`

                    },

                    webpush: {

                        notification: {

                            icon:
                            "https://viveros-estanislao.vercel.app/img/logo.png"

                        }

                    }

                });

                console.log(
                    "🔥 Notificación enviada"
                );

            }

            /* RESPUESTA */

            res.json({

                id:
                session.id

            });

        }catch(error){

            console.log(error);

            res.status(500).json({

                error:
                "Error al crear pago"

            });

        }

    }

);

/* =========================
PUERTO
========================= */

const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(

        `🔥 Servidor corriendo en puerto ${PORT}`

    );

});