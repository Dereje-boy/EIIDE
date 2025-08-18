const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

router.post('/', loginController.login);
router.get('/', loginController.loginget)

module.exports = router;