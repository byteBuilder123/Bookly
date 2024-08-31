import * as Books from './displayBooks.js';

// Fetch and display new arrivals
async function fetchAndDisplayNewArrivals() {
    try {
        const response = await fetch('http://localhost:5001/api/books/newarrivals');
        if (!response.ok) {
            throw new Error('Failed to fetch new arrivals');
        }
        const newArrivals = await response.json();
 
        displayNewArrivals(newArrivals);
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
    }
}

// Function to display books by genre on the page
async function displayNewArrivals(books) {
    const newArrivalsSection = document.getElementById('new-arrivals-row');
    newArrivalsSection.innerHTML = ''; // Clear previous content

    if (books.length === 0) {
        newArrivalsSection.innerHTML = 'No new arrivals found for this category.';
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
            newArrivalsSection.appendChild(colDiv);
        });

        // Add event listeners to all "View Reviews" buttons
        Books.addViewReviewButtonListeners();
        Books.addAddToCartButtonListeners();
        Books.addReviewButtonListeners();
    }
}

export {fetchAndDisplayNewArrivals, displayNewArrivals};
