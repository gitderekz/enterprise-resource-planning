const express = require('express');
const { getLanguages, addLanguage, updateLanguage, deleteLanguage } = require('../controllers/languageController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getLanguages);
router.post('/', auth, addLanguage);
router.put('/:id', auth, updateLanguage);
router.delete('/:id', auth, deleteLanguage);

module.exports = router;