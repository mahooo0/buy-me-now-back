const express = require('express');
const { Read, Create, Delete, Edit } = require('./Controllers');
const dynamicFileMiddleware = require('../../multer');
const router = express.Router();

// Register new admin
router.post('/', dynamicFileMiddleware, Create);

// Get all users
router.get('/', Read);
// Delete user by ID
router.delete('/:id', Delete);
// Login route
router.put('/:id', dynamicFileMiddleware, Edit);

module.exports = router;
