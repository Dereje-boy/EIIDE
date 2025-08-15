// models/serviceModel.js
const db = require('./db');

exports.createAccount = async ({ username, password, account_type }) => {
    try {
        const [result] = await db.query(
            'INSERT INTO account (username, password, account_type) VALUES (?, ?, ?)',
            [username, password, account_type]
        );
        return result.insertId; // Returns the new account_id
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }
};

// READ: Get all accounts (for admin purposes)
exports.getAllAccounts = async () => {

    try {
        const [rows] = await db.query('SELECT * FROM account');
        return rows;
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }
};

// READ: Get account by ID
exports.getAccountById = async (account_id) => {
    try {
        const [rows] = await db.query('SELECT * FROM account WHERE account_id = ?', [account_id]);
        return rows[0]; // Returns a single account or undefined
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }
};

// UPDATE: Change password
exports.updatePassword = async (account_id, new_password) => {
    try {
        const [result] = await db.query(
            'UPDATE account SET password = ? WHERE account_id = ?',
            [new_password, account_id]
        );
        return result.affectedRows;

    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }
};
exports.deleteAccount = async (account_id) => {
    try {
        const [result] = await db.query('DELETE FROM account WHERE account_id = ?', [account_id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }
};