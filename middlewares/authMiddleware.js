const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const decodedToken = token.split(" ")[1];
    try {
        const decoded = jwt.verify(decodedToken, process.env.SECRET_KEY)
        console.log(decoded)
        req.userData = { id: decoded.id, email: decoded.email };
        next()
    } catch (err) {
        res.status(401).json({ error: "Unauthorized", message: err.message })
        return
    }
}

module.exports = auth;