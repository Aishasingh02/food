require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

const mongoDB = require("./db");
mongoDB();


// CORS
app.use((req, res, next) => {

    res.setHeader(
        "Access-Control-Allow-Origin",
        "http://localhost:3000"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    next();
});


app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello World");
});


app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));
app.use("/api", require("./Routes/MyOrderData"));
app.use("/api", require("./Routes/FavouriteData"));
app.use("/api/payment", require("./Routes/Payment"));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});