const Schema = require('./Collection/Product/Shema'); // Ensure this matches your model file name
const BlogsSchema = require('./Collection/Blogs/Shema'); // Ensure this matches your model file name
const getLocalizedData = require('./getLocalizedData');
// ADD MEDIA
const GetFooterData = async (req, res) => {
    try {
        const Cars = await Schema.find({}, 'title _id slug');
        const Blogs = await BlogsSchema.find({}, 'title _id slug');

        const lang = req.headers['accept-language'] || 'az'; // Get the language from headers

        const respose = {
            Cars: Cars.map((item) => getLocalizedData(item, lang)),
            Blogs: Blogs.map((item) => getLocalizedData(item, lang)),
        };

        res.status(200).json(respose);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const GetCarsData = async (req, res) => {
    try {
        const {
            page = 1,
            title,
            category,
            subCategory,
            sortPrice,
            isDiscounted,
            minPrice,
            maxPrice,
        } = req.query; // Get filters from query params

        const lang = req.headers['accept-language'] || 'az'; // Get language from headers

        const limit = 9; // Number of items per page
        const skip = (page - 1) * limit; // Calculate the number of items to skip

        let filter = {};
        let sort = {};

        // 🔹 Apply Title Filtering
        if (title) {
            if (page === '1') {
                // Check for an **exact** match in the selected language
                const exactMatch = await Schema.findOne({
                    [`title.${lang}`]: title,
                });

                if (exactMatch) {
                    return res.status(200).json({
                        Cars: [getLocalizedData(exactMatch, lang)],
                        total_pages: 1,
                    });
                }
            }
            // If no exact match or pagination is requested, search for **partial** matches
            filter[`title.${lang}`] = { $regex: title, $options: 'i' };
        }

        // 🔹 Apply Category Filtering
        if (category) {
            filter.Category = category;
        }

        // 🔹 Apply SubCategory Filtering
        if (subCategory) {
            filter.SubCategory = subCategory;
        }

        // 🔹 Apply Discounted Products Filtering
        if (minPrice || maxPrice) {
            filter.discountedPrice = {}; // Initialize the discounted price filter
            if (minPrice) {
                filter.discountedPrice.$gte = parseFloat(minPrice); // Minimum price filter
            }
            if (maxPrice) {
                filter.discountedPrice.$lte = parseFloat(maxPrice); // Maximum price filter
            }
        }

        // 🔹 Apply Discounted Products Filtering (Only show discounted cars)
        if (isDiscounted === 'true') {
            filter.discountedPrice = {
                ...filter.discountedPrice,
                $exists: true,
            };

            // Ensure `discountedPrice` is lower than `price`
            filter.$expr = { $lt: ['$discountedPrice', '$price'] };
        }

        // 🔹 Sorting by Price
        if (sortPrice === 'asc') {
            sort.price = 1; // Cheapest first
        } else if (sortPrice === 'desc') {
            sort.price = -1; // Most expensive first
        }

        const Cars = await Schema.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
        const totalCars = await Schema.countDocuments(filter); // Get total number of filtered cars
        const totalPages = Math.ceil(totalCars / limit); // Calculate total number of pages

        const response = {
            Cars: Cars.map((item) => getLocalizedData(item, lang)),
            total_pages: totalPages,
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { GetFooterData, GetCarsData };
