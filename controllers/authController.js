const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const getUsers = async (req, res) => {
    const users = await User.find();
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404).json({ error: "Users not found" })
    }
}

const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
            return
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, name });
        res.status(201).json({ message: "User created successfully", user })
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ error: "User not found" });
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ error: "Invalid Password" });
            return;
        }
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: process.env.EXPIRES_IN }
        )
        res.status(200).json({ message: "Login successful", token, user })

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { registerUser, getUsers, loginUser }