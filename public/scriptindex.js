document.addEventListener('DOMContentLoaded', () => {
    const init = () => {
        const loginForm = document.getElementById('login-form');

        fetch('/check-auth')
            .then(response => response.json())
            .then(data => {
                if (!data.authenticated) {
                    document.getElementById('login-btn').style.display = 'block';
                }
            })

        loginForm.addEventListener('submit', async (event) => {
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
                if (response.redirected) {
                    window.location.href = response.url;
                }
            } else {
                const errorData = await response.json();
                console.error('Error during login:', errorData.error);
            }
        });
    };

    init();
});
