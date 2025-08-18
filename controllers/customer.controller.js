const customerModel = require('../models/customerModel');

// @desc    Create new customer
// @route   POST /api/customers
exports.createCustomer = async (req, res) => {
    try {
        const { first_name, last_name, phone, sex, username } = req.body;
        const custId = await customerModel.createCustomer({
            first_name,
            last_name,
            phone,
            sex,
            username
        });

        res.json({
            success: true,
            message: 'Customer profile created successfully',
            reason: null,
            data: { cust_id: custId }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try checking the username or required fields',
            reason: `Creation failed: ${error.message}`
        });
    }
};

// @desc    Get all customers
// @route   GET /api/customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await customerModel.getAllCustomers();

        res.json({
            success: true,
            message: 'Customer list retrieved successfully',
            reason: null,
            data: customers
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try refreshing the page or contact support',
            reason: `Retrieval error: ${error.message}`
        });
    }
};

// @desc    Get customer by ID
// @route   GET /api/customers/:id
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await customerModel.getCustomerById(req.params.id);

        if (!customer) {
            return res.json({
                success: false,
                message: 'Check the customer ID from your directory',
                reason: 'No customer found with provided ID'
            });
        }

        res.json({
            success: true,
            message: 'Customer details retrieved',
            reason: null,
            data: customer
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try searching again with different criteria',
            reason: `Lookup failed: ${error.message}`
        });
    }
};

// @desc    Get customer by username
// @route   GET /api/customers/username/:username
exports.getCustomerByUsername = async (req, res) => {
    try {
        const customer = await customerModel.getCustomerByUsername(req.params.username);

        if (!customer) {
            return res.json({
                success: false,
                message: 'Verify the username from your records',
                reason: 'No customer linked to this username'
            });
        }

        res.json({
            success: true,
            message: 'Customer profile found',
            reason: null,
            data: customer
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try checking the username spelling',
            reason: `Search error: ${error.message}`
        });
    }
};

// @desc    Update customer details
// @route   PUT /api/customers/:id
exports.updateCustomer = async (req, res) => {
    try {
        const affectedRows = await customerModel.updateCustomer(
            req.params.id,
            req.body
        );

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Confirm the customer exists before updating',
                reason: 'No records updated - ID not found'
            });
        }

        res.json({
            success: true,
            message: 'Customer details updated successfully',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try using valid values for all fields',
            reason: `Update failed: ${error.message}`
        });
    }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
exports.deleteCustomer = async (req, res) => {
    try {
        const affectedRows = await customerModel.deleteCustomer(req.params.id);

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Verify the customer ID from your management view',
                reason: 'No records deleted - ID not found'
            });
        }

        res.json({
            success: true,
            message: 'Customer record permanently removed',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try removing associated orders first if deletion fails',
            reason: `Deletion blocked: ${error.message}`
        });
    }
};