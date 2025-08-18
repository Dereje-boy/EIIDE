// models/serviceModel.js
const db = require('./db');
const { hashPassword } = require('../utils/authUtils');

exports.createAccount = async ({ username, password, account_type }) => {
    try {
        const hashedPassword = await hashPassword(password);
        const [result] = await db.query(
            'INSERT INTO account (username, password, account_type) VALUES (?, ?, ?)',
            [username, hashedPassword, account_type]
        );
        return result.insertId; // Returns the new account_id
    } catch (error) {
        console.error('Error in database transaction:', err);
        throw err;
    }
};

// password verification method
exports.verifyCredentials = async (username, plainPassword) => {
    console.log({ username, plainPassword })
    const [rows] = await db.query(
        'SELECT * FROM account WHERE username = ?',
        [username]
    );

    if (!rows[0]) {
        console.log('no account registered with the usernames');
        return false;
    }

    const { comparePassword } = require('../utils/authUtils');
    return await comparePassword(plainPassword, rows[0].password);
};

// Get account by username
exports.getAccountByUsername = async (username) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM account WHERE username = ?',
            [username]
        );
        return rows[0]; // Returns account object or undefined
    } catch (error) {
        console.error('Error fetching account by username:', error);
        throw error;
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