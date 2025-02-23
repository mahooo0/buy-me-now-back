const mongoose = require('mongoose');
const BlogsShema = new mongoose.Schema({
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
    image: { type: String, required: true },
    slug: {
        az: { type: String, required: true, unique: true },
        en: { type: String, required: true, unique: true },
        ru: { type: String, required: true, unique: true },
    },
});

const BlogModel = mongoose.model('BlogsShema', BlogsShema);
module.exports = BlogModel;
