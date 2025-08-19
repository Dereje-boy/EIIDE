const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const uploadSingle = require('../middlewares/uploadsingle')

const { auth } = require('../middlewares/auth')

// Order CRUD
router.post('/', uploadSingle.single('receipt_image'), orderController.createOrder);
router.get('/', auth, orderController.getAllOrders);
router.get('/acc_id', orderController.getCustomerOrders);
router.get('/:id', orderController.getOrderDetails);
router.delete('/:id', auth, orderController.deleteOrder);

// Special endpoints
router.get('/customer/:cust_id', auth, orderController.getCustomerOrders);
router.get('/product/:pro_id', auth, orderController.getProductOrders);

module.exports = router;