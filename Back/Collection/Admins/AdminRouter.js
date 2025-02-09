const express = require('express');
const Schema = require('./Shema'); // Ensure this matches your model file name
const { Read, Create, Delete, Login } = require('./Controllers');
const router = express.Router();

// Register new admin
router.post('/', Create);

// Get all users
router.get('/', Read);
// Delete user by ID
router.delete('/:id', Delete);
// Login route
router.post('/login', Login);

module.exports = router;
