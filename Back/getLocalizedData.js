const getLocalizedData = (data, lang) => {
    data = data.toObject();
    if (!data || typeof data !== 'object') return data;

    return Object.keys(data).reduce((localizedData, key) => {
        if (
            typeof data[key] === 'object' &&
            data[key] !== null &&
            lang in data[key] &&
            key !== 'slug'
        ) {
            localizedData[key] = data[key][lang] || data[key]['en']; // Default to English if not found
        } else {
            localizedData[key] = data[key]; // Keep non-localized fields
        }
        return localizedData;
    }, {});
};

module.exports = getLocalizedData;
