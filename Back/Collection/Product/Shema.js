const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        title: {
            az: { type: String, required: true },
            en: { type: String, required: true },
            ru: { type: String, required: true },
        },
        description: {
            az: { type: String, required: true },
            en: { type: String, required: true },
            ru: { type: String, required: true },
        },
        year: { type: String, required: true },
        litres: { type: String, required: true },
        kilometraj: { type: String, required: true },
        images: [{ type: String, required: true }], // Array of image URLs
        price: { type: Number, required: true },
        discountedPrice: { type: Number, required: true },
        image: { type: String, required: true },
        slug: {
            az: { type: String, required: true, unique: true },
            en: { type: String, required: true, unique: true },
            ru: { type: String, required: true, unique: true },
        },
        Category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductCategory', // Reference to Category collection
            required: true,
        },
        SubCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory', // Reference to SubCategory collection
            required: true,
        },
    },
    { timestamps: true }
);

const ProductCategoryModel = mongoose.model('Product', ProductSchema);
module.exports = ProductCategoryModel;
