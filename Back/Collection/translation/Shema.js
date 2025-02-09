const mongoose = require('mongoose');
const translationShema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: {
        az: { type: String, required: true },
        en: { type: String, required: true },
        ru: { type: String, required: true },
    },
});

const translationModel = mongoose.model('translationShema', translationShema);
module.exports = translationModel;
