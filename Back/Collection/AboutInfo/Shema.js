const mongoose = require('mongoose');
const AboutInfoShema = new mongoose.Schema({
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

const AboutInfoModel = mongoose.model('AboutInfoShema', AboutInfoShema);
module.exports = AboutInfoModel;
