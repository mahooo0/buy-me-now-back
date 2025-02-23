const mongoose = require('mongoose');
const HomeHeroShema = new mongoose.Schema({
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
});

const HomrHeroModel = mongoose.model('HomeHeroShema', HomeHeroShema);
module.exports = HomrHeroModel;
