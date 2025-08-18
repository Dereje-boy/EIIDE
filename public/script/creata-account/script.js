document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('createAccountForm');
    const formMessage = document.getElementById('form-message');

    // Mobile menu toggle (consistent with other pages)
    document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
        document.getElementById('main-nav').classList.toggle('active');
    });

    // Real-time validation
    document.getElementById('username').addEventListener('input', validateUsername);
    document.getElementById('password').addEventListener('input', validatePassword);
    document.getElementById('confirmPassword').addEventListener('input', validateConfirmPassword);
    document.getElementById('accountType').addEventListener('change', validateAccountType);

    // Form submission
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validate all fields
        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isAccountTypeValid = validateAccountType();

        if (isUsernameValid && isPasswordValid && isConfirmPasswordValid && isAccountTypeValid) {
            try {
                const formData = {
                    username: form.username.value,
                    password: form.password.value,
                    account_type: form.accountType.value
                };

                const response = await fetch('/api/accounts/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    showFormMessage('Account created successfully! You can now login.', 'success');
                    form.reset();
                } else {
                    showFormMessage(result.message || 'Account creation failed', 'error');
                    if (result.reason === 'username_exists') {
                        showError('username-error', 'Username already exists');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                showFormMessage('Failed to create account. Please try again.', 'error');
            }
        }
    });

    // Validation functions
    function validateUsername() {
        const username = form.username.value.trim();
        const errorElement = document.getElementById('username-error');

        if (!username) {
            showError(errorElement, 'Username is required');
            return false;
        }

        if (username.length < 4) {
            showError(errorElement, 'Username must be at least 4 characters');
            return false;
        }

        if (username.length > 50) {
            showError(errorElement, 'Username must be less than 50 characters');
            return false;
        }

        hideError(errorElement);
        return true;
    }

    function validatePassword() {
        const password = form.password.value;
        const errorElement = document.getElementById('password-error');

        if (!password) {
            showError(errorElement, 'Password is required');
            return false;
        }

        if (password.length < 6) {
            showError(errorElement, 'Password must be at least 6 characters');
            return false;
        }

        hideError(errorElement);
        return true;
    }

    function validateConfirmPassword() {
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const errorElement = document.getElementById('confirmPassword-error');

        if (!confirmPassword) {
            showError(errorElement, 'Please confirm your password');
            return false;
        }

        if (password !== confirmPassword) {
            showError(errorElement, 'Passwords do not match');
            return false;
        }

        hideError(errorElement);
        return true;
    }

    function validateAccountType() {
        const accountType = form.accountType.value;
        const errorElement = document.getElementById('accountType-error');

        if (!accountType) {
            showError(errorElement, 'Please select an account type');
            return false;
        }

        hideError(errorElement);
        return true;
    }

    // Helper functions
    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        return false;
    }

    function hideError(element) {
        element.textContent = '';
        element.style.display = 'none';
        return true;
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
    }
});