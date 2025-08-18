const db = require('./db');

// CREATE: Record new sale
exports.createSale = async (saleData) => {
    try {
        const [result] = await db.query(
            'INSERT INTO sales (cust_name, brand, emp_username) VALUES (?, ?, ?)',
            [saleData.cust_name, saleData.brand, saleData.emp_username]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error recording sale:', error);
        throw error;
    }
};

// READ: Get all sales
exports.getAllSales = async () => {
    try {
        const [rows] = await db.query(`
      SELECT s.*, a.account_type 
      FROM sales s
      LEFT JOIN account a ON s.emp_username = a.username
    `);
        return rows;
    } catch (error) {
        console.error('Error fetching sales:', error);
        throw error;
    }
};

// READ: Get sale by ID
exports.getSaleById = async (sales_id) => {
    try {
        const [rows] = await db.query(`
      SELECT s.*, a.account_type
      FROM sales s
      LEFT JOIN account a ON s.emp_username = a.username
      WHERE s.sales_id = ?
    `, [sales_id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching sale by ID:', error);
        throw error;
    }
};

// READ: Get sales by employee username
exports.getSalesByEmployee = async (emp_username) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM sales WHERE emp_username = ? ORDER BY sales_id DESC',
            [emp_username]
        );
        return rows;
    } catch (error) {
        console.error('Error fetching sales by employee:', error);
        throw error;
    }
};

// UPDATE: Update sale record
exports.updateSale = async (sales_id, updateData) => {
    try {
        const [result] = await db.query(
            'UPDATE sales SET cust_name = ?, brand = ? WHERE sales_id = ?',
            [updateData.cust_name, updateData.brand, sales_id]
        );
        return result.affectedRows;
    } catch (error) {
        console.error('Error updating sale:', error);
        throw error;
    }
};

// DELETE: Remove sale record
exports.deleteSale = async (sales_id) => {
    try {
        const [result] = await db.query('DELETE FROM sales WHERE sales_id = ?', [sales_id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error deleting sale:', error);
        throw error;
    }
};