const getLocalizedData = require('../../getLocalizedData');
const Schema = require('./Shema'); // Ensure this matches your model file name

const Create = async (req, res) => {
    try {
        let { title, image } = req.body;
        title = JSON.parse(title);
        if (!title || !image) {
            return res
                .status(400)
                .json({ error: 'Invalid input: type and img are required' });
        }
        // Create new user (without password hashing)
        const logo = new Schema({ title, image });
        logo.save();
        res.status(201).json({ message: 'logo Created successfully', logo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Edit = async (req, res) => {
    try {
        const { id } = req.params;

        let { title, image } = req.body;
        if (!title || !image) {
            return res
                .status(400)
                .json({ error: 'Invalid input: type and img are required' });
        }
        title = JSON.parse(title);
        const updatedTranslation = await Schema.findByIdAndUpdate(
            id,
            { title, image },
            { new: true }
        );
        res.status(200).json({
            message: 'logo updated successfully',
            updatedTranslation,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Read = async (req, res) => {
    try {
        const Seo = await Schema.find({});
        res.status(200).json(Seo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const GetContactInfos = async (req, res) => {
    try {
        const ContactInfos = await Schema.find({});
        const lang = req.headers['accept-language'] || 'az'; // Get the language from headers
        const contactInfos = ContactInfos.map((contactInfo) =>
            getLocalizedData(contactInfo, lang)
        );
        res.status(200).json(contactInfos);
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

module.exports = { Create, Read, Delete, Edit, GetContactInfos };
