const express = require('express');
const { Read, Edit } = require('./Controllers');
const router = express.Router();
const dynamicFileMiddleware = require('../../multer');
// Register new admin

// Get all users
router.get('/', Read);
// Login route
router.put('/', dynamicFileMiddleware, Edit);

module.exports = router;
