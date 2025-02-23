const Schema = require('./Shema'); // Ensure this matches your model file name
const slugify = require('slugify');
const mongoose = require('mongoose');
const getLocalizedData = require('../../getLocalizedData');
const Create = async (req, res) => {
    try {
        let { title, description, image } = req.body;

        // Create new user (without password hashing)
        title = JSON.parse(title);
        description = JSON.parse(description);
        let slug = {
            az: slugify(title.az),
            en: slugify(title.en),
            ru: slugify(title.ru),
        };

        if (!title || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newBlog = new Schema({ title, description, image, slug });
        newBlog.save();
        res.status(201).json({ message: 'Blog Created successfully', newBlog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Edit = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        let { title, description, image } = req.body;

        try {
            title = typeof title === 'string' ? JSON.parse(title) : title;
            description =
                typeof description === 'string'
                    ? JSON.parse(description)
                    : description;
        } catch (error) {
            return res.status(400).json({ message: 'Invalid JSON format' });
        }

        let slug = {
            az: title?.az ? slugify(title.az) : '',
            en: title?.en ? slugify(title.en) : '',
            ru: title?.ru ? slugify(title.ru) : '',
        };

        let updateFields = {};
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (image) updateFields.image = image;
        updateFields.slug = slug;
        updateFields.updatedAt = new Date(); // Ensure update

        const newBlog = await Schema.findByIdAndUpdate(id, updateFields, {
            new: true,
            runValidators: true,
        });

        if (!newBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({
            message: 'Hero updated successfully',
            newBlog,
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
const ReadBlogs = async (req, res) => {
    try {
        const Blogs = await Schema.find({}).limit(5); // Change const to let
        const lang = req.headers['accept-language']; // Get the language from headers

        const NewBlogs = Blogs.map((item) => getLocalizedData(item, lang));
        res.status(200).json(NewBlogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const GetBlogs = async (req, res) => {
    try {
        const { page = 1 } = req.query; // Get page and limit from query params, default to 1 and 9
        const limit = 9;
        const totalBlogs = await Schema.countDocuments(); // Get total number of blogs
        const totalPages = Math.ceil(totalBlogs / limit); // Calculate total pages

        const Blogs = await Schema.find({})
            .skip((page - 1) * limit)
            .limit(limit); // Apply pagination

        const lang = req.headers['accept-language'] || 'az'; // Get the language from headers

        const NewBlogs = Blogs.map((item) => getLocalizedData(item, lang));
        res.status(200).json({ NewBlogs, totalPages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const GetBlogDetail = async (req, res) => {
    try {
        const { slug } = req.params;

        const blog = await Schema.findOne({
            $or: [
                { 'slug.az': slug },
                { 'slug.en': slug },
                { 'slug.ru': slug },
            ],
        }).exec();

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const lang = req.headers['accept-language'] || 'az'; // Get the language from headers
        const localizedBlog = getLocalizedData(blog, lang);

        res.status(200).json(localizedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const Blogs = await Schema.findById(id);
        if (!Blogs) {
            return res.status(404).json({ message: 'Blogs not found' });
        }

        // Delete user
        await Schema.findByIdAndDelete(id);

        res.status(200).json({ message: ' blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    Read,
    Edit,
    Create,
    Delete,
    ReadBlogs,
    GetBlogs,
    GetBlogDetail,
};
