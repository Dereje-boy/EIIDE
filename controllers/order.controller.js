const orderModel = require('../models/ordermodel');
const productModel = require('../models/productModel');
const { verifyToken } = require('../utils/jwt');
const accountModel = require('../models/accountModel');


// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
    try {
        // Validate required fields
        const { pro_id, quantity } = req.body;

        if (!pro_id || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                reason: 'Product ID and quantity are required'
            });
        }

        // Get product details
        const product = await productModel.getProductById(pro_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
                reason: 'invalid_product_id'
            });
        }

        // Check stock
        if (product.stock_quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock',
                reason: 'insufficient_stock'
            });
        }

        // Validate receipt image
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Payment receipt is required',
                reason: 'missing_receipt'
            });
        }

        // Calculate total
        const total_price = (product.price * quantity).toFixed(2);
        const receipt_path = `/uploads/receipts/${req.file.filename}`;

        //get acc_id from cookie token
        const token = req.cookies['token']
        if (!token || !token.length || !verifyToken(token) || !(verifyToken(token).payload)) return res.json({
            success: false,
            message: 'No Account Information Fount',
            reason: 'Please Sign in first'
        });
        const username = verifyToken(token).payload
        const user = await accountModel.getAccountByUsername(username)
        if (!user) return res.json({
            success: false,
            message: 'No Account Information Fount',
            reason: 'Please Sign in first'
        });

        const acc_id = user.account_id;

        // Create order
        const orderData = {
            pro_id,
            quantity,
            acc_id,
            pro_price: product.price,
            total_price,
            receipt_image: receipt_path
        };

        const orderId = await orderModel.createOrder(orderData);

        // Update product stock
        await productModel.updateStockQuantity(pro_id, product.stock_quantity - quantity);

        res.json({
            success: true,
            message: 'Order created successfully',
            data: {
                order_id: orderId,
                receipt_path,
                total_price
            }
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            reason: error.message
        });
    }
};


exports.createOrderForm = async (req, res) => {
    res.render('order/order.handlebars')
}

// @desc    Get order details
// @route   GET /api/orders/:id
exports.getOrderDetails = async (req, res) => {
    try {
        const order = await orderModel.getOrderById(req.params.id);

        if (!order) {
            return res.json({
                success: false,
                message: 'Order not found',
                reason: 'Invalid order ID'
            });
        }

        res.json({
            success: true,
            message: 'Order details retrieved',
            reason: null,
            data: order
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Failed to fetch order details',
            reason: error.message
        });
    }
};

// @desc    Get all orders (paginated)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.getAllOrders();

        res.json({
            success: true,
            message: `Retrieved ${orders.length} orders`,
            reason: null,
            data: orders
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Failed to fetch orders',
            reason: error.message
        });
    }
};

// @desc    Get customer's order history
// @route   GET /api/orders/acc_id
exports.getCustomerOrders = async (req, res) => {
    try {
        const token = req.cookies['token']
        // console.log("token: " + token)
        if (!token || !token.length) throw "Invalid token"
        // console.log({ 'verifyToken': verifyToken(token) })
        const username = verifyToken(token).payload
        const user = await accountModel.getAccountByUsername(username)
        // console.log(user)

        console.log('fetching this customer orders')
        const acc_id = user.account_id;
        const orders = await orderModel.getOrdersByAccount(acc_id);
        console.log(orders)

        res.json({
            success: true,
            message: `Found ${orders.length} orders for this customer`,
            reason: null,
            data: orders
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Failed to fetch customer orders',
            reason: error.message
        });
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
exports.deleteOrder = async (req, res) => {
    try {
        const affectedRows = await orderModel.deleteOrder(req.params.id);

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'No order was deleted',
                reason: 'Order ID not found'
            });
        }

        res.json({
            success: true,
            message: 'Order deleted successfully',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Failed to delete order',
            reason: error.message.includes('a foreign key constraint fails')
                ? 'Cannot delete - order has related records'
                : error.message
        });
    }
};

// @desc    Get orders for specific product
// @route   GET /api/orders/product/:pro_id
exports.getProductOrders = async (req, res) => {
    try {
        const orders = await orderModel.getOrdersByProduct(req.params.pro_id);

        res.json({
            success: true,
            message: `Found ${orders.length} orders for this product`,
            reason: null,
            data: orders
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Failed to fetch product orders',
            reason: error.message
        });
    }
};