const db = require('./db');

// CREATE: Add a new customer
exports.createCustomer = async (customerData) => {
    try {
        const [result] = await db.query(
            'INSERT INTO customer (first_name, last_name, phone, sex, username) VALUES (?, ?, ?, ?, ?)',
            [customerData.first_name, customerData.last_name, customerData.phone, customerData.sex, customerData.username]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
};

// READ: Get all customers
exports.getAllCustomers = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM customer');
        return rows;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};

// READ: Get customer by ID
exports.getCustomerById = async (cust_id) => {
    try {
        const [rows] = await db.query('SELECT * FROM customer WHERE cust_id = ?', [cust_id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching customer by ID:', error);
        throw error;
    }
};

// READ: Get customer by username (using FK reference)
exports.getCustomerByUsername = async (username) => {
    try {
        const [rows] = await db.query('SELECT * FROM customer WHERE username = ?', [username]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching customer by username:', error);
        throw error;
    }
};

// UPDATE: Modify customer details
exports.updateCustomer = async (cust_id, updateData) => {
    try {
        const [result] = await db.query(
            'UPDATE customer SET first_name = ?, last_name = ?, phone = ?, sex = ? WHERE cust_id = ?',
            [updateData.first_name, updateData.last_name, updateData.phone, updateData.sex, cust_id]
        );
        return result.affectedRows;
    } catch (error) {
        console.error('Error updating customer:', error);
        throw error;
    }
};

// DELETE: Remove customer by ID
exports.deleteCustomer = async (cust_id) => {
    try {
        const [result] = await db.query('DELETE FROM customer WHERE cust_id = ?', [cust_id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error deleting customer:', error);
        throw error;
    }
};
