const productModel = require('../models/productModel');

// @desc    Create product (now with stock and images)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        const { pro_type, pro_name, pro_code, price, stock_quantity, images } = req.body;

        const productId = await productModel.createProduct({
            pro_type,
            pro_name,
            pro_code,
            price,
            stock_quantity: stock_quantity || 1, // Default to 1
            images: images || null               // Allow null
        });

        res.json({
            success: true,
            message: 'Product created with inventory tracking',
            reason: null,
            data: {
                pro_id: productId,
                stock_quantity: stock_quantity || 1
            }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Verify all required fields including image paths',
            reason: error.code === 'ER_DUP_ENTRY'
                ? 'Product code already exists'
                : error.message
        });
    }
};

// @desc    Get all products
// @route   GET /api/products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();

        res.json({
            success: true,
            message: 'Product inventory retrieved',
            reason: null,
            data: products
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try refreshing the page or check network connection',
            reason: `Inventory load failed: ${error.message}`
        });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
    try {
        const product = await productModel.getProductById(req.params.id);

        if (!product) {
            return res.json({
                success: false,
                message: 'Check the product ID from your inventory list',
                reason: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product details retrieved',
            reason: null,
            data: product
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try searching again with different criteria',
            reason: `Product lookup failed: ${error.message}`
        });
    }
};

// @desc    Get product by code
// @route   GET /api/products/code/:pro_code
exports.getProductByCode = async (req, res) => {
    try {
        const product = await productModel.getProductByCode(req.params.pro_code);

        if (!product) {
            return res.json({
                success: false,
                message: 'Verify the product code from your catalog',
                reason: 'No product with this code exists'
            });
        }

        res.json({
            success: true,
            message: 'Product found by code',
            reason: null,
            data: product
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try checking the code format (case-sensitive)',
            reason: `Code search failed: ${error.message}`
        });
    }
};

// @desc    Search products
// @route   GET /api/products/search/:term
exports.searchProducts = async (req, res) => {
    try {
        const results = await productModel.searchProducts(req.params.term);

        if (results.length === 0) {
            return res.json({
                success: false,
                message: 'Try different search terms or check spelling',
                reason: 'No products matched your search'
            });
        }

        res.json({
            success: true,
            message: 'Search results retrieved',
            reason: null,
            data: results
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try a simpler search query',
            reason: `Search failed: ${error.message}`
        });
    }
};


// @desc    Update product (new fields)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            // Ensure stock can't be set to null
            stock_quantity: req.body.stock_quantity !== undefined
                ? req.body.stock_quantity
                : undefined
        };

        const affectedRows = await productModel.updateProduct(
            req.params.id,
            updateData
        );

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Confirm the product exists in your inventory',
                reason: 'No products were updated'
            });
        }

        res.json({
            success: true,
            message: 'Product and inventory updated',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Ensure stock is a whole number and images are valid paths',
            reason: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const affectedRows = await productModel.deleteProduct(req.params.id);

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Verify the product ID from your system',
                reason: 'No products were deleted'
            });
        }

        res.json({
            success: true,
            message: 'Product permanently removed from inventory',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Remove product from active orders first',
            reason: `Deletion blocked: ${error.message}`
        });
    }
};

// Add this new method for inventory-specific updates
// @desc    Update stock quantity
// @route   PATCH /api/products/:id/stock
exports.updateStock = async (req, res) => {
    try {
        const { action, quantity } = req.body;
        let newQuantity;

        console.log({ action, quantity });

        // Get current stock
        const [product] = await productModel.getProductById(req.params.id);

        // Calculate new value
        if (action === 'increment') {
            newQuantity = product.stock_quantity + (quantity || 1);
        } else if (action === 'decrement') {
            newQuantity = product.stock_quantity - (quantity || 1);
        } else {
            newQuantity = quantity;
        }

        // Validate
        if (newQuantity < 0) {
            return res.json({
                success: false,
                message: 'Stock cannot go below zero',
                reason: 'Invalid quantity operation'
            });
        }

        // Update
        await productModel.updateStockQuantity(req.params.id, newQuantity);

        res.json({
            success: true,
            message: 'Stock level updated',
            reason: null,
            data: { new_quantity: newQuantity }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Use the "action" field (increment/decrement) or specify exact quantity',
            reason: error.message
        });
    }
};