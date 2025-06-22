const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authenticate');

router.get('/me', authenticate, userController.getProfile);
router.put('/me/languages', authenticate, userController.updateLanguages);
router.get('/', authenticate, userController.searchUsers);

module.exports = router;