const express = require('express');
const Translation = require('../models/translationSchema');
const router = express.Router();

// Create a new translation
router.post('/', async (req, res) => {
    try {
        const { key, value } = req.body;

        // Validate the input
        if (!key || !value || !value.az || !value.en || !value.ru) {
            return res.status(400).json({
                error: 'Invalid input: key and value (az, en, ru) are required',
            });
        }

        // Check for duplicate keys
        const existingTranslation = await Translation.findOne({ key });
        if (existingTranslation) {
            return res.status(400).json({ error: 'Key already exists' });
        }

        // Create and save the translation
        const translation = new Translation({ key, value });
        await translation.save();

        res.status(201).json({
            message: 'Translation created successfully',
            translation,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get all translations or a specific one by key
router.get('/admin', async (req, res) => {
    try {
        const { key } = req.query;

        if (key) {
            // Fetch a specific translation by key
            const translation = await Translation.findOne({ key });
            if (!translation) {
                return res.status(404).json({ error: 'Translation not found' });
            }
            return res.status(200).json(translation);
        }

        // Fetch all translations
        const translations = await Translation.find();
        res.status(200).json(translations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get all translations or a specific one by key
router.get('/', async (req, res) => {
    try {
        const { key } = req.query;

        if (key) {
            // Fetch a specific translation by key
            const translation = await Translation.findOne({ key });
            if (!translation) {
                return res.status(404).json({ error: 'Translation not found' });
            }
            // Return the translation as { key: value }
            const result = { [translation.key]: translation.value };
            return res.status(200).json(result);
        }

        // Fetch all translations
        const translations = await Translation.find();

        // Transform the result into { key1: value1, key2: value2 } format
        const result = translations.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Edit a translation by key
router.put('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        // Validate input
        if (!value || !value.az || !value.en || !value.ru) {
            return res.status(400).json({
                error: 'Invalid input: value (az, en, ru) is required',
            });
        }

        // Find and update the translation
        const updatedTranslation = await Translation.findOneAndUpdate(
            { key }, // Find by key
            { value }, // Update the value object
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!updatedTranslation) {
            return res.status(404).json({ error: 'Translation not found' });
        }

        res.status(200).json({
            message: 'Translation updated successfully',
            translation: updatedTranslation,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
