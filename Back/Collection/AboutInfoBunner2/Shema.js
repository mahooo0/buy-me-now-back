const mongoose = require('mongoose');
const AboutBunner2Shema = new mongoose.Schema({
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
    images: { type: [String], required: true },
});

const AboutBunner2Model = mongoose.model(
    'AboutBunner2Shema',
    AboutBunner2Shema
);
module.exports = AboutBunner2Model;
