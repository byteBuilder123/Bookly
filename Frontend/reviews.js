import * as isLoggedIn from "./checkLogin.js";
import * as Cart from "./cart.js";
let isLogIn = false;

// Check login status immediately when the script runs
isLoggedIn.isLoggedIn().then(loggedIn => {
    isLogIn = loggedIn;
});

async function fetchAndDisplayReviews(bookId) {

    let response = await fetch(`http://localhost:5001/api/reviews/get?bookId=${bookId}`);
    const reviews = await response.json();
    displayReviews(reviews);
}

// Function to display reviews
function displayReviews(reviews) {
    const allReviewsContainer = document.getElementById('all-reviews-container');
    if (!allReviewsContainer) {
        console.error('All reviews container not found.');
        return;
    }

    // Clear existing reviews
    allReviewsContainer.innerHTML = '';

    if (reviews.length === undefined || reviews.length == 0) { 
         
         const noreviewElement = document.createElement('div');
            noreviewElement.classList.add('col-md-11', 'mb-4','d-flex','justify-content-center');
            noreviewElement.innerHTML = `
                <div class="card border-1 shadow review-card">
                    <div class="card-body bg-warning">
                        <h5 class="card-title text-danger">No Reviews Found For This Book</h5>
                    </div>
                </div>`
            allReviewsContainer.appendChild(noreviewElement);
    } else {
        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('col-md-4', 'mb-4');
            reviewElement.innerHTML = `
                <div class="card border-0 shadow review-card bg-light">
                    <div class="card-body">
                        <h5 class="card-title text-primary">${review.customer_name}</h5>
                        <div class="rating text-success">
                            ${generateStarRating(review.rating)}
                        </div>
                        <p class="card-text text-dark">${review.review_text}</p>
                    </div>
                </div>
            `;
            allReviewsContainer.appendChild(reviewElement);
        });
    }
}

// Function to sanitize user input
function sanitizeInput(input) {
    // Replace HTML tags and JavaScript code with empty strings
    return input.replace(/<[^>]*>?|&(?!\w+;)/g, '');
}

// Function to submit reviews
async function submitReview(book_id) {
    // Get the reviewMessage element
    const reviewMessage = document.getElementById('reviewMessage');

    const userInfo = await Cart.fetchUserInfoFromServer();
    const { username, user_id } = userInfo;

    // If logged in, proceed with review submission
    const reviewText = document.getElementById('reviewText');
    const rating = document.getElementById('reviewRating');

    // Sanitize reviewText input
    const sanitizedReviewText = sanitizeInput(reviewText.value);

    // Clear error or success message when user tries to type
    reviewText.addEventListener('input', () => {
        reviewMessage.textContent = '';
        reviewMessage.classList.remove('text-danger'); // Remove text-danger class if needed
        reviewMessage.classList.add('hidden'); // Add hidden class
    });

    rating.addEventListener('input', () => {
        reviewMessage.textContent = '';
        reviewMessage.classList.remove('text-danger'); // Remove text-danger class if needed
        reviewMessage.classList.add('hidden'); // Add hidden class
    });

    // Check if name is empty
    if (!username) {
        // If name is empty, display an error message on the screen
        reviewMessage.classList.remove('hidden');
        reviewMessage.classList.add('text-danger');
        reviewMessage.textContent = 'Name is required';
        return; // Exit function if name is empty
    }

    // Check if rating is negative
    if (rating.value < 0) {
        // If rating is negative, display an error message on the screen
        reviewMessage.classList.remove('hidden');
        reviewMessage.classList.add('text-danger');
        reviewMessage.textContent = 'You cannot give a negative rating';
        return; // Exit function if rating is negative
    }

    const reviewData = {
        customer_id: user_id,
        name: username,
        book_id: book_id,
        reviewText: sanitizedReviewText, // Use sanitized review text
        rating: rating.value
    };

    try {
        const response = await fetch('http://localhost:5001/api/reviews/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });

        if (!response.ok) {
            throw new Error('Failed to submit review');
        }

        const data = await response.json();
        // If the review is submitted successfully
        reviewMessage.classList.remove('hidden');
        reviewMessage.classList.add('text-success');
        reviewMessage.textContent = "Reviews Submitted Successfully";

        // Clear form fields after successful submission
        reviewText.value = '';
        rating.value = '';

        // Close review modal after 5 seconds
        setTimeout(function() {
            $('#reviewModal').modal('hide');
        }, 2000);
        reviewMessage.className = '';
        reviewMessage.classList.add('hidden')
    } catch (error) {
        // If there is an error
        reviewMessage.classList.remove('hidden');
        reviewMessage.classList.add('text-danger');
        reviewMessage.textContent = 'There was a problem submitting your review: ' + error.toString();
    }

    // Fetch and display reviews again to update the list
    Review.fetchAndDisplayReviews();
}

// Function to generate star rating HTML
function generateStarRating(rating) {
    const filledStars = '<i class="fas fa-star"></i>'.repeat(Math.floor(rating));
    const halfStar = (rating % 1 !== 0) ? '<i class="fas fa-star-half-alt"></i>' : '';
    const emptyStars = '<i class="far fa-star"></i>'.repeat(Math.floor(5 - rating));
    return filledStars + halfStar + emptyStars;
}

// Add event listeners to all "View Reviews" buttons
function viewReviewsHandler(event) {
    // Ensure the event target is a button
    if (event.target.tagName.toLowerCase() !== 'button') {
        return;
    }
  
    // Retrieve the book ID from the clicked button's data-book-id attribute
    const book_id = event.target.dataset.bookId;

            $('#viewReviewsModal').modal('show');
                 // Fetch and display reviews again to update the list
       fetchAndDisplayReviews(book_id);
  
}

// Function to add event listeners to the "Review" buttons
function reviewHandler(event) {
  
    // Ensure the event target is a button
    if (event.target.tagName.toLowerCase() !== 'button') {
        return;
    }

      // Use the global variable instead of calling isLoggedIn.isLoggedIn()
    if (!isLogIn) {
        // Get the error message element in the 'card-body' for this specific book
        const errorMessageElement = event.target.parentElement.querySelector('.card-error-message');
        // Set the error message
        errorMessageElement.textContent = '';
        errorMessageElement.textContent = "Please login first before submiting review";
         setTimeout(function() {
            errorMessageElement.textContent = '';
        }, 2000);
        return;
    }else{
         const errorMessageElement = event.target.parentElement.querySelector('.card-error-message');
        // Set the error message
        errorMessageElement.textContent = '';
        
    }
    // Retrieve the book ID from the clicked button's data-book-id attribute
   const book_id = event.target.dataset.bookIdReview;

    if (!book_id) {
        console.error('Book ID not found.');
        return;
    }
    
        $('#reviewModal').modal('show');

         const reviewButton = document.getElementById('submitReviewBtn');
    reviewButton.addEventListener('click', function() {
    submitReview(book_id);
});

    

}

export {fetchAndDisplayReviews, displayReviews, reviewHandler, viewReviewsHandler}
