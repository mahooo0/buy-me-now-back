const mongoose = require('mongoose');
const SeoShema = new mongoose.Schema({
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
    type: { type: String, required: true },
});

const SeoModel = mongoose.model('SeoShema', SeoShema);
module.exports = SeoModel;
