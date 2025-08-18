const db = require('./db');

// CREATE: Add new product (now with stock and images)
exports.createProduct = async (productData) => {
    try {
        const [result] = await db.query(
            'INSERT INTO product (pro_type, pro_name, pro_code, price, stock_quantity, images) VALUES (?, ?, ?, ?, ?, ?)',
            [
                productData.pro_type,
                productData.pro_name,
                productData.pro_code,
                productData.price,
                productData.stock_quantity || 1, // Default to 1
                productData.images || null       // Allow null
            ]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

// READ: Get all products (now includes new fields)
exports.getAllProducts = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM product');
        return rows;
    } catch (error) {
        throw error;
    }
};

// READ: Get product by ID (includes new fields)
exports.getProductById = async (pro_id) => {
    try {
        const [rows] = await db.query('SELECT * FROM product WHERE pro_id = ?', [pro_id]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// READ: Get product by code (includes new fields)
exports.getProductByCode = async (pro_code) => {
    try {
        const [rows] = await db.query('SELECT * FROM product WHERE pro_code LIKE ?', [`%${pro_code}%`]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// SEARCH: Products with new fields
exports.searchProducts = async (searchTerm) => {
    try {
        const [rows] = await db.query(
            `SELECT pro_id, pro_name, price, stock_quantity, images 
       FROM product 
       WHERE pro_name LIKE ? OR pro_type LIKE ?`,
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

// UPDATE: Full product update
exports.updateProduct = async (pro_id, updateData) => {
    try {
        const [result] = await db.query(
            'UPDATE product SET ? WHERE pro_id = ?',
            [updateData, pro_id]
        );
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

// UPDATE: Only stock quantity
exports.updateStockQuantity = async (pro_id, newQuantity) => {
    try {
        const [result] = await db.query(
            'UPDATE product SET stock_quantity = ? WHERE pro_id = ?',
            [newQuantity, pro_id]
        );
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

// DELETE: Remove product
exports.deleteProduct = async (pro_id) => {
    try {
        const [result] = await db.query('DELETE FROM product WHERE pro_id = ?', [pro_id]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};