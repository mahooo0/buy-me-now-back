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
        const newSeo = new Schema({ title, description, image });
        newSeo.save();
        res.status(201).json({ message: 'Hero Created successfully', newSeo });
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
            '67aa34765d452a416551f904',
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
const ReadContactHomeBunner = async (req, res) => {
    try {
        const HeroArrey = await Schema.find({});
        const lang = req.headers['accept-language'] || 'az'; // Get the language from headers

        const hero = getLocalizedData(HeroArrey[0], lang);
        res.status(200).json(hero);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { Read, Edit, Create, ReadContactHomeBunner };
