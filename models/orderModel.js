const db = require('./db');

// CREATE: Add new order
exports.createOrder = async (orderData) => {
    try {
        const [result] = await db.query(
            'INSERT INTO orders (cust_id, total_price) VALUES (?, ?)',
            [orderData.cust_id, orderData.total_price]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// READ: Get all orders
exports.getAllOrders = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM orders');
        return rows;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

// READ: Get order by ID
exports.getOrderById = async (order_id) => {
    try {
        const [rows] = await db.query('SELECT * FROM orders WHERE order_id = ?', [order_id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        throw error;
    }
};

// READ: Get orders by customer ID
exports.getOrdersByCustomerId = async (cust_id) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM orders WHERE cust_id = ? ORDER BY order_date DESC',
            [cust_id]
        );
        return rows;
    } catch (error) {
        console.error('Error fetching orders by customer ID:', error);
        throw error;
    }
};

// UPDATE: Modify order total price
exports.updateOrderTotal = async (order_id, new_total) => {
    try {
        const [result] = await db.query(
            'UPDATE orders SET total_price = ? WHERE order_id = ?',
            [new_total, order_id]
        );
        return result.affectedRows;
    } catch (error) {
        console.error('Error updating order total:', error);
        throw error;
    }
};

// DELETE: Remove order by ID
exports.deleteOrder = async (order_id) => {
    try {
        const [result] = await db.query('DELETE FROM orders WHERE order_id = ?', [order_id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
};