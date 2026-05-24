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
FIRESTORE
========================= */

const db =
admin.firestore();

/* =========================
CREAR PAGO
========================= */

app.post(

    "/crear-pago",

    async (req,res) => {

        console.log(
            "🔥 ENTRÓ A /crear-pago"
        );

        try{

            const {
                productos
            } = req.body;

            console.log(
                "🔥 PRODUCTOS:"
            );

            console.log(
                productos
            );

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

            console.log(
                "🔥 TOTAL:"
            );

            console.log(
                total
            );

            /* =========================
            STRIPE
            ========================= */

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

            console.log(
                "🔥 SESION STRIPE CREADA"
            );

            /* =========================
            RESPUESTA RAPIDA
            ========================= */

            res.json({

                id:
                session.id

            });

            /* =========================
            PUSH EN SEGUNDO PLANO
            ========================= */

            try{

                console.log(
                    "🔥 BUSCANDO TOKEN ADMIN..."
                );

                const docRef =

                db.collection(
                    "configuracion"
                )

                .doc(
                    "admin"
                );

                const snap =
                await docRef.get();

                if(
                    snap.exists
                ){

                    console.log(
                        "🔥 DOCUMENTO ADMIN ENCONTRADO"
                    );

                    const data =
                    snap.data();

                    const tokenAdmin =
                    data.tokenAdmin;

                    console.log(
                        "🔥 TOKEN ADMIN:"
                    );

                    console.log(
                        tokenAdmin
                    );

                    /* =========================
                    ENVIAR PUSH
                    ========================= */

                    admin.messaging().send({

                        token:
                        tokenAdmin,

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

                    })

                    .then((response) => {

                        console.log(
                            "🔥 NOTIFICACION ENVIADA"
                        );

                        console.log(
                            response
                        );

                    })

                    .catch((firebaseError) => {

                        console.log(
                            "❌ ERROR FIREBASE"
                        );

                        console.log(
                            firebaseError
                        );

                    });

                }else{

                    console.log(
                        "❌ NO EXISTE DOCUMENTO ADMIN"
                    );

                }

            }catch(errorPush){

                console.log(
                    "❌ ERROR PUSH"
                );

                console.log(
                    errorPush
                );

            }

        }catch(error){

            console.log(
                "❌ ERROR GENERAL"
            );

            console.log(
                error
            );

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