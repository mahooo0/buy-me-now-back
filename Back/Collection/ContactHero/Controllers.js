const getLocalizedData = require('../../getLocalizedData');
const Schema = require('./Shema'); // Ensure this matches your model file name

const Create = async (req, res) => {
    try {
        let { title, description, image } = req.body;

        // Create new user (without password hashing)
        if (!title || !description || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        title = JSON.parse(title);
        description = JSON.parse(description);
        const newBunner = new Schema({ title, description, image });
        newBunner.save();
        res.status(201).json({
            message: 'Hero Created successfully',
            newBunner,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Edit = async (req, res) => {
    try {
        // const { id } = req.params;

        let { title, description, image } = req.body;
        title = JSON.parse(title);
        description = JSON.parse(description);
        const updatedHero = await Schema.findByIdAndUpdate(
            '67b35e1c00a45111cc6bb507',
            { title, description, image },
            { new: true }
        );
        res.status(200).json({
            message: 'Hero updated successfully',
            updatedHero,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Read = async (req, res) => {
    try {
        const HeroArrey = await Schema.find({});
        // const hero = HeroArrey[0];
        res.status(200).json(HeroArrey);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const ReadContactHero = async (req, res) => {
    try {
        const HeroArray = await Schema.find({});
        const hero = HeroArray[0]; // Convert Mongoose document to a plain object
        const lang = req.headers['accept-language'] || 'en'; // Default to English
        const localizedData = getLocalizedData(hero, lang);

        res.status(200).json(localizedData);
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

        res.status(200).json({ message: ' about info deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { Read, Edit, Create, ReadContactHero, Delete };
