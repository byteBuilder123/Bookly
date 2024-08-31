document.addEventListener('DOMContentLoaded', async function () {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html'; // Redirect non-logged in users
        return;
    }

    // Fetch user info and populate form fields
    const userInfo = await fetchUserInfo();
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    nameInput.value = userInfo.username; // Populate name field with user's name
    emailInput.value = userInfo.email; // Populate email field with user's email

    // Fetch and display user reviews
    await fetchUserReviews();

    // Fetch and display user orders
    await fetchUserOrders();

});

const logoutBtn = document.getElementById('logoutBtn');
 
   logoutBtn.addEventListener('click', async function () {
        console.log('logout button clicked')
         
                // Remove the token from storage only if the server successfully invalidated the token
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                window.location.href = 'index.html';
           
    });

// Function to check login status
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

// Function to display a login message
function displayLoginMessage() {
    document.getElementById('login-message').textContent = "Please log in to proceed with the checkout.";
}

// Fetch user info from the server
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
         return data; // Return the user ID for fetching specific reviews and orders
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}
let currentReviewId = null;

async function fetchUserReviews() {
    const messageDiv = document.getElementById('message');
    try {
        const userInfo = await fetchUserInfo();
        const userId = userInfo.user_id;
        const response = await fetch(`http://127.0.0.1:5001/api/users/reviews`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json' // Add content type header
            },
            body: JSON.stringify({ userId: userId }) // Send user ID in JSON format
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user reviews');
        }
        const data = await response.json();

        // Create reviews table and its header
        const reviewsTable = document.createElement('table');
        reviewsTable.classList.add('reviews-table');

        // Create thead element and add table headers
        const tableHead = document.createElement('thead');
        tableHead.innerHTML = `
            <tr>
                <th class='column-names'>Review Text</th>
                <th class='column-names'>Rating</th>
                <th class='column-names'>Edit</th>
                <th class='column-names'>Delete</th>
            </tr>
        `;
        reviewsTable.appendChild(tableHead);

        // Create tbody element to hold table rows with review data
        const tableBody = document.createElement('tbody');

        // Populate table rows with review data
        data.forEach(review => {
            const tableRow = document.createElement('tr');
            tableRow.classList.add('review');
            tableRow.innerHTML = `
                <td>${review.review_text}</td>
                <td>${review.rating}</td>
                <td><button class="btn btn-primary btn-sm edit-review">Edit</button></td>
                <td><button class="btn btn-danger btn-sm delete-review">Delete</button></td>
            `;

            // Select delete button
            const deleteButton = tableRow.querySelector('.delete-review');

            // Add event listener to edit button
            const editButton = tableRow.querySelector('.edit-review');
            editButton.addEventListener('click', function () {
                // Open the review modal
                $('#reviewModal').modal('show');

                // Populate the form in the modal with the current review's data
                const reviewText = tableRow.querySelector('td:first-child').textContent;
                const reviewRating = tableRow.querySelector('td:nth-child(2)').textContent;
                document.getElementById('reviewText').value = reviewText;
                document.getElementById('reviewRating').value = reviewRating;

                currentReviewId = review.reviewId
            });

            // Delete Event Listener
            deleteButton.addEventListener('click', async function() {
                try {
                    const response = await fetch(`http://127.0.0.1:5001/api/reviews/delete`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify({ reviewId: review.reviewId }) // Send reviewId in the request body
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete review');
                    }
                    tableRow.remove(); // Remove the row from the table upon successful deletion
           
                    // Display success message
                    messageDiv.textContent = 'Review deleted successfully';
                    messageDiv.classList.add('alert-success');
                    messageDiv.style.display = 'block';
                    setTimeout(() => {
                        messageDiv.style.display = 'none';
                        messageDiv.classList.remove('alert-success');
                    }, 2000);

                } catch (error) {
                    // Display error message
                    messageDiv.textContent = 'Error: ' + error.message;
                    messageDiv.classList.add('alert-danger');
                    messageDiv.style.display = 'block';
                    setTimeout(() => {
                        messageDiv.style.display = 'none';
                        messageDiv.classList.remove('alert-danger');
                    }, 2000);
                }
            });

            // Append table row to tbody
            tableBody.appendChild(tableRow);
        });

        // Append tbody to reviews table
        reviewsTable.appendChild(tableBody);

        // Get reviews div and append the table
        const reviewsDiv = document.querySelector('#manage_reviews .card-body');
        reviewsDiv.innerHTML = '';
        reviewsDiv.appendChild(reviewsTable);

    } catch (error) {
        // Display error message
        messageDiv.textContent = 'Error: ' + error.message;
        messageDiv.classList.add('alert-danger');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-danger');
        }, 2000);
    }
}

document.getElementById('submitReviewBtn').addEventListener('click', async function() {
    const reviewTextElement = document.getElementById('reviewText');
    let reviewText = reviewTextElement.value;
    const ratingElement = document.getElementById('reviewRating');
    let rating = ratingElement.value;
    const messageDiv = document.getElementById('message');
    const userInfo = await fetchUserInfo();
    const userId = userInfo.user_id; // Get the user ID

    // Prevent HTML and JavaScript code in review text
    reviewText = reviewText.replace(/<[^>]*>?/gm, '');

    // Check for empty review text
    if (reviewText.trim() === '') {
        messageDiv.textContent = 'Error: Review text cannot be empty';
        messageDiv.classList.add('alert-danger');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-danger');
        }, 2000);
        return;
    }

    // Check for negative ratings
    if (rating < 0) {
        messageDiv.textContent = 'Error: Rating cannot be negative';
        messageDiv.classList.add('alert-danger');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-danger');
        }, 2000);
        return;
    } else if (rating > 5) {
        messageDiv.textContent = 'Error: Rating cannot be greater than 5';
        messageDiv.classList.add('alert-danger');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-danger');
        }, 2000);
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5001/api/reviews/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ userId, reviewText, rating , currentReviewId})
        });
        if (!response.ok) {
            throw new Error('Failed to update review');
        }

        // Display success message
        messageDiv.textContent = 'Review updated successfully';
        messageDiv.classList.add('alert-success');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-success');
            // Clear input fields
            reviewTextElement.value = '';
            ratingElement.value = '';
            $('#reviewModal').modal('hide'); // Close the modal
        }, 2000);

        await fetchUserReviews(); // Refresh the reviews

    } catch (error) {
        // Display error message
        messageDiv.textContent = 'Error: ' + error.message;
        messageDiv.classList.add('alert-danger');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-danger');
        }, 2000);
    }
});

document.querySelector('#edit_profile form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('message');

    // Validate name
    if (/\<|\>|\/|\\|\$|\{|\}/.test(name)) {
        messageDiv.textContent = 'Error: Name cannot contain HTML or JavaScript';
        messageDiv.classList.add('alert-danger');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-danger');
        }, 2000);
        return;
    }

    // Validate email
    if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(email)) {
        messageDiv.textContent = 'Error: Invalid email format';
        messageDiv.classList.add('alert-danger');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-danger');
        }, 2000);
        return;
    }

    const userInfo = await fetchUserInfo();
    const userId = userInfo.user_id; // Get the user ID

    try {
        const response = await fetch('http://127.0.0.1:5001/api/users/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ userId, name, email })
        });
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        // Display success message
        messageDiv.textContent = 'Profile updated successfully';
        messageDiv.classList.add('alert-success');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-success');
        }, 2000);

    } catch (error) {
        // Display error message
        messageDiv.textContent = 'Error: ' + error.message;
        messageDiv.classList.add('alert-danger');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-danger');
        }, 2000);
    }
});

document.querySelector('#change_password_form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const oldPassword = document.getElementById('old_password').value;
    const newPassword = document.getElementById('new_password').value;
    const confirmNewPassword = document.getElementById('confirm_new_password').value;
    const messageDiv = document.getElementById('message');

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
        messageDiv.textContent = 'Error: New password does not meet the requirements';
        messageDiv.classList.add('alert-danger');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-danger');
        }, 2000);
        // Clear input fields
        document.getElementById('old_password').value = '';
        document.getElementById('new_password').value = '';
        document.getElementById('confirm_new_password').value = '';
        return;
    }

    if (newPassword !== confirmNewPassword) {
        messageDiv.textContent = 'Error: New passwords do not match';
        messageDiv.classList.add('alert-danger');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-danger');
        // Clear input fields
        document.getElementById('old_password').value = '';
        document.getElementById('new_password').value = '';
        document.getElementById('confirm_new_password').value = '';
        }, 2000);
        return;
    }

    try {
        const userInfo = await fetchUserInfo();
        const userId = userInfo.user_id;
        const response = await fetch('http://127.0.0.1:5001/api/users/change_password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({userId, oldPassword, newPassword })
        });
        if (!response.ok) {
            throw new Error('Failed to change password');
        }

        // Display success message
        messageDiv.textContent = 'Password changed successfully';
        messageDiv.classList.add('alert-success');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-success');
        // Clear input fields
        document.getElementById('old_password').value = '';
        document.getElementById('new_password').value = '';
        document.getElementById('confirm_new_password').value = '';
        }, 2000);

    } catch (error) {
        // Display error message
        messageDiv.textContent = 'Error: ' + error.message;
        messageDiv.classList.add('alert-danger');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-danger');
        // Clear input fields
        document.getElementById('old_password').value = '';
        document.getElementById('new_password').value = '';
        document.getElementById('confirm_new_password').value = '';

        }, 2000);
    }
});

async function fetchUserOrders() {
    const messageDiv = document.getElementById('message');
    try {
        const userId = await fetchUserInfo(); // Get the user ID
        
        const response = await fetch(`http://127.0.0.1:5001/api/users/orders`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json' // Add content type header
            },
            body: JSON.stringify({ userId: userId }) // Send user ID in JSON format
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user orders');
        }
        const data = await response.json();
        const tableBody = document.querySelector('#view_orders .table tbody');
        tableBody.innerHTML = '';
        data.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class='column-names'>${order.order_id}</td>
                <td class='column-names'>${order.book_name}</td>
                <td class='column-names'>${order.total_quantity}</td>
                <td class='column-names'>${order.total_amount}</td>
                <td class='column-names'>${order.status}</td>
            `;
            tableBody.appendChild(row);
        });

        // Display success message
        messageDiv.textContent = 'Orders fetched successfully';
        messageDiv.classList.add('alert-success');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-success');
        }, 2000);

    } catch (error) {
        // Display error message
        messageDiv.textContent = 'Error: ' + error.message;
        messageDiv.classList.add('alert-danger');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-danger');
        }, 2000);
    }
}
