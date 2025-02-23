const mongoose = require('mongoose');
const AboutBunner1Shema = new mongoose.Schema({
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

const AboutBunner1Model = mongoose.model(
    'AboutBunner1Shema',
    AboutBunner1Shema
);
module.exports = AboutBunner1Model;
