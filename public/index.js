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


// Mobile Menu Toggle
function toggleMobileMenu() {
    mainNav.classList.toggle('active');
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
