const Schema = require('./Shema'); // Ensure this matches your model file name

const Create = async (req, res) => {
    try {
        const { key, value } = req.body;

        // Create new user (without password hashing)
        const newTranslation = new Schema({ key, value });
        await newTranslation.save();

        res.status(201).json({ message: 'Translation Created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Edit = async (req, res) => {
    try {
        const { id } = req.params;

        const { key, value } = req.body;

        const updatedTranslation = await Schema.findByIdAndUpdate(
            id,
            { key, value },
            { new: true }
        );
        res.status(200).json({
            message: 'Translation updated successfully',
            updatedTranslation,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const ReadAdmin = async (req, res) => {
    try {
        const translations = await Schema.find({});
        res.status(200).json(translations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const translations = await Schema.findById(id);
        if (!translations) {
            return res.status(404).json({ message: 'translations not found' });
        }

        // Delete user
        await Schema.findByIdAndDelete(id);

        res.status(200).json({ message: 'translations deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//api

const Read_Translation = async (req, res) => {
    try {
        const translations = await Schema.find(); // Find translations by language
        const lang = req.headers['accept-language']; // Get the language from headers
        const result = translations.reduce((acc, item) => {
            acc[item.key] = item.value[lang]; // Add the translation to the result object
            return acc;
        }, {});
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { Create, Read_Translation, ReadAdmin, Delete, Edit };
