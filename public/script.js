document.addEventListener('DOMContentLoaded', () => {
    const init = () => {
        const logoutBtn = document.getElementById('logout-btn');
        const userInfo = document.getElementById('user-info');

        // Check if the user is authenticated on page load
        fetch('/check-auth')
            .then(response => response.json())
            .then(data => {
                if (data.authenticated) {
                    // If authenticated, display user info and replace login button with logout button
                    userInfo.textContent = `Welcome, ${data.username}`;
                    logoutBtn.style.display = 'block';
                } else {
                    // If not authenticated, display login button
                    document.getElementById('login-btn').style.display = 'block';
                }
            })
            .catch(error => console.error('Error checking authentication:', error));
    };

    // Event listener for login form
    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
        });

        if (response.ok) {
            // Check if the response is a redirect
            if (response.redirected) {
                window.location.href = response.url; // Redirect to the location specified in the response
            } else {
                // Handle other successful responses
                console.log('Login successful!');
                init(); // Re-run the initialization after a successful login
            }
        } else {
            const errorData = await response.json();
            console.error('Error during login:', errorData.error);
        }
    });

    // Event listener for logout button
    document.getElementById('logout-btn').addEventListener('click', async () => {
        const response = await fetch('/logout', { method: 'POST' }); // Corrected path

        if (response.ok) {
            // Redirect to the login page after successful logout
            window.location.href = 'index.html';
        } else {
            console.error('Error during logout:', response.statusText);
        }
    });

    // Call the init function once the DOM is fully loaded
    init();
});