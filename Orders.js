const express = require("express");
const router = express.Router();
const data = require("./Database");

// Getting all orders
router.get("/", async (req, res) => {
    try {
        const result = await data.query("SELECT * FROM orders");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Getting order per id

router.get("/:id", async (req, res) => {
    const orderId = req.params.id;

    try {
        const result = await data.query("SELECT * FROM orders WHERE id =$1",  [orderId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// Creating a new order

router.post("/", async (req, res) => {
    const { price, date, user_id } = req.body;

    try {
        const result = await data.query("INSERT INTO orders (price, date, user_id) VALUES ($1, $2, $3) RETURNING *", [price, date, user_id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// Editing order by id

router.put("/:id", async (req, res) => {
    const orderId = req.params.id;
    const { price, date, user_id } = req.body;

    try {
        const result = await data.query("UPDATE orders SET price = $1, date = $2, user_id = $3 WHERE id = $4 RETURNING *", [price, date, user_id, orderId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Deleting order by id

router.delete("/:id", async (req, res) => {
    const orderId = req.params.id;

    try {
        await data.query("DELETE FROM orders WHERE id = $1", [orderId]);
        res.send("Order has been deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


module.exports = router;