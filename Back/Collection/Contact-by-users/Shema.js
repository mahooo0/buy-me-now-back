const mongoose = require('mongoose');
const ContactByUser = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
});

const ContactByUserModel = mongoose.model('ContactByUser', ContactByUser);
module.exports = ContactByUserModel;
