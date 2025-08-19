const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', function () {
    initializeAdmin();
});

function initializeAdmin() {
    // Mobile menu
    document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
        document.getElementById('main-nav').classList.toggle('active');
    });

    // Tab switching
    document.querySelectorAll('.admin-menu a').forEach(link => {
        link.addEventListener('click', tabClicked);
    });

    // Tab switching
    document.querySelectorAll('#main-nav a').forEach(link => {
        link.addEventListener('click', tabClicked);
    });

    function tabClicked(e) {

        e.preventDefault();

        document.querySelectorAll('.admin-menu a').forEach(el => el.classList.remove('active'));
        this.classList.add('active');

        const sectionId = this.getAttribute('href');
        document.querySelectorAll('.dashboard-section, .management-section').forEach(section => {
            section.classList.remove('active');
        });

        if (sectionId === '#home') window.location.assign('/');
        if (sectionId === '#logout') window.location.assign('/logout');
        document.querySelector(sectionId).classList.add('active');

        // Load data when section is shown

        document.querySelector(sectionId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Load initial data
    loadDashboardStats();
    loadAccounts();
    loadAds();
    loadOrders();
    loadProducts(true);

    // Modal handlers
    setupModals();
}

// Dashboard functions
async function loadDashboardStats() {
    try {
        const [products, orders, accounts, ads] = await Promise.all(
            [fetch(`${API_BASE}/products`).then(r => r.json()),
            fetch(`${API_BASE}/orders`).then(r => r.json()),
            fetch(`${API_BASE}/accounts`).then(r => r.json()),
            fetch(`${API_BASE}/ads/all`).then(r => r.json())]);

        document.getElementById('total-products').textContent = products.data?.length || 0;
        document.getElementById('total-orders').textContent = orders.data?.length || 0;
        document.getElementById('total-accounts').textContent = accounts.data?.length || 0;
        document.getElementById('active-ads').textContent = ads.data?.length || 0;
    } catch (error) {
        console.log(error)
        showMessage('dashboard-message', 'Error loading dashboard stats', 'error');
    }
}

// Product CRUD
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const result = await response.json();

        if (result.success) {
            renderProductsTable(result.data);
        } else {
            showMessage('products-message', 'Error loading products', 'error');
        }
    } catch (error) {
        showMessage('products-message', 'Error loading products', 'error');
    }
}

function renderProductsTable(products) {
    const tbody = document.querySelector('#products-table tbody');
    tbody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
    <td>${product.pro_id}</td>
    <td>${product.pro_name}</td>
    <td>${product.pro_code}</td>
    <td>$${product.price}</td>
    <td>${product.stock_quantity}</td>
    <td>${product.pro_type}</td>
    <td class="action-btns">
        <button class="btn btn-sm btn-primary" onclick="editProduct(${product.pro_id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.pro_id})">Delete</button>
    </td>
    `;
        tbody.appendChild(row);
    });
}

async function editProduct(id) {
    try {
        const response = await fetch(`${API_BASE}/products/${id}`);
        const result = await response.json();

        if (result.success) {
            const product = result.data;
            document.getElementById('product-id').value = product.pro_id;
            document.getElementById('pro_name').value = product.pro_name;
            document.getElementById('pro_code').value = product.pro_code;
            document.getElementById('pro_type').value = product.pro_type;
            document.getElementById('price').value = product.price;
            document.getElementById('stock_quantity').value = product.stock_quantity;
            document.getElementById('images').value = product.images || '';

            document.getElementById('product-modal-title').textContent = 'Edit Product';
            document.getElementById('product-modal').style.display = 'flex';
        }
    } catch (error) {
        showMessage('products-message', 'Error loading product', 'error');
    }
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`${API_BASE}/products/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                showMessage('products-message', 'Product deleted successfully', 'success');
                loadProducts();
                loadDashboardStats();
            } else {
                showMessage('products-message', result.message, 'error');
            }
        } catch (error) {
            showMessage('products-message', 'Error deleting product', 'error');
        }
    }
}

// Similar CRUD functions for Accounts, Ads, and Orders...
// Account CRUD
async function loadAccounts() {
    try {
        const response = await fetch(`${API_BASE}/accounts`);
        const result = await response.json();
        console.log(result);

        if (result.success) {
            renderAccountsTable(result.data);
        }
    } catch (error) {
        showMessage('accounts-message', 'Error loading accounts', 'error');
    }
}

function renderAccountsTable(accounts) {
    const tbody = document.querySelector('#accounts-table tbody');
    tbody.innerHTML = '';

    accounts.forEach(account => {
        const row = document.createElement('tr');
        row.innerHTML = `
    <td>${account.account_id}</td>
    <td>${account.username}</td>
    <td>${account.account_type}</td>
    <td class="action-btns">
        <button class="btn btn-sm btn-danger" onclick="deleteAccount(${account.account_id})">Delete</button>
    </td>
    `;
        tbody.appendChild(row);
    });
}



// Ad CRUD
async function loadAds() {
    try {
        const response = await fetch(`${API_BASE}/ads/all`);
        const result = await response.json();

        if (result.success) {
            renderAdsTable(result.data);
        }
    } catch (error) {
        showMessage('ads-message', 'Error loading ads', 'error');
    }
}

function renderAdsTable(ads) {
    const tbody = document.querySelector('#ads-table tbody');
    tbody.innerHTML = '';

    ads.forEach(ad => {
        const row = document.createElement('tr');
        row.innerHTML = `
    <td>${ad.ad_id}</td>
    <td><img src="${ad.image}" alt="Ad" style="width: 50px; height: 50px; object-fit: cover;"></td>
    <td class="action-btns">
        <button class="btn btn-sm btn-danger" onclick="deleteAd(${ad.ad_id})">Delete</button>
    </td>
    `;
        tbody.appendChild(row);
    });
}

// Order CRUD
async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders`);
        const result = await response.json();

        if (result.success) {
            renderOrdersTable(result.data);
        }
    } catch (error) {
        showMessage('orders-message', 'Error loading orders', 'error');
    }
}

function renderOrdersTable(orders) {
    console.log(orders)
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
    <td>${order.order_id}</td>
    <td>${order.pro_name}</td>
    <td>${order.acc_id}</td>
    <td>${order.quantity}</td>
    <td>$${order.total_price}</td>
    <td>${new Date(order.order_date).toLocaleDateString()}</td>
    <td class="action-btns">
        <button class="btn btn-sm btn-danger" onclick="deleteOrder(${order.order_id})">Delete</button>
    </td>
    `;
        tbody.appendChild(row);
    });
}

function setupModals() {
    // Product modal
    document.getElementById('add-product-btn').addEventListener('click', () => {
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        document.getElementById('product-modal-title').textContent = 'Add Product';
        document.getElementById('product-modal').style.display = 'flex';
    });

    document.getElementById('product-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const productData = {
            pro_name: document.getElementById('pro_name').value,
            pro_code: document.getElementById('pro_code').value,
            pro_type: document.getElementById('pro_type').value,
            price: parseFloat(document.getElementById('price').value),
            stock_quantity: parseInt(document.getElementById('stock_quantity').value),
            images: document.getElementById('images').value
        };

        const productId = document.getElementById('product-id').value;
        const url = productId ? `${API_BASE}/products/${productId}` : `${API_BASE}/products`;
        const method = productId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            const result = await response.json();

            if (result.success) {
                document.getElementById('product-modal').style.display = 'none';
                showMessage('products-message', `Product ${productId ? 'updated' : 'created'} successfully`, 'success');
                loadProducts();
                loadDashboardStats();
            } else {
                showMessage('products-message', result.message, 'error');
            }
        } catch (error) {
            showMessage('products-message', 'Error saving product', 'error');
        }
    });

    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Add similar modal handlers for accounts and ads...
}

function showMessage(containerId, message, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="${type}-message">${message}</div>`;
    setTimeout(() => container.innerHTML = '', 3000);
}

// Expose functions to global scope for onclick handlers
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.editAccount = async (id) => { /* Implement similar to editProduct */ };
window.deleteAccount = async (id) => {

    if (confirm('Are you sure you want to delete this Account?')) {
        try {
            const response = await fetch(`${API_BASE}/accounts/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                showMessage('accounts-message', 'Account deleted successfully', 'success');
                loadAccounts();
                loadDashboardStats();
            } else {
                showMessage('accounts-message', result.message, 'error');
            }
        } catch (error) {
            showMessage('accounts-message', 'Error deleting account', 'error');
        }
    }
};
window.deleteAd = async (id) => {

    if (confirm('Are you sure you want to delete this Ad?')) {
        try {
            const response = await fetch(`${API_BASE}/ads/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                showMessage('ads-message', 'Ads deleted successfully', 'success');
                loadAds();
                loadDashboardStats();
            } else {
                showMessage('ads-message', result.message, 'error');
            }
        } catch (error) {
            showMessage('ads-message', 'Error deleting ads', 'error');
        }
    }
};
window.deleteOrder = async (id) => {
    if (confirm('Are you sure you want to delete this Order?')) {
        try {
            const response = await fetch(`${API_BASE}/orders/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                showMessage('orders-message', 'Order is deleted successfully', 'success');
                loadOrders();
                loadDashboardStats();
            } else {
                showMessage('orders-message', result.message, 'error');
            }
        } catch (error) {
            showMessage('orders-message', 'Error deleting the Order', 'error');
        }
    }
};