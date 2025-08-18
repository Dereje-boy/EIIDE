const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Existing routes
router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/code/:pro_code', productController.getProductByCode);
router.get('/search/:term', productController.searchProducts);
router.put('/:id', productController.updateProduct);

// New inventory-specific route
router.patch('/:id/stock', productController.updateStock);

// Existing delete
router.delete('/:id', productController.deleteProduct);

module.exports = router;