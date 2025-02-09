const mongoose = require('mongoose');
const AdminShema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['viuwer', 'admin', 'editor'],
    },
});

const AdminModel = mongoose.model('AdminShema', AdminShema);
module.exports = AdminModel;
