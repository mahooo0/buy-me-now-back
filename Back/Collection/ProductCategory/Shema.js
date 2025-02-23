const mongoose = require('mongoose');
const ProductCategory = new mongoose.Schema({
    title: {
        az: { type: String, required: true },
        en: { type: String, required: true },
        ru: { type: String, required: true },
    },
    image_bg: { type: String, required: true },
    image: { type: String, required: true },
});

const ProductCategoryModel = mongoose.model('ProductCategory', ProductCategory);
module.exports = ProductCategoryModel;
