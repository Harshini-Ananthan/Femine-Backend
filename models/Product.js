const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        id: { type: String },
        name: { type: String, required: true },
        originalPrice: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
        image: { type: String, required: true }
    }, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);