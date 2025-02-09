const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Path to store the cache
const cacheFilePath = path.join(__dirname, 'modelsCache.json');

// Initialize modelsCache
let modelsCache = new Map();

// Load cache from file if it exists
if (fs.existsSync(cacheFilePath)) {
    const cacheData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
    for (const [collectionName, schemaDefinition] of Object.entries(
        cacheData
    )) {
        const schema = new mongoose.Schema(schemaDefinition, {
            timestamps: true,
        });
        const model = mongoose.model(collectionName, schema);
        modelsCache.set(collectionName, model);
    }
}

// Function to save the cache to file
function saveCacheToFile() {
    const cacheData = {};
    modelsCache.forEach((model, collectionName) => {
        cacheData[collectionName] = model.schema.obj; // Save the schema definition
    });
    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2));
}

// Get or create a dynamic model
function getDynamicModelOrCreate(collectionName, schemaDefinition) {
    if (modelsCache.has(collectionName)) {
        return modelsCache.get(collectionName);
    }

    const schema = new mongoose.Schema(schemaDefinition, { timestamps: true });
    const model = mongoose.model(collectionName, schema);
    modelsCache.set(collectionName, model);

    // Save updated cache to file
    saveCacheToFile();

    return false;
}

// Get a dynamic model if it exists
function getDynamicModel(collectionName) {
    return modelsCache.has(collectionName)
        ? modelsCache.get(collectionName)
        : false;
}

module.exports = { getDynamicModelOrCreate, getDynamicModel };
