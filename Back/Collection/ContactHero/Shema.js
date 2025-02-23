const mongoose = require('mongoose');
const ContactHero = new mongoose.Schema({
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

const ContactModel = mongoose.model('ContactHero', ContactHero);
module.exports = ContactModel;
