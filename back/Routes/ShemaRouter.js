const express = require('express');
const {
    getDynamicModelOrCreate,
    getDynamicModel,
} = require('../models/DynamicModel');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const router = express.Router();

// Define your routes here

router.post('/', async (req, res) => {
    try {
        const { collectionName, schemaDefinition, document } = req.body;

        if (!collectionName || !schemaDefinition || !document) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get or create the dynamic model
        const DynamicModel = getDynamicModelOrCreate(
            collectionName,
            schemaDefinition
        );
        if (!DynamicModel) {
            res.status(201).json({ success: true, data: 'created' });
        }

        // Create and save the document
        const newDocument = new DynamicModel(document);
        await newDocument.save();

        res.status(201).json({ success: true, data: newDocument });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/:collectionName', async (req, res) => {
    try {
        const { collectionName } = req.params;
        const { schemaDefinition } = req.body;

        if (!schemaDefinition) {
            return res
                .status(400)
                .json({ error: 'Missing required field: schemaDefinition' });
        }

        // Get the dynamic model
        const DynamicModel = await getDynamicModel(collectionName);

        if (!DynamicModel) {
            return res
                .status(400)
                .json({ error: 'Schema not found for this collection' });
        }

        // Update the schema definition
        DynamicModel.schema.add(schemaDefinition);

        // Update the modelsCache.json file
        const modelsCachePath = path.join(
            __dirname,
            '../models/modelsCache.json'
        );

        let modelsCache = {};
        if (fs.existsSync(modelsCachePath)) {
            modelsCache = JSON.parse(fs.readFileSync(modelsCachePath, 'utf8'));
        }

        modelsCache[collectionName] = schemaDefinition;
        fs.writeFileSync(modelsCachePath, JSON.stringify(modelsCache, null, 2));

        res.status(200).json({
            success: true,
            message: 'Schema updated successfully',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const modelsCachePath = path.join(
            __dirname,
            '../models/modelsCache.json'
        );
        let modelsCache = {};
        if (fs.existsSync(modelsCachePath)) {
            modelsCache = JSON.parse(fs.readFileSync(modelsCachePath, 'utf8'));
        }

        res.status(200).json({ success: true, data: modelsCache });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get a schema by collection name
router.get('/:collectionName', async (req, res) => {
    try {
        const { collectionName } = req.params;

        const modelsCachePath = path.join(
            __dirname,
            '../models/modelsCache.json'
        );
        let modelsCache = {};
        if (fs.existsSync(modelsCachePath)) {
            modelsCache = JSON.parse(fs.readFileSync(modelsCachePath, 'utf8'));
        }

        const schemaDefinition = modelsCache[collectionName];

        if (!schemaDefinition) {
            return res
                .status(400)
                .json({ error: 'Schema not found for this collection' });
        }

        res.status(200).json({ success: true, data: schemaDefinition });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete('/:collectionName', async (req, res) => {
    try {
        const { collectionName } = req.params;

        // Check if the schema exists
        const DynamicModel = await getDynamicModel(collectionName);

        if (!DynamicModel) {
            return res
                .status(400)
                .json({ error: 'Schema not found for this collection' });
        }

        // Remove the schema from the models cache
        const modelsCachePath = path.join(
            __dirname,
            '../models/modelsCache.json'
        );
        let modelsCache = {};
        if (fs.existsSync(modelsCachePath)) {
            modelsCache = JSON.parse(fs.readFileSync(modelsCachePath, 'utf8'));
        }

        delete modelsCache[collectionName];
        fs.writeFileSync(modelsCachePath, JSON.stringify(modelsCache, null, 2));

        // Drop the collection from the database
        await mongoose.connection.dropCollection(collectionName);

        res.status(200).json({
            success: true,
            message: 'Schema deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Export the router
module.exports = router;
