const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
    const products = await Product.find();
    if (products) {
        res.status(200).json(products);
    } else {
        res.status(404).json({ error: "Products not found" })
    }
})

router.post("/", async (req, res) => {
    try {
        const { id, name, originalPrice, sellingPrice, image } = req.body;
        const product = await Product.create({ id, name, originalPrice, sellingPrice, image });
        res.status(201).json({ message: "Product created successfully" })
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ error: "Product not found" })
    }
})

module.exports = router;