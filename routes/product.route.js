const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

const { auth } = require('../middlewares/auth')

// Existing routes
router.post('/', auth, productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/code/:pro_code', productController.getProductByCode);
router.get('/search/:term', productController.searchProducts);
router.put('/:id', auth, productController.updateProduct);

// New inventory-specific route
router.patch('/:id/stock', auth, productController.updateStock);

// Existing delete
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;