const feedbackModel = require('../models/feedbackModel');

// @desc    Submit new feedback
// @route   POST /api/feedback
exports.createFeedback = async (req, res) => {
    try {
        const { cust_id, feed_email, feed_comment } = req.body;
        const feedId = await feedbackModel.createFeedback({
            cust_id,
            feed_email,
            feed_comment,
            feed_date: new Date().toISOString().slice(0, 10) // Auto-set today's date
        });

        res.json({
            success: true,
            message: 'Feedback submitted successfully',
            reason: null,
            data: { feed_id: feedId }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try again later or contact support directly',
            reason: `Submission failed: ${error.message}`
        });
    }
};

// @desc    Get all feedback entries
// @route   GET /api/feedback
exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await feedbackModel.getAllFeedback();

        res.json({
            success: true,
            message: 'Feedback records retrieved',
            reason: null,
            data: feedbacks
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try refreshing the page or check your connection',
            reason: `Retrieval error: ${error.message}`
        });
    }
};

// @desc    Get feedback by ID
// @route   GET /api/feedback/:id
exports.getFeedbackById = async (req, res) => {
    try {
        const feedback = await feedbackModel.getFeedbackById(req.params.id);

        if (!feedback) {
            return res.json({
                success: false,
                message: 'Check the feedback ID from your records',
                reason: 'No feedback found with provided ID'
            });
        }

        res.json({
            success: true,
            message: 'Feedback details retrieved',
            reason: null,
            data: feedback
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try searching again with different criteria',
            reason: `Lookup failed: ${error.message}`
        });
    }
};

// @desc    Get feedback by customer ID
// @route   GET /api/feedback/customer/:cust_id
exports.getFeedbackByCustomerId = async (req, res) => {
    try {
        const feedbacks = await feedbackModel.getFeedbackByCustomerId(req.params.cust_id);

        if (feedbacks.length === 0) {
            return res.json({
                success: false,
                message: 'This customer has no submitted feedback',
                reason: 'No records found for customer ID'
            });
        }

        res.json({
            success: true,
            message: 'Customer feedback history retrieved',
            reason: null,
            data: feedbacks
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try verifying the customer ID',
            reason: `Search error: ${error.message}`
        });
    }
};

// @desc    Update feedback comment/email
// @route   PUT /api/feedback/:id
exports.updateFeedback = async (req, res) => {
    try {
        const affectedRows = await feedbackModel.updateFeedback(
            req.params.id,
            {
                feed_comment: req.body.feed_comment,
                feed_email: req.body.feed_email
            }
        );

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Confirm the feedback exists in your records',
                reason: 'No records updated - ID not found'
            });
        }

        res.json({
            success: true,
            message: 'Feedback updated successfully',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Ensure comment is not empty before retrying',
            reason: `Update failed: ${error.message}`
        });
    }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
exports.deleteFeedback = async (req, res) => {
    try {
        const affectedRows = await feedbackModel.deleteFeedback(req.params.id);

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Verify the feedback ID from your system',
                reason: 'No records deleted - ID not found'
            });
        }

        res.json({
            success: true,
            message: 'Feedback permanently deleted',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try again later or contact your administrator',
            reason: `Deletion failed: ${error.message}`
        });
    }
};