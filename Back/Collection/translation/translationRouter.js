const express = require('express');
const { Create, Delete, ReadAdmin, Edit } = require('./Controllers');
const router = express.Router();

// Register new admin
router.post('/', Create);

// Get all users
router.get('/admin', ReadAdmin);
// router.get('/', Read);
// Delete user by ID
router.delete('/:id', Delete);
// Login route
router.put('/:id', Edit);

module.exports = router;
