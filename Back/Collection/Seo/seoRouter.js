const express = require('express');
const { Read, Create, Delete, Edit } = require('./Controllers');
const router = express.Router();

// Register new admin
router.post('/', Create);

// Get all users
router.get('/', Read);
// Delete user by ID
router.delete('/:id', Delete);
// Login route
router.put('/:id', Edit);

module.exports = router;
