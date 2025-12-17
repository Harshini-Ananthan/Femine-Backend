const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

// Get user orders
router.get('/', async (req, res) => {
    try {
        const userId = req.userData.id;
        const orders = await Order.find({ user: userId }).populate('products.product').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

// Place an order (Order Now button)
router.post('/', async (req, res) => {
    try {
        const userId = req.userData.id;
        const { productId, quantity = 1 } = req.body;

        const newOrder = new Order({
            user: userId,
            products: [{ product: productId, quantity }]
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
