const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
        },
        value: {
            az: { type: String, required: true }, // Azerbaijani translation
            en: { type: String, required: true }, // English translation
            ru: { type: String, required: true }, // Russian translation
        },
    },
    { timestamps: true }
); // Optional: Include createdAt and updatedAt fields

const Translation = mongoose.model('Translation', translationSchema);

module.exports = Translation;
