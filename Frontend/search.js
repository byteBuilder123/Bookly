document.addEventListener("DOMContentLoaded", async function () {
    // jQuery code for toggling search form visibility
    $('#search-icon-btn').click(function (event) {
        $('#searchForm').toggleClass('search-hidden');
        // Stop propagation to prevent click event from reaching document body
        event.stopPropagation();
    });

    // Event listener to handle search form submissions
    document.getElementById('searchForm').addEventListener('submit', handleSearchFormSubmit);

    // Toggle navbar collapse
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#navbarNav');
    navbarToggler.addEventListener('click', function () {
        navbarCollapse.classList.toggle('show');
    });

    // Event listener to close search form when clicking outside of it
    document.body.addEventListener('click', function (event) {
        const searchForm = document.getElementById('searchForm');
        if (!searchForm.contains(event.target) && !event.target.matches('#search-icon-btn')) {
            searchForm.classList.add('search-hidden');
        }
    });

    // Check login status immediately when the script runs
    checkLogin.isLoggedIn().then(loggedIn => {
        isLoggedIn = loggedIn;
    });
});

import * as Cart from './cart.js';
import * as checkLogin from './checkLogin.js'

let isLoggedIn = false;

function displayMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000); // Hide the message after 5 seconds
    }
}

// Function to search books
async function searchBooks(searchTerm) {
    try {
        const response = await fetch(`http://127.0.0.1:5001/api/books/search/file?q=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            throw new Error('Failed to search books');
        }
        const searchResults = await response.json();
        return searchResults;
    } catch (error) {
        return [];
    }
}

// Function to handle search submit button
async function handleSearchFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim(); // Trim whitespace from search term
    if (searchTerm !== '') {
        try {
            const searchResults = await searchBooks(searchTerm);
            if (searchResults.length === 0) {
                displayMessage('searchResults', 'No results found');
                return;
            }
            displaySearchResults(searchResults); // Display search results
        } catch (error) {
            displayMessage('error-message', 'Error searching books: ' + error.message);
        }
    } else {
        displayMessage('searchResults', 'Search term is empty');
    }
}

// Function to display search result
async function displaySearchResults(searchResults) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = ''; // Clear previous content
    
    if (searchResults.length === 0) {
        displayMessage('searchResults', 'No results found');
        return;
    }

    searchResults.forEach(book => {
        const bookCard = createBookCard(book);
        searchResultsContainer.appendChild(bookCard);

        // Add event listener to the "Add to Cart" button
        const addToCartBtn = bookCard.querySelector('.add-to-cart-btn');
       addToCartBtn.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default button click behavior
    event.stopPropagation(); // Stop event propagation to prevent unintended behaviors

    // Use the global variable instead of calling checkLogin.isLoggedIn()
    if (!isLoggedIn) {
        // Find the error message element within the book card
        const errorMessageElement = bookCard.querySelector('.card-error-message');
        // Set the error message
        errorMessageElement.textContent = "Please login first before adding item to cart";
        // Display the error message
        errorMessageElement.style.display = 'block';
        return;
    }

    // Clear any previous error messages
    const errorMessageElement = bookCard.querySelector('.card-error-message');
    errorMessageElement.textContent = '';
    errorMessageElement.style.display = 'none';

    // Show the modal here
    $('#quantityModal').modal('show');
    // Add an event listener to the quantity input field to clear the error message
    document.getElementById('quantityInput').addEventListener('input', function() {
        document.getElementById('quantityMessage').textContent = '';
        document.getElementById('quantityMessage').className = ''
        document.getElementById('quantityMessage').classList.add('hidden')
    });
    // Add an event listener to the submit button in the modal
    document.getElementById('submitQuantityBtn').addEventListener('click', async function() {
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
        await Cart.addToCart(book.book_id, parsedQuantity);

        document.getElementById('quantityMessage').classList.remove('hidden');
        document.getElementById('quantityMessage').classList.add('text-success');
        document.getElementById('quantityMessage').textContent = 'Items Added into Cart';
        document.getElementById('quantityInput').value = '';

        // Wait for 2 seconds before hiding the modal
        setTimeout(function() {
            $('#quantityModal').modal('hide');
        }, 2000);
    });
});


        // Add event listener to the "More Details" button
        const moreDetailsBtn = bookCard.querySelector('.more-details-btn');
        moreDetailsBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default form submission behavior
            // Toggle visibility of more details
            const errorMessageElement = bookCard.querySelector('.card-error-message');
            errorMessageElement.textContent = '';
            const details = bookCard.querySelector('.book-details');
            details.classList.toggle('hidden');
        });
    });
}

// Function to create a book card
function createBookCard(book) {
    // Create a card element
    const bookCard = document.createElement('div');
    bookCard.classList.add('card', 'border-0', 'shadow', 'book-card');

    // Create card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Display book name (title)
    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = book.title;

    // Display book price
    const price = document.createElement('p');
    price.classList.add('card-text');
    price.textContent = 'Price: $' + book.price;

    // Display error
    const error = document.createElement('p');
    error.classList.add('card-error-message');
    error.setAttribute('id', 'card-error-message'); // Set ID attribute correctly

    // Button to add to cart
    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.classList.add('btn', 'btn-primary', 'btn-sm', 'mr-2', 'add-to-cart-btn');

    // Button to view more details
    const moreDetailsBtn = document.createElement('button');
    moreDetailsBtn.textContent = 'More Details';
    moreDetailsBtn.classList.add('btn', 'btn-secondary', 'btn-sm', 'more-details-btn');

    // Container for additional book details (initially hidden)
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('book-details', 'hidden');

    // Display additional book details (hidden by default)
    const author = document.createElement('p');
    author.textContent = 'Author: ' + book.author;

    const genre = document.createElement('p');
    genre.textContent = 'Genre: ' + book.genre;

    const isbn = document.createElement('p');
    isbn.textContent = 'ISBN: ' + book.isbn;

    const description = document.createElement('p');
    description.textContent = 'Description: ' + book.description;

    // Append elements to card body
    cardBody.appendChild(title);
    cardBody.appendChild(price);
    cardBody.appendChild(error);
    cardBody.appendChild(addToCartBtn);
    cardBody.appendChild(moreDetailsBtn);
    cardBody.appendChild(detailsContainer);

    // Append additional book details to details container
    detailsContainer.appendChild(author);
    detailsContainer.appendChild(genre);
    detailsContainer.appendChild(isbn);
    detailsContainer.appendChild(description);

    // Append card body to card
    bookCard.appendChild(cardBody);

    return bookCard;
}
