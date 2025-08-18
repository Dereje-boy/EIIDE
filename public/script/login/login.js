document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const formMessage = document.getElementById('form-message');

    // Mobile menu toggle (reused from main script.js)
    document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
        document.getElementById('main-nav').classList.toggle('active');
    });

    // Form submission
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = loginForm.username.value.trim();
        const password = loginForm.password.value;

        // Reset errors
        document.querySelectorAll('.validation-error').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });

        // Validate inputs
        let isValid = true;

        if (!username) {
            showError('login-username-error', 'Username is required');
            isValid = false;
        }

        if (!password) {
            showError('login-password-error', 'Password is required');
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                });

                const result = await response.json();

                if (result.success) {
                    // Successful login - redirect or update UI
                    showFormMessage('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1500);
                } else {
                    showFormMessage(result.message || 'Login failed', 'error');
                    if (result.reason === 'invalid_credentials') {
                        showError('login-password-error', 'Invalid username or password');
                    }
                }
            } catch (error) {
                console.error('Login error:', error);
                showFormMessage('Failed to login. Please try again.', 'error');
            }
        }
    });

    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.style.display = 'block';
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 3000);
    }
});