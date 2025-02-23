const express = require('express');
const { Read, Edit, Create } = require('./Controllers');
const router = express.Router();
const dynamicFileMiddleware = require('../../multer');
// Register new admin

// Get all users
router.get('/', Read);
// router.post('/', Create);
// Login route
router.put('/', Edit);

module.exports = router;
