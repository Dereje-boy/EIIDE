const db = require('./db');

// CREATE: Add new feedback
exports.createFeedback = async (feedbackData) => {
    try {
        const [result] = await db.query(
            'INSERT INTO feedback (cust_id, feed_email, feed_comment, feed_date) VALUES (?, ?, ?, ?)',
            [
                feedbackData.cust_id,
                feedbackData.feed_email,
                feedbackData.feed_comment,
                feedbackData.feed_date || new Date().toISOString().slice(0, 10) // Default to today
            ]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error creating feedback:', error);
        throw error;
    }
};

// READ: Get all feedback entries
exports.getAllFeedback = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM feedback');
        return rows;
    } catch (error) {
        console.error('Error fetching feedback:', error);
        throw error;
    }
};

// READ: Get feedback by ID
exports.getFeedbackById = async (feed_id) => {
    try {
        const [rows] = await db.query('SELECT * FROM feedback WHERE feed_id = ?', [feed_id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching feedback by ID:', error);
        throw error;
    }
};

// READ: Get feedback by customer ID (with JOIN to customer details)
exports.getFeedbackByCustomerId = async (cust_id) => {
    try {
        const [rows] = await db.query(
            `SELECT f.*, c.first_name, c.last_name 
       FROM feedback f
       JOIN customer c ON f.cust_id = c.cust_id
       WHERE f.cust_id = ?`,
            [cust_id]
        );
        return rows;
    } catch (error) {
        console.error('Error fetching feedback by customer ID:', error);
        throw error;
    }
};

// UPDATE: Modify feedback (e.g., admin response)
exports.updateFeedback = async (feed_id, updateData) => {
    try {
        const [result] = await db.query(
            'UPDATE feedback SET feed_comment = ?, feed_email = ? WHERE feed_id = ?',
            [updateData.feed_comment, updateData.feed_email, feed_id]
        );
        return result.affectedRows;
    } catch (error) {
        console.error('Error updating feedback:', error);
        throw error;
    }
};

// DELETE: Remove feedback by ID
exports.deleteFeedback = async (feed_id) => {
    try {
        const [result] = await db.query('DELETE FROM feedback WHERE feed_id = ?', [feed_id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error deleting feedback:', error);
        throw error;
    }
};