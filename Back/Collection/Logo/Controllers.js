const Schema = require('./Shema'); // Ensure this matches your model file name

const Create = async (req, res) => {
    try {
        const { type, image } = req.body;
        if (!type || !image) {
            return res
                .status(400)
                .json({ error: 'Invalid input: type and img are required' });
        }
        // Create new user (without password hashing)
        const logo = new Schema({ type, image });
        logo.save();
        res.status(201).json({ message: 'logo Created successfully', logo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Edit = async (req, res) => {
    try {
        const { id } = req.params;

        const { type, image } = req.body;

        const updatedTranslation = await Schema.findByIdAndUpdate(
            id,
            { type, image },
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
const ReadLogo = async (req, res) => {
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

module.exports = { Create, Read, ReadLogo, Delete, Edit };
