import * as CheckoutHandler from './handleCheckOut.js'
import * as checkLogin from './checkLogin.js'

// Function to handle checkout button click
async function handleCheckoutButtonClick() {
    if (await checkLogin.isLoggedIn()) {
        showCheckoutForm();
    } else {
        checkLogin.displayLoginMessage();
    }
}

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    if (await checkLogin.isLoggedIn()) {
        const user_id = await checkLogin.fetchUserInfo();
        const paymentMethod = document.getElementById('payment_method').value;

        // Today's date in YYYY-MM-DD format for SQL
        const today = new Date().toISOString().slice(0, 10);

        // Gather form data
        const orderData = {
            user_id: user_id,
            customerName: document.getElementById('customer_name').value,
            email: document.getElementById('customer_email').value,
            city: document.getElementById('city').value,
            address: document.getElementById('address').value,
            phoneNumber: document.getElementById('phone_number').value,
            postalCode: document.getElementById('postal_code').value,
            shippingMethod: document.getElementById('shipping_method').value,
            paymentMethod: paymentMethod,
            subTotal: parseFloat(document.getElementById('sub_total').value),
            total: parseFloat(document.getElementById('total').value),
            order_date: today
        };

        if (paymentMethod === 'creditCard') {
            // Gather credit card payment data
            
            const  amount= parseFloat(document.getElementById('total').value);
            const cardNumber = document.getElementById('cardNumber').value;
            const cardExpMonth = document.getElementById('cardExpMonth').value;
            const cardExpYear = document.getElementById('cardExpYear').value;
            const cardCvv = document.getElementById('cardCvv').value;
           
            // Initialize transaction
            CheckoutHandler.initializeTransaction({
                ...orderData,
                amount,
                cardNumber,
                cardExpMonth,
                cardExpYear,
                cardCvv
            })
                .then(response => {
                    if (response.success) {
                        // Payment successful, proceed with creating the order
                        CheckoutHandler.createOrder(orderData)
                            .then(order => {
                                console.log('Order created successfully:', order);
                                // Additional code to handle success (e.g., redirecting to a confirmation page or clearing the form)
                            })
                            .catch(error => {
                                console.error('Failed to create order:', error);
                                // Additional code to handle errors (e.g., displaying an error message to the user)
                            });
                    } else {
                        console.error('Payment failed:', response.message);
                        // Additional code to handle payment failure (e.g., displaying an error message to the user)
                    }
                })
                .catch(error => {
                    console.error('Error processing payment:', error);
                    // Additional code to handle payment error (e.g., displaying an error message to the user)
                });
        } else {
            // Payment method other than credit card, proceed with creating the order directly
            CheckoutHandler.createOrder(orderData)
                .then(order => {
                    console.log('Order created successfully:', order);
                    // Additional code to handle success (e.g., redirecting to a confirmation page or clearing the form)
                })
                .catch(error => {
                    console.error('Failed to create order:', error);
                    // Additional code to handle errors (e.g., displaying an error message to the user)
                });
        }
    } else {
        checkLogin.displayLoginMessage(); // Inform the user they need to log in
    }
}

// Function to display the checkout form
async function showCheckoutForm() {
    console.log("Checkout button clicked");
    document.getElementById('checkout-btn').style.display = 'none';
    document.getElementById('checkout-form').classList.remove('hidden');
    await CheckoutHandler.updateSubTotalField(); // Update the Sub Total field when the form is displayed
}


// Get the shipping method dropdown
const shippingMethodDropdown = document.getElementById('shipping_method');

// Add an event listener for the 'change' event
shippingMethodDropdown.addEventListener('change', CheckoutHandler.updateSubTotalField);


// Add event listener for the checkout button
document.getElementById('checkout-btn').addEventListener('click', handleCheckoutButtonClick);

// Add event listener for form submission
document.getElementById('checkout-form').addEventListener('submit', handleFormSubmit);

