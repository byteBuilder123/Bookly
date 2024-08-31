import * as checkLogin from './checkLogin.js'

let isLoggedIn = false;

// Check login status immediately when the script runs
checkLogin.isLoggedIn().then(loggedIn => {
    isLoggedIn = loggedIn;
    getCartItems();
});

// Fetch User's Specific Cart items
async function fetchUserCart() {
    const user_id = await checkLogin.fetchUserInfo()
   
    try {
        const response = await fetch('http://127.0.0.1:5001/api/cart/users-cart', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json' // Add content type header
            },
             body: JSON.stringify({ user_id: user_id }) // Send user ID in JSON format
     
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

// Function to get all cart items (books) for a user
async function getCartItems () {
  if(!isLoggedIn){
     const cartItemsContainer = document.getElementById('cart-items-container')
    // Clear previous content
    cartItemsContainer.innerHTML = '' ;
    const itemDiv = document.createElement('div')
    itemDiv.classList.add('cart-item')
    itemDiv.innerHTML = `
        <p>Please Login First</p>`
    cartItemsContainer.appendChild(itemDiv)
    
    document.getElementById('checkout-btn').disabled = true;
    document.getElementById('clear-cart-btn').disabled = true;
    return
  }
  try {
    const cartItems = await fetchUserCart();
    document.getElementById('checkout-btn').disabled = false;
    document.getElementById('clear-cart-btn').disabled = false;
    // Call the displayCartItems function to display the cart items in the modal
    displayCartItems(cartItems);
  } catch (error) {
    pass
  }
}

// Function to display cart items on the frontend
function displayCartItems (cartItems) {
  const cartItemsContainer = document.getElementById('cart-items-container')
  // Clear previous content
  cartItemsContainer.innerHTML = ''

  // Check if cart is empty
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>'
    return
  }

  // Loop through the cart items and create HTML elements for each item
  cartItems.forEach(item => {
    const itemDiv = document.createElement('div')
    itemDiv.classList.add('cart-item')
    itemDiv.innerHTML = `
        <p>Book ID: ${item.book_id}</p>
        <p>Title: ${item.title}</p>
        <p>Quantity: ${item.quantity}</p>
        <button class="btn btn-danger remove-button" data-book-id="${item.book_id}">Remove</button>
    `
    cartItemsContainer.appendChild(itemDiv)
  })

  // Add event listeners to the remove buttons
  addRemoveButtonListeners()
}

// Function to add event listeners to the remove buttons
function addRemoveButtonListeners () {
  const removeButtons = document.querySelectorAll('.remove-button')
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const book_id = button.getAttribute('data-book-id')
      removeFromCart(book_id)
    })
  })
}

async function removeFromCart(book_id){
   const user_id = await checkLogin.fetchUserInfo();
  fetch('http://localhost:5001/api/cart//remove-from-cart', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({book_id: book_id,user_id:user_id})
  })
    .then(response => {
      if (response.ok) {
        console.log('Cart removed successfully.')
        // Optionally, update the cart display after successful clearing
        getCartItems() // Call getCartItems to update cart display
      } else {
        console.error('Failed to remove cart.')
      }
    })
    .catch(error => {
      console.error('Error:', error)
    })
}


// Function to clear all books from the cart for a user
async function clearCart () {
  const userId = await checkLogin.fetchUserInfo();
  fetch('http://localhost:5001/api/cart/clear-cart', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({user_id: userId})
  })
    .then(response => {
      if (response.ok) {
        console.log('Cart cleared successfully.')
        // Optionally, update the cart display after successful clearing
        getCartItems() // Call getCartItems to update cart display
      } else {
        console.error('Failed to clear cart.')
      }
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

// Add event listener to the Clear Cart button
const clearCartBtn = document.getElementById('clear-cart-btn')
clearCartBtn.addEventListener('click', () => {
  // Call the clearCart function to clear the cart
  clearCart()
})


async function fetchUserInfoFromServer() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:5001/api/users/info', {
            method: 'GET',
             headers: {
                'Authorization': `Bearer ${token}` // Assuming you have a valid token
            }
        });
        const data = await response.json();
        return data; // Return user information
    } catch (error) {
        console.error('Error fetching user info from server:', error);
        throw error;
    }
}

// Function to add a book to the cart
async function addToCart(book_id, quantity) {
    const userInfo = await fetchUserInfoFromServer();

    const { username, user_id } = userInfo;

    const itemData = {
        user_id: user_id,
        bookId: book_id,
        quantity: quantity,
    };
    fetch('http://localhost:5001/api/cart/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    })
        .then(response => {
            if (response.ok) {
                console.log('Book added to cart successfully.');
                // Optionally, update the cart display after successful addition
                getCartItems(); // Commented out because this function is already called after adding to cart
            } else {
                console.error('Failed to add book to cart.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export {addToCart,fetchUserInfoFromServer, getCartItems, displayCartItems, addRemoveButtonListeners, removeFromCart, clearCart };
