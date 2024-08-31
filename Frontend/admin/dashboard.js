document.addEventListener('DOMContentLoaded', async function () {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../index.html';  // Redirect non-logged in users
        return;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
       logoutBtn.addEventListener('click', async function () {
        console.log('logout button clicked')
         
                // Remove the token from storage only if the server successfully invalidated the token
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                window.location.href = '../index.html';
           
    });
    }

    try {
        const isAdmin = await fetchUserInfo();  // Store the result of fetchUserInfo
        await manageUsers();
        await manageBooks();
        await manageCategories();
        await displayOrders();
        await fetchCategories();
        if (!isAdmin) {  // Use the stored result here
            window.location.href = '../index.html';  // Redirect non-admin users
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        // Handle error appropriately
    }
});

// Handling form submission to update books
document.getElementById('editBookForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const bookId = document.getElementById('editBookId').value;
    const isFeatured = document.getElementById('editIsFeatured').value;
    const availability = document.getElementById('editAvailability').value;
    let price = document.getElementById('editPrice').value;

    // Validate the price
    if (price < 0) {
        const messageDiv = document.getElementById('message');
        messageDiv.style.display = 'block';
        messageDiv.className = 'alert alert-danger';
        messageDiv.textContent = 'You cannot enter a negative price.';
        return;
    }

    const bookData = {
        book_id: bookId,
        is_featured: isFeatured,
        availability_status: availability,
        price: price
    };
    try {
        const response = await fetch('http://127.0.0.1:5001/api/books/updatebook', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            throw new Error('Failed to update book');
        }
        const updatedData = await response.json();
       
        // Show success message
        const messageDiv = document.getElementById('message');
        messageDiv.style.display = 'block';
        messageDiv.className = 'alert alert-success';
        messageDiv.textContent = 'Book details updated successfully';

        // Hide the message after 5 seconds
        setTimeout(function() {
            messageDiv.style.display = 'none';
            // Close the modal after successful update
        $('#editBookModal').modal('hide');
        }, 2000);
        manageBooks();
        
    } catch (error) {
        console.error('Error:', error);

        // Show error message
        const messageDiv = document.getElementById('message');
        messageDiv.style.display = 'block';
        messageDiv.className = 'alert alert-danger';
        messageDiv.textContent = 'An error occurred: ' + error.message;
    }
});


// Fetch all categories from the server
async function fetchCategories() {
    try {
        const response = await fetch('http://127.0.0.1:5001/api/books/fetchCategories', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) {
            return false;
        }
        const categories = await response.json();
        let genreSelect = document.getElementById('genre');
        categories.forEach(function (category) {
            let option = document.createElement('option');
            option.text = category.category_name;
            option.value = category.category_id;
            genreSelect.add(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return false;
    }
}

// Handling form submission to update categories
document.getElementById('editCategoryForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const categoryId = document.getElementById('editCategoryId').value;
    const categoryName = document.getElementById('editCategoryName').value;

    const categoryData = {
        category_id: categoryId,
        category_name: categoryName
    };

    try {
        const response = await fetch('http://127.0.0.1:5001/api/books/updatecategory', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(categoryData),
        });

        if (!response.ok) {
            throw new Error('Failed to update category');
        }
        const updatedData = await response.json();

        // Show success message
        const messageDiv = document.getElementById('message');
        messageDiv.style.display = 'block';
        messageDiv.className = 'alert alert-success';
        messageDiv.textContent = 'Category updated successfully';

        
        const categoryList = document.querySelector('.category-list');
        const editedRow = categoryList.querySelector(`tr[data-category-id="${categoryId}"]`);
        if (editedRow) {
            editedRow.querySelector('td:first-child').textContent = categoryName;
        }
         // Hide the message after 5 seconds
        setTimeout(function() {
            messageDiv.style.display = 'none';
            // Close the modal after successful update
        $('#editCategoryModal').modal('hide');        
    }, 2000);
 manageCategories();
    } catch (error) {
        console.error('Error:', error);

        // Show error message
        const messageDiv = document.getElementById('message');
        messageDiv.style.display = 'block';
        messageDiv.className = 'alert alert-danger';
        messageDiv.textContent = 'An error occurred: ' + error.message;
    }
});

// Function to manage categories
async function manageCategories() {
    try {
        const response = await fetch('http://127.0.0.1:5001/api/books/fetchCategories', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        const categoryList = document.querySelector('.category-list');
        categoryList.innerHTML = '';
        const table = document.createElement('table');
        table.classList.add('table');

        data.forEach(category => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = category.category_name;
            row.dataset.categoryId = category.category_id;  // Add this line

            row.appendChild(cell);

            const editCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('btn', 'btn-primary', 'btn-sm', 'edit-category');
            editCell.appendChild(editButton);
            row.appendChild(editCell);

            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'delete-category');
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            table.appendChild(row);
        });

        categoryList.appendChild(table);

        // Add event listener for edit buttons
        // Add event listener for edit buttons
        categoryList.querySelectorAll('.edit-category').forEach(editButton => {
            editButton.addEventListener('click', function () {
                const row = this.closest('tr');
                const categoryId = row.dataset.categoryId;  // Use dataset to get category ID

                // Populate the form in the modal with the current category's data
                document.getElementById('editCategoryId').value = categoryId;
                document.getElementById('editCategoryName').value = row.querySelector('td:first-child').textContent;

                // Open the modal
                $('#editCategoryModal').modal('show');
            });
        });

        // Add event listener for delete buttons
        categoryList.querySelectorAll('.delete-category').forEach(deleteButton => {
            deleteButton.addEventListener('click', async function () {
                const row = this.closest('tr');
                const categoryId =   row.dataset.categoryId
                try {
                    const response = await fetch('http://127.0.0.1:5001/api/books/deletecategories', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify({ category_id: categoryId })
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete category');
                    }
                    row.remove();
                    console.log('Category deleted successfully');
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        });

        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to manage books
async function manageBooks() {
    try {
        const response = await fetch('http://127.0.0.1:5001/api/books/managebooks', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        const bookList = document.querySelector('.book-list');
        bookList.innerHTML = '';
        const table = document.createElement('table');
        table.classList.add('table');

        data.forEach(book => {
            const row = document.createElement('tr');
            ['title', 'author'].forEach(key => {
                const cell = document.createElement('td');
                cell.textContent = book[key];
                row.appendChild(cell);
            });


            const editCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('btn', 'btn-primary', 'btn-sm', 'edit-book');
            editButton.addEventListener('click', function () {
                // Open the modal
                $('#editBookModal').modal('show');

                // Populate the form in the modal with the current book's data
                document.getElementById('editBookId').value = book.book_id;
                document.getElementById('editIsFeatured').value = book.is_featured;
                document.getElementById('editAvailability').value = book.availability_status;
                document.getElementById('editPrice').value = book.price;
            });
            editCell.appendChild(editButton);
            row.appendChild(editCell);

            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'delete-book');
            deleteButton.addEventListener('click', async function () {
                try {
                    const response = await fetch(`http://127.0.0.1:5001/api/books/deletebooks`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify({ book_id: book.book_id })
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete bFook');
                    }
                    row.remove();
                    console.log('Book deleted successfully');
                } catch (error) {
                    console.error('Error:', error);
                }
            });


            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            table.appendChild(row);
        });

        bookList.appendChild(table);
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}


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
// Fetch all orders from the server
async function fetchOrders() {
    const response = await fetch('http:127.0.0.1:5001/api/orders/fetchOrder');
    const orders = await response.json();
    return orders;
}


// Handling form submission to add books
document.getElementById('add_books').addEventListener('submit', async function (event) {
    event.preventDefault();
    const imageInput = document.getElementById('image');
    const imagePath = imageInput.value; // Get the full path of the selected image
    const filename = imagePath.replace(/^.*[\\\/]/, ''); // Remove path except "img/"

    const bookData = {
        book_id: document.getElementById('book_id').value,
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        genre: document.getElementById('genre').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        published_date: document.getElementById('published_date').value,
        availability_status: document.getElementById('availability_status').value,
        image_url: 'img/' + filename, // Keep "img/" and add the extracted filename
        is_featured: document.getElementById('is_featured').value
    };

    const messageDiv = document.getElementById('message');

    try {
        // Validate book_id and price
        if (bookData.book_id < 0 || bookData.price < 0) {
            throw new Error('Book ID and price cannot be negative.');
        }

        // Validate title, author, and description
        if (/\<|\>|script/.test(bookData.title) || /\<|\>|script/.test(bookData.author) || /\<|\>|script/.test(bookData.description)) {
            throw new Error('HTML and JavaScript are not allowed in Title, Author, and Description.');
        }

        const response = await fetch('http://127.0.0.1:5001/api/books/addbooks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')  // Ensure this is necessary
            },
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            throw new Error('Failed to add book');
        }
        const data = await response.json();

        // Display success message
        messageDiv.textContent = 'Success: Book Added Successfully';
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


// Handling form submission to add categories
document.getElementById('add_category').addEventListener('submit', async function (event) {
    event.preventDefault();
    const categoryData = {
        category_name: document.getElementById('category_name').value
    };

    const messageDiv = document.getElementById('message');

    try {
        // Validate category name
        if (!/^[a-zA-Z\s]+$/.test(categoryData.category_name)) {
            throw new Error('Invalid category name. Only letters and spaces are allowed.');
        }

        const response = await fetch('http://127.0.0.1:5001/api/books/addcategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(categoryData),
        });

        if (!response.ok) {
            throw new Error('Failed to add category');
        }
        const data = await response.json();

        // Display success message
        messageDiv.textContent = 'Category Added Successfully';
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
        displayUserInfo(data);  // You might want to implement this to update the UI with user info
        return data.isAdmin;  // Include isAdmin field in the response
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

// Example function to update the user interface with user information
function displayUserInfo(userData) {
    const userInfoDiv = document.getElementById('user-info');
    if (userInfoDiv) {
        userInfoDiv.textContent = `Welcome, ${userData.username}`;
    }
}

// Fetch all orders from the server
async function fetchOrders() {
    const response = await fetch('http://127.0.0.1:5001/api/orders/fetchOrder');
    const orders = await response.json();
    return orders;
}

// Ensure the displayOrders function handles undefined values gracefully
async function displayOrders() {
    const orders = await fetchOrders();
    const tableBody = document.querySelector('#view_orders .table tbody');

    // Clear the table body
    tableBody.innerHTML = '';

    // Add a new row for each order
    orders.forEach(order => {
        const row = document.createElement('tr');

        // Order ID
        const idCell = document.createElement('td');
        idCell.textContent = order.order_id;
        row.appendChild(idCell);

        // User
        const userCell = document.createElement('td');
        userCell.textContent = order.customer_name;
        row.appendChild(userCell);

        // Total Amount
        const amountCell = document.createElement('td');
        const totalPrice = parseFloat(order.total);
        amountCell.textContent = !isNaN(totalPrice) ? `$${totalPrice.toFixed(2)}` : 'N/A';
        row.appendChild(amountCell);

        // Status dropdown
        const actionCell = document.createElement('td');
        const statusDropdown = document.createElement('select');
        statusDropdown.classList.add('form-control');
        statusDropdown.id = `order_status_${order.order_id}`;

        const optionCompleted = document.createElement('option');
        optionCompleted.value = 'completed';
        optionCompleted.textContent = 'Completed';

        const optionActive = document.createElement('option');
        optionActive.value = 'active';
        optionActive.textContent = 'Active';

        const optionDelete = document.createElement('option');
        optionDelete.value = 'delete';
        optionDelete.textContent = 'Delete';

        statusDropdown.appendChild(optionActive);
        statusDropdown.appendChild(optionDelete);
        statusDropdown.appendChild(optionCompleted);

        statusDropdown.addEventListener('change', function () {
            if (statusDropdown.value === 'delete') {
                deleteOrderStatus(order.order_id);
            } else {
                updateOrderStatus(order.order_id, statusDropdown.value);
            }
        });


        actionCell.appendChild(statusDropdown);
        row.appendChild(actionCell);

        // Add the row to the table
        tableBody.appendChild(row);


    });
}

async function deleteOrderStatus(orderId) {
    const messageDiv = document.getElementById('message');
    try {
        const response = await fetch(`http://127.0.0.1:5001/api/orders/deleteOrder`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId })
        });
        if (!response.ok) {
            throw new Error('Failed to delete order');
        }
        const data = await response.json();

        // Display success message
        messageDiv.textContent = 'Success: Order Deleted Successfully';
        messageDiv.classList.add('alert-success');
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-success');
        }, 2000);

        displayOrders();  // Refresh the orders table
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

async function updateOrderStatus(orderId, status) {
    const messageDiv = document.getElementById('message');
    try {
        const response = await fetch(`http://127.0.0.1:5001/api/orders/updateOrderStatus`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status })
        });
        if (!response.ok) {
            throw new Error('Failed to update order status');
        }
        const data = await response.json();

        // Display success message
        messageDiv.textContent = 'Success: Order Updated Successfully';
        messageDiv.classList.add('alert-success');
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.classList.remove('alert-success');
        }, 2000);

        displayOrders();  // Refresh the orders table
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

// Function to manage users
async function manageUsers() {
    const messageDiv = document.getElementById('message');
    try {
        const response = await fetch('http://127.0.0.1:5001/api/users/manageusers', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        const userList = document.querySelector('.user-list');
        userList.innerHTML = '';
        const table = document.createElement('table');
        table.classList.add('table');
        data.forEach(user => {
            const row = document.createElement('tr');
            ['username', 'email', 'Phone_number'].forEach(key => {
                const cell = document.createElement('td');
                cell.textContent = user[key];
                row.appendChild(cell);
            });

            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'delete-user');
            deleteButton.addEventListener('click', async function () {
                try {
                    const response = await fetch(`http://127.0.0.1:5001/api/users/deleteusers`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify({ username: user.username })
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete user');
                    }
                    row.remove();

                    // Display success message
                    messageDiv.textContent = 'User deleted successfully';
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

            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            table.appendChild(row);
        });

        userList.appendChild(table);

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
