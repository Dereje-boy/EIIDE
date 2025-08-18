// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.getElementById('main-nav');
const productsContainer = document.getElementById('products-container');
const sidebar = document.querySelector('.sidebar');
const orderDialog = document.getElementById('orderDialog');
const orderDialogOverlay = document.getElementById('orderDialogOverlay');
const cancelOrderBtn = document.getElementById('cancelOrderBtn');
const submitOrderBtn = document.getElementById('submitOrderBtn');
const submitSpinner = document.getElementById('submitSpinner');
const receiptImageInput = document.getElementById('receiptImage');
const receiptPreview = document.getElementById('receiptPreview');

// Current order data
let currentOrder = {
    pro_id: null,
    quantity: 1,
    price: 0,
    cust_id: 1
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    loadAds();
    setupEventListeners();
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    mainNav.classList.toggle('active');
}

// Responsive Ad Placement
function handleResponsiveAds() {
    const adContainers = document.querySelectorAll('.ad-container');

    if (window.innerWidth <= 992) {
        // For tablet and mobile - move ads below content
        if (!sidebar.contains(adContainers[0])) {
            document.querySelector('.main-content').appendChild(sidebar);
        }
    } else {
        // For desktop - keep ads on the right
        if (sidebar.contains(adContainers[0])) {
            const container = document.querySelector('.container.main-content');
            container.insertBefore(sidebar, container.children[1]);
        }
    }
}

// Load Products from API
async function loadProducts() {
    try {
        productsContainer.innerHTML = '<div class="loading">Loading products...</div>';

        const response = await fetch('/api/products');
        const result = await response.json();

        if (result.success) {
            renderProducts(result.data);
        } else {
            showError(productsContainer, result.message, result.reason);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showError(productsContainer, 'Network Error', 'Failed to load products. Please try again later.');
    }
}

// Render Products
function renderProducts(products) {
    productsContainer.innerHTML = '';

    if (!products || products.length === 0) {
        productsContainer.innerHTML = '<p>No products available at the moment.</p>';
        return;
    }

    const productsGrid = document.createElement('div');
    productsGrid.className = 'products';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const imageUrl = product.images
            ? product.images.split(',')[0].trim()
            : '/uploads/producs/one.jpg';

        const stockStatus = product.stock_quantity > 0
            ? `<span class="stock">In Stock (${product.stock_quantity})</span>`
            : '<span class="stock out-of-stock">Out of Stock</span>';

        productCard.innerHTML = `
            <div class="product-image" style="background-image: url('/uploads/products/${imageUrl}')"></div>
            <div class="product-info">
                <h3>${product.pro_name}</h3>
                <p>${product.pro_type}</p>
                <div class="price">$${product.price}</div>
                ${stockStatus}
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${product.pro_id}">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" 
                        max="${product.stock_quantity}" data-id="${product.pro_id}" 
                        data-price="${product.price}">
                    <button class="quantity-btn plus" data-id="${product.pro_id}">+</button>
                </div>
                <button class="order-btn" data-id="${product.pro_id}" 
                    ${product.stock_quantity <= 0 ? 'disabled' : ''}>
                    ${product.stock_quantity <= 0 ? 'Out of Stock' : 'Order Now'}
                </button>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });

    productsContainer.appendChild(productsGrid);
}

// Load Ads from API
async function loadAds() {
    try {
        const response = await fetch('/api/ads');
        const result = await response.json();

        if (result.success) {
            renderAds(result.data);
        } else {
            console.error('Failed to load ads:', result.message);
            renderDefaultAds();
        }
    } catch (error) {
        console.error('Error loading ads:', error);
        renderDefaultAds();
    }
}

// Render Ads
function renderAds(ads) {
    sidebar.innerHTML = '';

    if (!ads || ads.length === 0) {
        renderDefaultAds();
        return;
    }

    ads.forEach(ad => {
        const adDiv = document.createElement('div');
        adDiv.className = 'ad-container';
        adDiv.innerHTML = `
            <img src="/uploads/products/${ad.image}" alt="Advertisement">
            <button class="ad-order-btn" data-ad-id="${ad.ad_id}">Order This Ad Space</button>
        `;
        sidebar.appendChild(adDiv);
    });
}

// Render Default Ads (fallback)
function renderDefaultAds() {
    sidebar.innerHTML = `
        <div class="ad-container">
            <img src="/uploads/products/one.jpg" alt="Advertisement">
        </div>
    `;
}

// Show Error Message
function showError(container, message, reason) {
    container.innerHTML = `
        <div class="error-message">
            <strong>${message}</strong><br>
            ${reason || ''}
        </div>
    `;
}

// Order Dialog Functions
function showOrderDialog(productId, quantity, price) {
    currentOrder = {
        pro_id: productId,
        quantity: quantity,
        price: price,
        cust_id: 1
    };

    // Update dialog content
    document.getElementById('dialogProId').textContent = productId;
    document.getElementById('dialogPrice').textContent = `$${price}`;
    document.getElementById('dialogQuantity').textContent = quantity;
    document.getElementById('dialogTotalPrice').textContent = `$${(price * quantity)}`;

    // Show dialog
    orderDialog.classList.add('active');
    orderDialogOverlay.classList.add('active');
    document.getElementById('orderResponse').style.display = 'none';
}

function hideOrderDialog() {
    orderDialog.classList.remove('active');
    orderDialogOverlay.classList.remove('active');
    receiptImageInput.value = '';
    receiptPreview.style.display = 'none';
}

// Handle Receipt Image Upload
function handleReceiptUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            receiptPreview.src = event.target.result;
            receiptPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        receiptPreview.style.display = 'none';
    }
}

// Submit Order to API
// Update the submitOrder function
async function submitOrder() {
    // Validate receipt image first
    if (!receiptImageInput.files[0]) {
        showResponseMessage('Please upload a payment receipt', true);
        return;
    }

    // Show loading state
    submitSpinner.style.display = 'inline-block';
    submitOrderBtn.disabled = true;
    document.getElementById('orderResponse').style.display = 'none';

    try {
        const formData = new FormData();
        formData.append('pro_id', currentOrder.pro_id);
        formData.append('quantity', currentOrder.quantity);
        formData.append('receipt_image', receiptImageInput.files[0]);

        const response = await fetch('/api/orders/', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log(result)

        if (result.success) {
            showResponseMessage(
                `Order placed successfully!<br>
                Total: $${result.data.total_price}<br>
                <small>You can close this dialog</small>`
            );
            loadProducts(); // Refresh product list to update stock
        } else {
            showResponseMessage(
                `Order failed: ${result.message || 'Unknown error'}<br>
                ${result.reason || ''}`,
                true
            );
        }
    } catch (error) {
        console.error('Order error:', error);
        showResponseMessage(
            'Failed to place order. Please try again.',
            true
        );
    } finally {
        submitSpinner.style.display = 'none';
        submitOrderBtn.disabled = false;
    }
}

// Add this new helper function
function showResponseMessage(message, isError = false) {
    const responseEl = document.getElementById('orderResponse');
    responseEl.innerHTML = message;
    responseEl.className = isError ? 'order-response error' : 'order-response success';
    responseEl.style.display = 'block';

    // Scroll to the response message
    responseEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Handle Quantity Controls
function handleQuantityChange(e) {
    if (e.target.classList.contains('quantity-btn')) {
        const input = e.target.parentElement.querySelector('.quantity-input');
        let value = parseInt(input.value);

        if (e.target.classList.contains('plus')) {
            value = Math.min(value + 1, parseInt(input.max));
        } else if (e.target.classList.contains('minus')) {
            value = Math.max(value - 1, parseInt(input.min));
        }

        input.value = value;
    }
}

// Handle Order Button Clicks
function handleOrderButtonClick(e) {
    if (e.target.classList.contains('order-btn')) {
        const productId = e.target.dataset.id;
        const quantityInput = e.target.parentElement.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput.value);
        const price = parseFloat(quantityInput.dataset.price);

        showOrderDialog(productId, quantity, price);
    }

    if (e.target.classList.contains('ad-order-btn')) {
        const adId = e.target.dataset.adId;
        alert(`Ad space ordering functionality would be implemented here for ad ID: ${adId}`);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Window resize
    window.addEventListener('resize', handleResponsiveAds);

    // Quantity controls
    document.addEventListener('click', handleQuantityChange);

    // Order buttons
    document.addEventListener('click', handleOrderButtonClick);

    // Order dialog
    cancelOrderBtn.addEventListener('click', hideOrderDialog);
    submitOrderBtn.addEventListener('click', submitOrder);
    orderDialogOverlay.addEventListener('click', hideOrderDialog);
    receiptImageInput.addEventListener('change', handleReceiptUpload);
}

// Initial setup
handleResponsiveAds();