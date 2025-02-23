const Schema = require('./Shema'); // Ensure this matches your model file name

const Create = async (req, res) => {
    try {
        let { title, CategoryId } = req.body;
        if (!title | !CategoryId) {
            return res
                .status(400)
                .json({ error: 'Invalid input: type and img are required' });
        }
        // Create new user (without password hashing)
        const Category = new Schema({ title, CategoryId });
        Category.save();
        res.status(201).json({
            message: 'SubCategory Created successfully',
            Category,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Edit = async (req, res) => {
    try {
        const { id } = req.params;

        let { title, CategoryId } = req.body;

        const updatedTranslation = await Schema.findByIdAndUpdate(
            id,
            { title, CategoryId },
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
        const { categoryid } = req.query;
        let filter = {};

        // If categoryid is provided, filter by it
        if (categoryid) {
            filter.CategoryId = categoryid;
        }

        const subCategories = await Schema.find(filter).populate('CategoryId');

        // if (!subCategories.length) {
        //     return res.status(404).json({ message: 'No subcategories found' });
        // }

        res.status(200).json(subCategories);
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
