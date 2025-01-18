const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema(
    {
        heading: {
            az: { type: String, required: true },
            en: { type: String, required: true },
            ru: { type: String, required: true },
        },
        metaTitle: {
            az: { type: String, required: true },
            en: { type: String, required: true },
            ru: { type: String, required: true },
        },
        metaDescription: {
            az: { type: String, required: true },
            en: { type: String, required: true },
            ru: { type: String, required: true },
        },
        metaKeywords: {
            az: { type: String, required: true },
            en: { type: String, required: true },
            ru: { type: String, required: true },
        },
        type: {
            type: String,
            required: true,
            enum: ['page', 'post', 'category', 'tag'], // Add more options as needed
        },
    },
    { timestamps: true }
);

const SEO = mongoose.model('SEO', seoSchema);

module.exports = SEO;
