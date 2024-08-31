// Function to check if the user is logged in
async function isLoggedIn() {
    try {
        const response = await fetch('http://127.0.0.1:5001/api/auth/status', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.isLoggedIn;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}

// Function to return user id
async function fetchUserInfo() {
    try {
        const response = await fetch('http://127.0.0.1:5001/api/users/info', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }
        const data = await response.json();
         return data.user_id; // Return the user ID for fetching specific reviews and orders
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

// Function to display a message prompting the user to log in
function displayLoginMessage() {
    const loginMessage = "Please log in to proceed with the checkout.";
    document.getElementById('login-message').textContent = loginMessage;
}

export {isLoggedIn, fetchUserInfo, displayLoginMessage}