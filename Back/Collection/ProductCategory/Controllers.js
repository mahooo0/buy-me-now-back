const getLocalizedData = require('../../getLocalizedData');
const Schema = require('./Shema'); // Ensure this matches your model file name

const Create = async (req, res) => {
    try {
        let { title, image, image_bg } = req.body;
        title = JSON.parse(title);
        if (!title || !image || !image_bg) {
            return res
                .status(400)
                .json({ error: 'Invalid input: type and img are required' });
        }
        // Create new user (without password hashing)
        const Category = new Schema({ title, image, image_bg });
        Category.save();
        res.status(201).json({
            message: 'Category Created successfully',
            Category,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Edit = async (req, res) => {
    try {
        const { id } = req.params;

        let { title, image, image_bg } = req.body;

        title = JSON.parse(title);
        const updatedTranslation = await Schema.findByIdAndUpdate(
            id,
            { title, image, image_bg },
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
const ReadCategoryes = async (req, res) => {
    try {
        const Seo = await Schema.find({});
        const lang = req.headers['accept-language']; // Get the language from headers
        const categoryes = Seo.map((item) => getLocalizedData(item, lang));
        res.status(200).json(categoryes);
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

module.exports = { Create, Read, Delete, Edit, ReadCategoryes };
