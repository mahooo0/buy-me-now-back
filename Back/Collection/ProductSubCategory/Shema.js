const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema(
    {
        title: {
            az: { type: String, required: true },
            en: { type: String, required: true },
            ru: { type: String, required: true },
        },
        CategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductCategory', // Reference to ProductCategory schema
            required: true,
        },
    },
    { timestamps: true }
);

const SubCategoryModel = mongoose.model('SubCategory', SubCategorySchema);
module.exports = SubCategoryModel;
