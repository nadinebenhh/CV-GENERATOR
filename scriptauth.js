document.addEventListener('DOMContentLoaded', () => {

    // Handle the login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Send the login data to the backend (example using Fetch API)
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to the dashboard or home page after successful login
                window.location.href = '/dashboard.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }

    // Handle the registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            // Send the registration data to the backend (example using Fetch API)
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to the login page after successful registration
                window.location.href = '/login.html';
            } else {
                alert('Error: ' + data.message);
            }
        });
    }

});
