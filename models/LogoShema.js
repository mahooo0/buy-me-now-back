const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema(
    {
        type: {
            type: String, // Single language type (e.g., "Company Logo")
            required: true,
        },
        image: {
            type: String, // Image string (e.g., URL or base64-encoded string)
            required: true,
        },
    },
    { timestamps: true } // Optional: Adds createdAt and updatedAt fields
);

const Logo = mongoose.model('Logo', logoSchema);

module.exports = Logo;
