const mongoose = require('mongoose');
const ContactInfosShema = new mongoose.Schema({
    title: {
        az: { type: String, required: true },
        en: { type: String, required: true },
        ru: { type: String, required: true },
    },
    image: { type: String, required: true },
});

const ContactInfosModel = mongoose.model(
    'ContactInfosShema',
    ContactInfosShema
);
module.exports = ContactInfosModel;
