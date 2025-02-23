const getLocalizedData = require('../../getLocalizedData');
const Schema = require('./Shema'); // Ensure this matches your model file name

const Create = async (req, res) => {
    try {
        let { title, description, images } = req.body;

        // Create new user (without password hashing)
        if (!title || !description || !images) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        title = JSON.parse(title);
        description = JSON.parse(description);
        const newBunner = new Schema({ title, description, images });
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

        let { title, description, images, imageUrls } = req.body;
        title = JSON.parse(title);
        description = JSON.parse(description);
        console.log('imageUrls', imageUrls);
        console.log('images', images);

        images = Array.isArray(images)
            ? images
            : typeof images === 'string' && images !== ''
            ? [images]
            : [];
        imageUrls = Array.isArray(imageUrls) ? imageUrls : [];

        if (imageUrls.length) {
            images = [...images, ...imageUrls];
        }
        const updatedHero = await Schema.findByIdAndUpdate(
            '67ab8e648ed315d96c8f84ca',
            { title, description, images },
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
const GetAboutBunner2 = async (req, res) => {
    try {
        const HeroArrey = await Schema.find({});
        const lang = req.headers['accept-language'] || 'az'; // Get the language from headers
        const hero = getLocalizedData(HeroArrey[0], lang);
        // const hero = HeroArrey[0];
        res.status(200).json(hero);
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

module.exports = { Read, Edit, Create, Delete, GetAboutBunner2 };
