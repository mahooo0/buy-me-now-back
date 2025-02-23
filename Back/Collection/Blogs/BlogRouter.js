const express = require('express');
const { Read, Edit, Create, Delete } = require('./Controllers');
const router = express.Router();
const dynamicFileMiddleware = require('../../multer');
// Register new admin

// Get all users
router.get('/', Read);
router.get('/:slug', Read);
router.post('/', dynamicFileMiddleware, Create);
router.delete('/:id', Delete);
// Login route
router.put('/:id', dynamicFileMiddleware, Edit);

module.exports = router;
