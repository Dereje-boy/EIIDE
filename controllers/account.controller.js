const accountModel = require('../models/accountModel');

// @desc    Register new account
// @route   POST /api/accounts
exports.registerAccount = async (req, res) => {
    console.log('coming request')
    console.log(req.body)
    try {
        const { username, password, account_type } = req.body;
        const accountId = await accountModel.createAccount({
            username,
            password,
            account_type
        });

        res.json({
            success: true,
            message: 'Account created successfully. You may now login',
            reason: null,
            data: { account_id: accountId }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try a different username or check for typos',
            reason: error.code === 'ER_DUP_ENTRY'
                ? 'Username already exists'
                : `Registration error: ${error.message}`
        });
    }
};

// @desc    Get all accounts
// @route   GET /api/accounts
exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await accountModel.getAllAccounts();

        res.json({
            success: true,
            message: 'Account list retrieved successfully',
            reason: null,
            data: accounts.map(account => {
                const { password, ...accountData } = account;
                return accountData;
            })
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try refreshing the page or contact system administrator',
            reason: `Account retrieval failed: ${error.message}`
        });
    }
};

// @desc    Get single account
// @route   GET /api/accounts/:id
exports.getAccountById = async (req, res) => {
    try {
        const account = await accountModel.getAccountById(req.params.id);

        if (!account) {
            return res.json({
                success: false,
                message: 'Check the account ID in your management console',
                reason: 'No account found with the provided ID'
            });
        }

        const { password, ...accountData } = account;

        res.json({
            success: true,
            message: 'Account details retrieved',
            reason: null,
            data: accountData
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try searching again or verify the account ID',
            reason: `Lookup error: ${error.message}`
        });
    }
};

// @desc    Update account type
// @route   PATCH /api/accounts/:id/type
exports.updateAccountType = async (req, res) => {
    try {
        const affectedRows = await accountModel.updateAccountType(
            req.params.id,
            req.body.account_type
        );

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Confirm the account exists before updating',
                reason: 'Target account not found in database'
            });
        }

        res.json({
            success: true,
            message: 'Account type updated successfully',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try using valid account types: customer, employee, or admin',
            reason: `Update failed: ${error.message}`
        });
    }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
exports.deleteAccount = async (req, res) => {
    try {
        const affectedRows = await accountModel.deleteAccount(req.params.id);

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Verify the account ID from your management view',
                reason: 'No accounts were deleted - ID not found'
            });
        }

        res.json({
            success: true,
            message: 'Account permanently deactivated',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try removing dependent records first or contact support',
            reason: `Deletion blocked: ${error.message}`
        });
    }
};