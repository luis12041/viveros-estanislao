const express = require("express");

const cors = require("cors");

const Stripe = require("stripe");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/* CREAR PAGO */

app.post("/crear-pago", async (req,res) => {

    try{

        const { productos } = req.body;

        const line_items = productos.map(producto => ({

            price_data: {

                currency: "mxn",

                product_data: {

                    name: producto.nombre

                },

                unit_amount:

                Number(producto.precio) * 100

            },

            quantity: 1

        }));

        const session =

        await stripe.checkout.sessions.create({

            payment_method_types: ["card"],

            line_items,

            mode: "payment",

            success_url:
            "https://viveros-estanislao.vercel.app/success.html",

            cancel_url:
            "https://viveros-estanislao.vercel.app/cancel.html"

        });

        res.json({

            id: session.id

        });

    }catch(error){

        console.log(error);

        res.status(500).json({

            error:"Error al crear pago"

        });

    }

});

app.listen(3000, () => {

    console.log(
        "Servidor corriendo en puerto 3000"
    );

});