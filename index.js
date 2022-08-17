const express = require("express");
const app = express();
const path = require("path");
const stripe = require("stripe")("sk_test_51LXJMNHaiJQbqv8nU6Hnl7ZnL2CI9ulx2E9t4uGkLIHU0euDvV9a9vW1ZBBvi602m9vWKNIQAfvBjy6lrVD0vFzf002fDuknqP");
const cors = require('cors');




const YOUR_DOMAIN = "https://ezsolvers.com/checkout.html";


app.use(
    cors({
        origin: '*',
        credentials: true,
        // methods: "GET,HEAD,OPTIONS,PUT,PATCH,DELETE"
    })
)


app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', YOUR_DOMAIN);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// static files
// app.use(express.static(path.join(__dirname, "views")));

// middleware
app.use(express.json());

// routes
app.options('*', cors());
app.post("/payment", async(req, res) => {
    const { product } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Total Cost",

                },
                unit_amount: (product.amount + 500) * 100,
                // unit_amount: product.amount * 100,
            },
            quantity: product.quantity,
        }, ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}/success.html`,
        cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    res.json({ id: session.id });
});