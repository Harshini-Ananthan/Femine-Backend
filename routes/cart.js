const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const userId = req.userData.id;
        let cart = await Cart.findOne({ user: userId }).populate('products.product');

        if (!cart) {
            return res.json([]);
        }

        const formattedCart = cart.products.map(item => ({
            ...item.product._doc,
            quantity: item.quantity,
        }));

        res.json(formattedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

// Add to cart
router.post('/', async (req, res) => {
    try {
        const userId = req.userData.id;
        const { productId, quantity = 1 } = req.body; 

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                products: [{ product: productId, quantity }]
            });
        } else {
            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
        }
        await cart.save();
        res.status(201).json({ message: "Item added to cart", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

router.delete('/:id', async (req, res) => { 
    try {
        const userId = req.userData.id;
        const productId = req.params.id;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        await cart.save();

        res.json({ message: "Item removed from cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});


module.exports = router;
