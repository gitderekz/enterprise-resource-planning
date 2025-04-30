const Language = require('../models/Language');

// Get all languages
const getLanguages = async (req, res) => {
    try {
        const languages = await Language.findAll();
        res.json(languages);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching languages', error: err.message });
    }
};

// Add a new language
const addLanguage = async (req, res) => {
    const { lang_code, translations } = req.body;

    try {
        const language = await Language.create({
            lang_code,
            translations,
        });
        res.status(201).json({ message: 'Language added successfully', language });
    } catch (err) {
        res.status(500).json({ message: 'Error adding language', error: err.message });
    }
};

// Update a language
const updateLanguage = async (req, res) => {
    const { id } = req.params;
    const { translations } = req.body;

    try {
        const language = await Language.findByPk(id);
        if (!language) {
            return res.status(404).json({ message: 'Language not found' });
        }

        language.translations = translations || language.translations;
        await language.save();
        res.json({ message: 'Language updated successfully', language });
    } catch (err) {
        res.status(500).json({ message: 'Error updating language', error: err.message });
    }
};

// Delete a language
const deleteLanguage = async (req, res) => {
    const { id } = req.params;

    try {
        const language = await Language.findByPk(id);
        if (!language) {
            return res.status(404).json({ message: 'Language not found' });
        }

        await language.destroy();
        res.json({ message: 'Language deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting language', error: err.message });
    }
};

module.exports = { getLanguages, addLanguage, updateLanguage, deleteLanguage };