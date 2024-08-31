import * as Cart from './cart.js'
// Function to add cart item to orderitem table
async function addCartItemToOrderItem(orderId, item) {
    try {
        
        const response = await fetch('http://127.0.0.1:5001/api/order_items/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_id: orderId,
                book_id: item.book_id,
                quantity: item.quantity,
                subtotal: item.price * item.quantity
            })
        });
        if (!response.ok) {
            throw new Error('Failed to add item to order items.');
        }
        console.log(`Item ${item.book_id} added to order items.`);
    } catch (error) {
        console.error('Error adding item to order items:', error);
    }
}

// Function to clear the user's cart after order placement
async function clearUserCart(userId) {
    try {
        const response = await fetch('http://localhost:5001/api/cart/clear-cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({user_id: userId})
        });
        if (!response.ok) {
            throw new Error('Failed to clear cart.');
        }
        console.log('Cart cleared successfully.');
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
}


// Function to display success message
function displaySuccessMessage(message) {
    const successMessageElement = document.getElementById('success-message');
    successMessageElement.textContent = message;
    successMessageElement.classList.remove('hidden');
}

// Function to display error message
function displayErrorMessage(message) {
    const errorMessageElement = document.getElementById('error-message');
    if (!errorMessageElement) {
        console.error('Error message element not found in the HTML.');
        return;
    }
    errorMessageElement.textContent = message;
    errorMessageElement.classList.remove('hidden');
}

// Function to create an order and handle cart items
async function createOrder(orderData) {
    try {
        console.log("Sending order data to server...");
        const response = await fetch('http://127.0.0.1:5001/api/orders/create_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const responseData = await response.json();
        console.log("Order placed successfully:", responseData);
        displaySuccessMessage('Order placed successfully! Order ID: ' + responseData.orderId);

        // Now, handle cart items
        await handleCartItems(responseData.order_id, orderData.user_id);

    } catch (error) {
        console.error('Failed to place the order:', error);
        displayErrorMessage('Failed to place the order, please try again.');
    }
}

// Function to initialize transaction (assuming this is provided by your backend)
async function initializeTransaction(transactionData) {
    try {
        const response = await fetch('http://127.0.0.1:5001/api/v2/initializeTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
        });

        const responseData = await response.json(); // Parse the response as JSON

        if (response.ok && responseData.success) {
            return responseData; // Return the successful response data
        } else {
            console.error('Payment failed:', responseData.message);
            throw new Error('Payment failed'); // Throw an error for handling
        }
    } catch (error) {
        console.error('Error initializing transaction:', error);
        throw error; // Throw the error for handling in the calling function
    }
}

function calculateTotalPrice(cartItems) {
    let totalPrice = 0;

    cartItems.forEach(item => {
        const quantity = item.quantity;
        const price = parseFloat(item.price); // Convert price to a floating-point number

        // Add the total price of this item (quantity * price) to the overall total
        totalPrice += quantity * price;
    });

    // Return the total price rounded to two decimal places
    return totalPrice.toFixed(2);
}


async function getTotalCartPrice() {
    try {
        const cartItems = await Cart.fetchUserCart();
        const totalPrice = calculateTotalPrice(cartItems);
        return totalPrice;
    } catch (error) {
        console.error('Error fetching user cart items:', error);
        throw error;
    }
}

// Function to update the Sub Total input field in the checkout form
async function updateSubTotalField() {
    const subTotal = await getTotalCartPrice();
    const shipping_value = document.getElementById('shipping_method').value;
    // Convert subTotal and shipping_value to numbers before adding
    const total = parseFloat(subTotal) + parseFloat(shipping_value);
    // Update the Sub Total input field with the calculated subtotal
    document.getElementById('sub_total').value = subTotal;
    document.getElementById('total').value = total;
}

// Function to handle cart items after order is placed
async function handleCartItems(orderId, userId) {
    try {
        const cartItems = await CheckOut.fetchUserCart(userId);
        for (const item of cartItems) {
            await addCartItemToOrderItem(orderId, item);
        }
        await clearUserCart(userId);
        console.log('Cart items successfully moved to order items and cart cleared.');
    } catch (error) {
        console.error('Error handling cart items:', error);
    }
}


export {updateSubTotalField, createOrder, initializeTransaction}