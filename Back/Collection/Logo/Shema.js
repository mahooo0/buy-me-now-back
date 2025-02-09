const mongoose = require('mongoose');
const logoShema = new mongoose.Schema({
    type: { type: String, required: true },
    image: { type: String, required: true },
});

const logoModel = mongoose.model('logoShema', logoShema);
module.exports = logoModel;
