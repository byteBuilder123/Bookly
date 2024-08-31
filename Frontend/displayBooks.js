import * as Review from './reviews.js'
import * as Cart from './cart.js';
import * as checkLogin from './checkLogin.js'

let isLoggedIn = false;

// Check login status immediately when the script runs
checkLogin.isLoggedIn().then(loggedIn => {
    isLoggedIn = loggedIn;
});


// Function to display books by genre on the page
async function displayBooks(books) {
 
    const booksByGenreContainer = document.getElementById('booksByGenreContainer');
    booksByGenreContainer.innerHTML = ''; // Clear previous content

    if (books.length === 0) {
        booksByGenreContainer.innerHTML = 'No books found for this category.';
    } else {
        books.forEach(book => {
            const colDiv = document.createElement('div');
            colDiv.classList.add('col-md-4', 'mb-4');
            colDiv.innerHTML = `
                <div class="card border-0 shadow book-card">
                    <img src="${book.image_url || 'placeholder.jpg'}" class="card-img-top" alt="Book Image">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">Author: ${book.author}</p>
                        <p class="card-text">Price: $${book.price}</p>
                         <p class="card-error-message" id="card-error-message"></p>
                       <button class="btn btn-primary btn-sm add-to-cart-button" data-book-id="${book.book_id}">Add to Cart</button>
                        <button class="btn btn-danger remove-button" style="display: none;" data-book-id="${book.book_id}">Remove</button>
                        <button class="btn btn-success review-button" data-book-id-review="${book.book_id}">Review</button>
                        <button class="btn btn-info view-reviews-button" data-book-id="${book.book_id}">View Reviews</button>
                    </div>
                </div>
            `;
            booksByGenreContainer.appendChild(colDiv);
        });

        // Add event listeners to all "View Reviews" buttons
        addViewReviewButtonListeners();
       
            // If the user is logged in, add event listeners to the "Add to Cart" buttons
            addAddToCartButtonListeners();
            addReviewButtonListeners();      
    }
}

// Function to display featured books on the page
async function displayFeaturedBooks(featuredBooks) {
    const featuredBooksRow = document.getElementById('featured-books-row');
    featuredBooksRow.innerHTML = ''; // Clear previous content

    if (featuredBooks.length === 0) {
        featuredBooksRow.innerHTML = 'No books found for this category.';
    } else {
        featuredBooks.forEach(book => {
            const colDiv = document.createElement('div');
            colDiv.classList.add('col-md-4', 'mb-4');
            colDiv.innerHTML = `
                 <div class="card border-0 shadow book-card">
                    <img src="${book.image_url || 'placeholder.jpg'}" class="card-img-top" alt="Book Image">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">Author: ${book.author}</p>
                        <p class="card-text">Price: $${book.price}</p>
                        <p class="card-error-message" id="card-error-message"></p>
                        <button class="btn btn-primary btn-sm add-to-cart-button" data-book-id="${book.book_id}">Add to Cart</button>
                        <button class="btn btn-danger remove-button" style="display: none;" data-book-id="${book.book_id}">Remove</button>
                        <button class="btn btn-success review-button" data-book-id-review="${book.book_id}">Review</button>
                        <button class="btn btn-info view-reviews-button" data-book-id="${book.book_id}">View Reviews</button>
                    </div>
                </div>
            `;

            featuredBooksRow.appendChild(colDiv);
        });

        // Add event listeners to all "View Reviews" buttons
        addViewReviewButtonListeners();
            addAddToCartButtonListeners();
            addReviewButtonListeners();

      
    }
}

// Function to add event listeners to the "Add to Cart" buttons
function addAddToCartButtonListeners() {
    
    const addToCartButtons = document.querySelectorAll('.btn-primary.add-to-cart-button');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCartHandler);
    });

}

// Function to handle adding a book to the cart with a specific quantity
async function addToCartHandler(event) {
    // Ensure the event target is a button
    if (event.target.tagName.toLowerCase() !== 'button') {
        return;
    }

    // Use the global variable instead of calling checkLogin.isLoggedIn()
    if (!isLoggedIn) {
        // Get the error message element in the 'card-body' for this specific book
        const errorMessageElement = event.target.parentElement.querySelector('.card-error-message');
        // Set the error message
        errorMessageElement.textContent = '';
        errorMessageElement.textContent = "Please login first before adding element into cart";
        setTimeout(function() {
            errorMessageElement.textContent = '';
        }, 2000);
        return;
    }
    else{
       const errorMessageElement = event.target.parentElement.querySelector('.card-error-message');
        // Set the error message
        errorMessageElement.textContent = '';  
    }

    // Retrieve the book ID from the clicked button's data-book-id attribute
    const book_id = event.target.dataset.bookId;
    if (!book_id) {
        console.error('Book ID not found.');
        return;
    }

    // Show the modal here
    $('#quantityModal').modal('show');

    // Add an event listener to the quantity input field to clear the error message
    document.getElementById('quantityInput').addEventListener('input', function() {
     document.getElementById('quantityMessage').textContent = '';
        document.getElementById('quantityMessage').className = ''
        document.getElementById('quantityMessage').classList.add('hidden')
       });

    // Add an event listener to the submit button in the modal
    document.getElementById('submitQuantityBtn').addEventListener('click', function() {
        // Get the quantity from the input field in the modal
        const quantity = document.getElementById('quantityInput').value;

        // Convert quantity to a number
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            // Invalid quantity, show error message in the modal
            document.getElementById('quantityMessage').classList.remove('hidden');
            document.getElementById('quantityMessage').classList.add('text-danger');
            document.getElementById('quantityMessage').textContent = 'Please enter a valid quantity.';
            return;
        }

        // Call the addToCart function with the book ID and quantity
        Cart.addToCart(book_id, parsedQuantity);
        
        document.getElementById('quantityMessage').classList.remove('hidden');
        document.getElementById('quantityMessage').classList.add('text-success');
        document.getElementById('quantityMessage').textContent = 'Items Added into Cart';
        document.getElementById('quantityInput').value = '';

        // Wait for 5 seconds before hiding the modal
        setTimeout(function() {
            $('#quantityModal').modal('hide');
        }, 2000);
    });
}

// Function to add event listeners to the "Review" buttons
function addReviewButtonListeners() {
    const reviewButtons = document.querySelectorAll('.btn-success.review-button');
    reviewButtons.forEach(button => {
        button.addEventListener('click', Review.reviewHandler);
    });
}

// Function to add event listeners to the "View Reviews" buttons
function addViewReviewButtonListeners() {
    const viewReviewsButtons = document.querySelectorAll('.btn-info.view-reviews-button');
    viewReviewsButtons.forEach(button => {
        button.addEventListener('click', Review.viewReviewsHandler);
    });
}

export {displayBooks, displayFeaturedBooks,addAddToCartButtonListeners,addReviewButtonListeners,addViewReviewButtonListeners}