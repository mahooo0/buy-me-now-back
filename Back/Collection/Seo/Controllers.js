const Schema = require('./Shema'); // Ensure this matches your model file name

const Create = async (req, res) => {
    try {
        const { heading, metaTitle, metaDescription, metaKeywords, type } =
            req.body;

        // Create new user (without password hashing)
        const newSeo = new Schema({
            heading,
            metaTitle,
            metaDescription,
            metaKeywords,
            type,
        });
        newSeo.save();
        res.status(201).json({ message: 'Seo Created successfully', newSeo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Edit = async (req, res) => {
    try {
        const { id } = req.params;

        const { heading, metaTitle, metaDescription, metaKeywords, type } =
            req.body;

        const updatedTranslation = await Schema.findByIdAndUpdate(
            id,
            { heading, metaTitle, metaDescription, metaKeywords, type },
            { new: true }
        );
        res.status(200).json({
            message: 'Translation updated successfully',
            updatedTranslation,
        });
    } catch (error) {
        res.status500().json({ message: error.message });
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

module.exports = { Create, Read, Delete, Edit };
