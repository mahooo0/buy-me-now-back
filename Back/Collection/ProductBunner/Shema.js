const mongoose = require('mongoose');
const HomeProductBunnerShema = new mongoose.Schema({
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
    video: { type: String, required: true },
});

const HomrProductBunnerModel = mongoose.model(
    'HomeProductBunnerShema',
    HomeProductBunnerShema
);
module.exports = HomrProductBunnerModel;
