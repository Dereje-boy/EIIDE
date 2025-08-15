const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

// @route   POST /api/accounts
// @desc    Register new account
router.post('/', accountController.registerAccount);

// @route   GET /api/accounts
// @desc    Get all accounts (Admin use)
router.get('/', accountController.getAllAccounts);

// @route   GET /api/accounts/:id
// @desc    Get single account
router.get('/:id', accountController.getAccountById);

// @route   PATCH /api/accounts/:id/type
// @desc    Update account type (Admin only)
router.patch('/:id/type', accountController.updateAccountType);

// @route   DELETE /api/accounts/:id
// @desc    Delete account (Admin only)
router.delete('/:id', accountController.deleteAccount);

module.exports = router;