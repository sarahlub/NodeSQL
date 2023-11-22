const express = require("express");
const router = express.Router();
const data = require("./Database");


// Getting all users from Database

router.get("/", async (req, res) => {
    try {
        const result = await data.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// Getting users per ID

router.get("/:id", async (req, res) => {
    const userID = req.params.id;

    try {
        const result = await data.query("SELECT * FROM users WHERE id = $1", [userID]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// Creating a new user

router.post("/:id", async (req, res) => {
    // const userID = req.params.id;
    const { first_name, last_name, age } = req.body;

    try {
        const result = await data.query("INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *", [first_name, last_name, age]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Deleting user by id

router.delete("/:id", async (req, res) => {
    const userID = req.params.id;

    try {
        await data.query("DELETE FROM users WHERE id = $1", [userID]);
        res.send("User has been deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Make an user inactive if they have never made an order

router.put("/:id/check-inactive", async (req, res) => {
    const userID = req.params.id;

    try {
        const orderResult = await data.query("SELECT COUNT(*) FROM orders WHERE user_id = $1", [userID]);

        if (orderResult.rows[0].count === 0) {
            // setting user as inactive
            await data.query("UPDATE users SET active = false WHERE id = $1", [userID]);
            res.send("User set as inactive");
        } else {
            res.send("User has orders, cannot set as inactive");
        } 
            } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
    }
});

module.exports = router;