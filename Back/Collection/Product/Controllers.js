const Schema = require('./Shema'); // Ensure this matches your model file name
const slugify = require('slugify'); // Import slugify

const Create = async (req, res) => {
    try {
        let {
            title,
            description,
            image,
            year,
            litres,
            kilometraj,
            price,
            discountedPrice,
            Category,
            SubCategory,
            images,
        } = req.body;

        // Parsing title & description since they come as JSON strings
        title = JSON.parse(title);
        description = JSON.parse(description);

        // Validation: Ensure required fields are present
        if (!title || !image || !year || !price || !Category || !SubCategory) {
            return res.status(400).json({
                error: 'Missing required fields: title, image, year, price, Category, and SubCategory are required.',
            });
        }

        // Generate slug using the English title
        const generatedSlug = slugify(title.en, { lower: true, strict: true });

        // Check if slug already exists to avoid duplicates
        const existingCategory = await Schema.findOne({
            'slug.en': generatedSlug,
        });
        if (existingCategory) {
            return res
                .status(400)
                .json({ error: 'A category with this title already exists.' });
        }

        // Create new ProductCategory instance
        const newProduct = new Schema({
            title,
            description,
            image,
            year,
            litres,
            kilometraj,
            images, // Array of image URLs
            price,
            discountedPrice,
            slug: {
                az: slugify(title.az, { lower: true, strict: true }),
                en: generatedSlug,
                ru: slugify(title.ru, { lower: true, strict: true }),
            },
            Category, // Should be ObjectId reference
            SubCategory, // Should be ObjectId reference
        });

        // Save to database
        await newProduct.save();

        res.status(201).json({
            message: 'Product Category Created Successfully',
            category: newProduct,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const GetProductDetail = async (req, res) => {
    try {
        const { slug } = req.params;

        const product = await Schema.findOne({
            $or: [
                { 'slug.az': slug },
                { 'slug.en': slug },
                { 'slug.ru': slug },
            ],
        }).exec();

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const lang = req.headers['accept-language'] || 'az'; // Get the language from headers
        const localizedProduct = getLocalizedData(product, lang);

        res.status(200).json(localizedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function getLocalizedData(product, lang) {
    return {
        title: product.title[lang],
        description: product.description[lang],
        image: product.image,
        year: product.year,
        litres: product.litres,
        kilometraj: product.kilometraj,
        images: product.images,
        price: product.price,
        discountedPrice: product.discountedPrice,
        Category: product.Category,
        SubCategory: product.SubCategory,
    };
}

const Edit = async (req, res) => {
    try {
        const { id } = req.params;
        let {
            title,
            description,
            image,
            year,
            litres,
            kilometraj,
            price,
            discountedPrice,
            Category,
            SubCategory,
            images,
            images_url,
        } = req.body;

        // Ensure title and description are parsed properly if sent as JSON strings
        if (typeof title === 'string') {
            title = JSON.parse(title);
        }
        if (typeof description === 'string') {
            description = JSON.parse(description);
        }

        // Generate slug using the English title
        const generatedSlug = slugify(title.en, { lower: true, strict: true });
        if (Array.isArray(images) && Array.isArray(images_url)) {
            if (images.length > 0) {
                images = [...images, ...images_url];
            } else {
                images = [...images, images_url];
            }
        } else {
            if (images.length > 0) {
                images = [images, ...images_url];
            } else {
                images = [images, ...images_url];
            }
        }

        // Find and update the product
        const updatedProduct = await Schema.findByIdAndUpdate(
            id,
            {
                title,
                description,
                image,
                year,
                litres,
                kilometraj,
                images, // Array of image URLs
                price,
                discountedPrice,
                slug: {
                    az: slugify(title.az, { lower: true, strict: true }),
                    en: generatedSlug,
                    ru: slugify(title.ru, { lower: true, strict: true }),
                },
                Category, // Should be ObjectId reference
                SubCategory, // Should be ObjectId reference
            },
            { new: true, runValidators: true } // Return updated document & validate inputs
        );

        // If product not found
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Read = async (req, res) => {
    try {
        const Seo = await Schema.find({})
            .populate('Category')
            .populate('SubCategory');
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
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete user
        await Schema.findByIdAndDelete(id);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { Create, Read, Delete, Edit, GetProductDetail };
