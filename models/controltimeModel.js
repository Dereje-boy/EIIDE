// models/serviceModel.js
const db = require('./db');

// CREATE: Add a new control time entry
exports.createControlTime = async (order_id, order_time) => {
    try {

        const [result] = await db.query(
            'INSERT INTO control_time (order_id, order_time) VALUES (?, ?)',
            [order_id, order_time]
        );
        return result.insertId; // Returns the new con_id
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }

};

// READ: Get all control time entries
exports.getAllControlTimes = async () => {
    try {

        const [rows] = await db.query('SELECT * FROM control_time');
        return rows;
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }

};

// READ: Get control time by ID
exports.getControlTimeById = async (con_id) => {
    try {

        const [rows] = await db.query('SELECT * FROM control_time WHERE con_id = ?', [con_id]);
        return rows[0];
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }

};


// UPDATE: Modify order_time for a specific entry
exports.updateControlTime = async (con_id, new_order_time) => {
    try {

        const [result] = await db.query(
            'UPDATE control_time SET order_time = ? WHERE con_id = ?',
            [new_order_time, con_id]
        );
        return result.affectedRows;
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }

};

// DELETE: Remove control time entry by ID
exports.deleteControlTime = async (con_id) => {
    try {

        const [result] = await db.query('DELETE FROM control_time WHERE con_id = ?', [con_id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }

};
