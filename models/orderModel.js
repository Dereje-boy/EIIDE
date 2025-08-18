const db = require('./db');
const productModel = require('./productModel');

// CREATE: New order
exports.createOrder = async (orderData) => {
    try {
        // 1. Verify product exists
        const product = await productModel.getProductById(orderData.pro_id);
        if (!product) throw new Error('Product not found');

        // 2. Calculate total
        const quantity = orderData.quantity || 1;
        const total_price = (product.price * quantity).toFixed(2);

        // 3. Create order
        const [result] = await db.query(
            `INSERT INTO orders (
        acc_id, pro_id, pro_price, quantity,
        total_price, receipt_image
      ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                orderData.acc_id,
                orderData.pro_id,
                product.price,
                quantity,
                total_price,
                orderData.receipt_image || null
            ]
        );

        return {
            order_id: result.insertId,
            pro_price: product.price,
            quantity,
            total_price
        };
    } catch (error) {
        throw error;
    }
};

// READ: Get order by ID
exports.getOrderById = async (order_id) => {
    try {
        const [rows] = await db.query(
            `SELECT 
        o.*,
        p.pro_name,
        p.pro_code,
        a.username
       FROM orders o
       JOIN product p ON o.pro_id = p.pro_id
       JOIN account a ON o.acc_id = a.account_id
       WHERE o.order_id = ?`,
            [order_id]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// READ: Get orders by account ID
exports.getOrdersByAccount = async (acc_id) => {
    try {
        const [orders] = await db.query(
            `SELECT 
        o.order_id,
        o.pro_id,
        p.pro_name,
        p.pro_code,
        o.pro_price,
        o.quantity,
        o.total_price,
        o.order_date,
        o.receipt_image
       FROM orders o
       JOIN product p ON o.pro_id = p.pro_id
       WHERE o.acc_id = ?
       ORDER BY o.order_date DESC`,
            [acc_id]
        );
        return orders;
    } catch (error) {
        throw error;
    }
};

// READ: Get all orders (paginated)
// READ: Get all orders (without pagination)
exports.getAllOrders = async () => {
    try {
        const [orders] = await db.query(
            `SELECT 
        o.order_id,
        o.acc_id,
        a.username,
        o.pro_id,
        p.pro_name,
        o.pro_price,
        o.quantity,
        o.total_price,
        o.order_date,
        o.receipt_image
       FROM orders o
       JOIN account a ON o.acc_id = a.account_id
       JOIN product p ON o.pro_id = p.pro_id
       ORDER BY o.order_date DESC`
        );
        return orders;
    } catch (error) {
        throw error;
    }
};

// DELETE: Order
exports.deleteOrder = async (order_id) => {
    try {
        const [result] = await db.query(
            'DELETE FROM orders WHERE order_id = ?',
            [order_id]
        );
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

// SPECIAL: Get orders by product
exports.getOrdersByProduct = async (pro_id) => {
    try {
        const [orders] = await db.query(
            `SELECT 
        o.order_id,
        o.quantity,
        o.total_price,
        o.order_date,
        a.username
       FROM orders o
       JOIN account a ON o.acc_id = a.account_id
       WHERE o.pro_id = ?
       ORDER BY o.order_date DESC`,
            [pro_id]
        );
        return orders;
    } catch (error) {
        throw error;
    }
};