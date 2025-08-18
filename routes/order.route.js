const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const uploadSingle = require('../middlewares/uploadsingle')

// Order CRUD
router.post('/', uploadSingle.single('receipt_image'), orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/acc_id', orderController.getCustomerOrders);
router.get('/:id', orderController.getOrderDetails);
router.delete('/:id', orderController.deleteOrder);

// Special endpoints
router.get('/customer/:cust_id', orderController.getCustomerOrders);
router.get('/product/:pro_id', orderController.getProductOrders);

module.exports = router;