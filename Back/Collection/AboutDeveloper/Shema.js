const mongoose = require('mongoose');
const AboutDeveloperShema = new mongoose.Schema({
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
});

const AboutDeveloperModel = mongoose.model(
    'AboutDeveloperShema',
    AboutDeveloperShema
);
module.exports = AboutDeveloperModel;
