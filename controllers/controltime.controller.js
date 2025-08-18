const controlTimeModel = require('../models/controltimeModel');

// @desc    Create new control time entry
// @route   POST /api/control-times
exports.createControlTime = async (req, res) => {
    try {
        const { order_id, order_time } = req.body;
        const conId = await controlTimeModel.createControlTime(order_id, order_time || new Date().toTimeString().slice(0, 8));

        res.json({
            success: true,
            message: 'Time entry recorded successfully',
            reason: null,
            data: { con_id: conId }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Verify the order exists and time is in HH:MM:SS format',
            reason: `Recording failed: ${error.message}`
        });
    }
};

// @desc    Get all control time entries
// @route   GET /api/control-times
exports.getAllControlTimes = async (req, res) => {
    try {
        const times = await controlTimeModel.getAllControlTimes();

        res.json({
            success: true,
            message: 'All time entries retrieved',
            reason: null,
            data: times
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try refreshing the page or check your network connection',
            reason: `Retrieval error: ${error.message}`
        });
    }
};

// @desc    Get control time by ID
// @route   GET /api/control-times/:id
exports.getControlTimeById = async (req, res) => {
    try {
        const timeEntry = await controlTimeModel.getControlTimeById(req.params.id);

        if (!timeEntry) {
            return res.json({
                success: false,
                message: 'Check the time entry ID from your activity log',
                reason: 'No time record found with provided ID'
            });
        }

        res.json({
            success: true,
            message: 'Time entry details retrieved',
            reason: null,
            data: timeEntry
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try searching again with a different ID',
            reason: `Lookup error: ${error.message}`
        });
    }
};

// @desc    Get control times by order ID
// @route   GET /api/control-times/order/:order_id
exports.getControlTimesByOrderId = async (req, res) => {
    try {
        const times = await controlTimeModel.getControlTimesByOrderId(req.params.order_id);

        if (times.length === 0) {
            return res.json({
                success: false,
                message: 'Verify the order exists or has time entries',
                reason: 'No time records found for this order'
            });
        }

        res.json({
            success: true,
            message: 'Order timeline retrieved',
            reason: null,
            data: times
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try checking the order ID or contact support',
            reason: `Order timeline error: ${error.message}`
        });
    }
};

// @desc    Update control time entry
// @route   PUT /api/control-times/:id
exports.updateControlTime = async (req, res) => {
    try {
        const affectedRows = await controlTimeModel.updateControlTime(
            req.params.id,
            req.body.order_time
        );

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Confirm the time entry exists in your records',
                reason: 'No entries were updated - ID not found'
            });
        }

        res.json({
            success: true,
            message: 'Time entry updated successfully',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Ensure time format is HH:MM:SS before retrying',
            reason: `Update failed: ${error.message}`
        });
    }
};

// @desc    Delete control time entry
// @route   DELETE /api/control-times/:id
exports.deleteControlTime = async (req, res) => {
    try {
        const affectedRows = await controlTimeModel.deleteControlTime(req.params.id);

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Verify the entry ID from your time log',
                reason: 'No records deleted - ID not found'
            });
        }

        res.json({
            success: true,
            message: 'Time entry permanently deleted',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try deleting from the time management interface instead',
            reason: `Deletion error: ${error.message}`
        });
    }
};