const express = require('express');
const { Read, Delete } = require('./Controllers');
const router = express.Router();
// Register new admin

// Get all users
router.get('/', Read);
// router.put('/', Create);
router.delete('/:id', Delete);

module.exports = router;
