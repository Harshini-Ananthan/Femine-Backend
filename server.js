const express = require("express")
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const cors = require("cors");
const createDB = require("./config/db");
createDB();

const productsRouter = require("./routes/products")
const cartRouter = require("./routes/cart")
const authRouter = require("./routes/auth")
const authMiddleware = require("./middlewares/authMiddleware")
const User = require("./models/User")

app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL || "https://femine-frontend.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
})

app.get("/", (req, res) => {
    res.json({ message: "Hello Express" });
})

app.get("/about", (req, res) => {
    res.json({ message: "About" });
})

app.use("/products", productsRouter);
app.use("/cart", cartRouter)
app.use("/auth", authRouter)
app.use("/orders", require("./routes/order"))

app.get("/profile", authMiddleware, async (req, res) => {
    const user = await User.findById(req.userData.id).select('-password')
    res.json({ message: "Profile", user })
})

app.listen(3000, () => {
    console.log('server running at http://localhost:3000')
})