const express = require('express');
const router = express.Router();
const SEO = require('../models/seoSchema'); // Adjust path to your SEO model

// Create a new SEO entry
router.post('/', async (req, res) => {
    try {
        const { heading, metaTitle, metaDescription, metaKeywords, type } =
            req.body;

        // Validate required fields
        if (
            !heading ||
            !metaTitle ||
            !metaDescription ||
            !metaKeywords ||
            !type
        ) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const seoEntry = new SEO({
            heading,
            metaTitle,
            metaDescription,
            metaKeywords,
            type,
        });
        await seoEntry.save();

        res.status(201).json({ success: true, data: seoEntry });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get all SEO entries or filter by type
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;

        let seoEntries;
        if (type) {
            seoEntries = await SEO.find({ type });
        } else {
            seoEntries = await SEO.find();
        }

        res.status(200).json(seoEntries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Edit an SEO entry
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { heading, metaTitle, metaDescription, metaKeywords, type } =
            req.body;

        const updatedSEO = await SEO.findByIdAndUpdate(
            id,
            { heading, metaTitle, metaDescription, metaKeywords, type },
            { new: true, runValidators: true }
        );

        if (!updatedSEO) {
            return res.status(404).json({ error: 'SEO entry not found' });
        }

        res.status(200).json({ success: true, data: updatedSEO });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an SEO entry
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSEO = await SEO.findByIdAndDelete(id);

        if (!deletedSEO) {
            return res.status(404).json({ error: 'SEO entry not found' });
        }

        res.status(200).json({ success: true, data: deletedSEO });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
