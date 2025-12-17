const mongoose = require("mongoose")
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        // await mongoose.connect("mongodb://127.0.0.1:27017/femine");
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error", err.message);
        process.exit(1);
    }
}
module.exports = connectDB;