require("dotenv").config();


const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./Users");
const orderRoute = require("./Orders");

const app = express();


app.use(bodyParser.json());

// Users Routes
app.use("/Users", userRoute);




// Order Routes
app.use("/Orders", orderRoute);

const PORT = process.env.PORT || 7050;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});