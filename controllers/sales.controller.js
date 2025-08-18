const saleModel = require('../models/salesModel');

// @desc    Record new sale
// @route   POST /api/sales
exports.createSale = async (req, res) => {
    try {
        const { cust_name, brand, emp_username } = req.body;
        const salesId = await saleModel.createSale({
            cust_name,
            brand,
            emp_username
        });

        res.json({
            success: true,
            message: 'Sale recorded successfully',
            reason: null,
            data: { sales_id: salesId }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Verify employee username and required fields',
            reason: `Sale recording failed: ${error.message}`
        });
    }
};

// @desc    Get all sales
// @route   GET /api/sales
exports.getAllSales = async (req, res) => {
    try {
        const sales = await saleModel.getAllSales();

        res.json({
            success: true,
            message: 'Sales records retrieved',
            reason: null,
            data: sales
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try refreshing the page or check connection',
            reason: `Sales retrieval failed: ${error.message}`
        });
    }
};

// @desc    Get sale by ID
// @route   GET /api/sales/:id
exports.getSaleById = async (req, res) => {
    try {
        const sale = await saleModel.getSaleById(req.params.id);

        if (!sale) {
            return res.json({
                success: false,
                message: 'Check the sale ID from your records',
                reason: 'Sale not found'
            });
        }

        res.json({
            success: true,
            message: 'Sale details retrieved',
            reason: null,
            data: sale
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try searching again with different criteria',
            reason: `Sale lookup failed: ${error.message}`
        });
    }
};

// @desc    Get sales by employee
// @route   GET /api/sales/employee/:username
exports.getSalesByEmployee = async (req, res) => {
    try {
        const sales = await saleModel.getSalesByEmployee(req.params.username);

        if (sales.length === 0) {
            return res.json({
                success: false,
                message: 'This employee has no recorded sales',
                reason: 'No sales found for employee'
            });
        }

        res.json({
            success: true,
            message: 'Employee sales retrieved',
            reason: null,
            data: sales
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Verify the employee username is correct',
            reason: `Sales search failed: ${error.message}`
        });
    }
};

// @desc    Update sale record
// @route   PUT /api/sales/:id
exports.updateSale = async (req, res) => {
    try {
        const affectedRows = await saleModel.updateSale(
            req.params.id,
            req.body
        );

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Confirm the sale exists in your records',
                reason: 'No sales were updated'
            });
        }

        res.json({
            success: true,
            message: 'Sale record updated successfully',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Ensure all fields contain valid values',
            reason: `Update failed: ${error.message}`
        });
    }
};

// @desc    Delete sale record
// @route   DELETE /api/sales/:id
exports.deleteSale = async (req, res) => {
    try {
        const affectedRows = await saleModel.deleteSale(req.params.id);

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Verify the sale ID from your system',
                reason: 'No sales were deleted'
            });
        }

        res.json({
            success: true,
            message: 'Sale record permanently removed',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Contact administrator if deletion fails',
            reason: `Deletion blocked: ${error.message}`
        });
    }
};