const Schema = require('./Shema'); // Ensure this matches your model file name

const Contact = async (req, res) => {
    try {
        let { name, email, phone, message } = req.body;

        // Create new user (without password hashing)
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!phone) {
            return res.status(400).json({ message: 'Phone is required' });
        }
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }
        const newSeo = new Schema({ name, email, phone, message });
        newSeo.save();
        res.status(201).json({
            message: 'message was sent successfully',
            newSeo,
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
const Delete = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        const deletedHero = await Schema.findByIdAndDelete(id);

        if (!deletedHero) {
            return res.status(404).json({ message: 'Hero not found' });
        }

        res.status(200).json({ message: 'Hero deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { Read, Contact, Delete };
