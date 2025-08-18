// DOM Elements
const showCreateFormBtn = document.getElementById('showCreateFormBtn');
const createAccountForm = document.getElementById('createAccountForm');
const cancelCreateBtn = document.getElementById('cancelCreateBtn');
const accountForm = document.getElementById('accountForm');
const accountTableBody = document.getElementById('accountTableBody');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');
const accountDetailModal = document.getElementById('accountDetailModal');
const updateTypeModal = document.getElementById('updateTypeModal');
const updateTypeForm = document.getElementById('updateTypeForm');
const closeModalButtons = document.querySelectorAll('.close-modal');

// API Base URL
const API_BASE_URL = '/api/accounts';

// Event Listeners
document.addEventListener('DOMContentLoaded', loadAccounts);
showCreateFormBtn.addEventListener('click', () => createAccountForm.style.display = 'block');
cancelCreateBtn.addEventListener('click', () => {
    accountForm.reset();
    createAccountForm.style.display = 'none';
});
accountForm.addEventListener('submit', handleAccountCreate);
refreshBtn.addEventListener('click', loadAccounts);
searchInput.addEventListener('input', filterAccounts);
closeModalButtons.forEach(btn => btn.addEventListener('click', closeAllModals));

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === accountDetailModal) accountDetailModal.style.display = 'none';
    if (e.target === updateTypeModal) updateTypeModal.style.display = 'none';
});

// Load all accounts
async function loadAccounts() {
    try {
        const response = await fetch(API_BASE_URL);
        const result = await response.json();

        if (result.success) {
            renderAccounts(result.data);
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Failed to load accounts. Please try again.');
        console.error('Error loading accounts:', error);
    }
}

// Render accounts to the table
function renderAccounts(accounts) {
    accountTableBody.innerHTML = '';

    if (accounts.length === 0) {
        accountTableBody.innerHTML = '<tr><td colspan="4" class="text-center">No accounts found</td></tr>';
        return;
    }

    accounts.forEach(account => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${account.account_id}</td>
            <td>${account.username}</td>
            <td><span class="type-badge type-${account.account_type}">${account.account_type}</span></td>
            <td class="actions">
                <button class="btn-primary" onclick="viewAccountDetails(${account.account_id})">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn-success" onclick="showUpdateTypeModal(${account.account_id}, '${account.account_type}')">
                    <i class="fas fa-edit"></i> Change Type
                </button>
                <button class="btn-danger" onclick="confirmDeleteAccount(${account.account_id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        accountTableBody.appendChild(row);
    });
}

// Handle account creation
async function handleAccountCreate(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const account_type = document.getElementById('account_type').value;

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, account_type })
        });

        const result = await response.json();

        if (result.success) {
            showAlert('success', result.message);
            accountForm.reset();
            createAccountForm.style.display = 'none';
            loadAccounts();
        } else {
            showAlert('error', result.reason || result.message);
        }
    } catch (error) {
        showAlert('error', 'Failed to create account. Please try again.');
        console.error('Error creating account:', error);
    }
}

// View account details
async function viewAccountDetails(accountId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${accountId}`);
        const result = await response.json();

        if (result.success) {
            const account = result.data;
            const detailContent = document.getElementById('accountDetailContent');

            detailContent.innerHTML = `
                <div class="detail-group">
                    <label>Account ID:</label>
                    <p>${account.account_id}</p>
                </div>
                <div class="detail-group">
                    <label>Username:</label>
                    <p>${account.username}</p>
                </div>
                <div class="detail-group">
                    <label>Account Type:</label>
                    <p><span class="type-badge type-${account.account_type}">${account.account_type}</span></p>
                </div>
            `;

            document.getElementById('modalTitle').textContent = `Account: ${account.username}`;
            accountDetailModal.style.display = 'block';
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Failed to load account details.');
        console.error('Error loading account details:', error);
    }
}

// Show update account type modal
function showUpdateTypeModal(accountId, currentType) {
    document.getElementById('updateAccountId').value = accountId;
    document.getElementById('new_account_type').value = currentType;
    updateTypeModal.style.display = 'block';
}

// Handle account type update
updateTypeForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const accountId = document.getElementById('updateAccountId').value;
    const newType = document.getElementById('new_account_type').value;

    try {
        const response = await fetch(`${API_BASE_URL}/${accountId}/type`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ account_type: newType })
        });

        const result = await response.json();

        if (result.success) {
            showAlert('success', result.message);
            updateTypeModal.style.display = 'none';
            loadAccounts();
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Failed to update account type.');
        console.error('Error updating account type:', error);
    }
});

// Confirm account deletion
function confirmDeleteAccount(accountId) {
    if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
        deleteAccount(accountId);
    }
}

// Delete account
async function deleteAccount(accountId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${accountId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showAlert('success', result.message);
            loadAccounts();
        } else {
            showAlert('error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Failed to delete account.');
        console.error('Error deleting account:', error);
    }
}

// Filter accounts based on search input
function filterAccounts() {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = accountTableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const username = row.cells[1].textContent.toLowerCase();
        const accountType = row.cells[2].textContent.toLowerCase();

        if (username.includes(searchTerm) || accountType.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Close all modals
function closeAllModals() {
    accountDetailModal.style.display = 'none';
    updateTypeModal.style.display = 'none';
}

// Show alert message
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Global functions for button click handlers
window.viewAccountDetails = viewAccountDetails;
window.showUpdateTypeModal = showUpdateTypeModal;
window.confirmDeleteAccount = confirmDeleteAccount;