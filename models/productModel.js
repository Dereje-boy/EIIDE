const db = require('./db');

// CREATE: Add new product
exports.createProduct = async (productData) => {
    try {
        const [result] = await db.query(
            'INSERT INTO product (pro_type, pro_name, pro_code, price) VALUES (?, ?, ?, ?)',
            [productData.pro_type, productData.pro_name, productData.pro_code, productData.price]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// READ: Get all products
exports.getAllProducts = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM product');
        return rows;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// READ: Get product by ID
exports.getProductById = async (pro_id) => {
    try {
        const [rows] = await db.query('SELECT * FROM product WHERE pro_id = ?', [pro_id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
};

// READ: Get product by unique code
exports.getProductByCode = async (pro_code) => {
    try {
        const [rows] = await db.query('SELECT * FROM product WHERE pro_code = ?', [pro_code]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching product by code:', error);
        throw error;
    }
};

// READ: Search products by name or type
exports.searchProducts = async (searchTerm) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM product WHERE pro_name LIKE ? OR pro_type LIKE ?',
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        return rows;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

// UPDATE: Modify product details
exports.updateProduct = async (pro_id, updateData) => {
    try {
        const [result] = await db.query(
            'UPDATE product SET pro_type = ?, pro_name = ?, pro_code = ?, price = ? WHERE pro_id = ?',
            [
                updateData.pro_type,
                updateData.pro_name,
                updateData.pro_code,
                updateData.price,
                pro_id
            ]
        );
        return result.affectedRows;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

// DELETE: Remove product by ID
exports.deleteProduct = async (pro_id) => {
    try {
        const [result] = await db.query('DELETE FROM product WHERE pro_id = ?', [pro_id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};