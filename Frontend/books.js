import * as Books from './displayBooks.js'

document.addEventListener("DOMContentLoaded", async function () {
    
    // Fetch all categories from the server and populate genre buttons
    await fetchCategories();
    // Fetch and display all books initially
    await fetchAndDisplayAllBooks();
    // Event listener for genre selection
    const genreButtons = document.querySelectorAll('.genre-btn');
    genreButtons.forEach(button => {
        button.addEventListener('click', function () {
            const selectedGenre = this.getAttribute('data-genre');
            fetchBooksByGenre(selectedGenre);
        });
    });

    // Fetch and display featured books
    fetchAndDisplayFeaturedBooks();
});


async function fetchCategories() {
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
        const categories = await response.json();
        let genreButtonsContainer = document.querySelector('.form-group-button');
        genreButtonsContainer.innerHTML = ''; // Clear existing content

        // Add the "All" button
        let allButton = document.createElement('button');
        allButton.classList.add('btn', 'btn-outline-primary', 'genre-btn');
        allButton.setAttribute('data-genre', 'all'); // Use 'all' as the data-genre attribute for the "All" button
        allButton.textContent = 'All'; // Set the text content to "All"
        genreButtonsContainer.appendChild(allButton); // Add the "All" button to the container

        categories.forEach(function(category) {
            // Create a button for each category
            let button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-primary', 'genre-btn');
            button.setAttribute('data-genre', category.category_id); // Use category_id as the data-genre attribute
            button.textContent = category.category_name; // Use category_name as the button text
            genreButtonsContainer.appendChild(button); // Add the button to the container
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Fetch and display all books
async function fetchAndDisplayAllBooks() {
    try {
        const response = await fetch('http://localhost:5001/api/books');
        if (!response.ok) {
            throw new Error('Failed to fetch all books');
        }
        const books = await response.json();
        Books.displayBooks(books);
    } catch (error) {
        console.error('Error fetching all books:', error);
    }
}

// Fetch books by genre and update display
async function fetchBooksByGenre(selectedGenre) {
    try {
        let apiUrl = 'http://localhost:5001/api/books/';
        if (selectedGenre !== 'all') {
            apiUrl += `genre/${selectedGenre}`;
        }
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch books by genre');
        }
        const books = await response.json();
        Books.displayBooks(books);
    } catch (error) {
        console.error('Error fetching books by genre:', error);
    }
}

const toggleReviewFormBtn = document.getElementById('toggleReviewFormBtn');
const reviewFormContainer = document.getElementById('reviewFormContainer');

if (toggleReviewFormBtn && reviewFormContainer) {
    toggleReviewFormBtn.addEventListener('click', function () {
        if (reviewFormContainer.style.display === 'none') {
            reviewFormContainer.style.display = 'block';
        } else {
            reviewFormContainer.style.display = 'none';
        }
    });
}
// Function to fetch and display featured books
async function fetchAndDisplayFeaturedBooks() {
    try {
        const response = await fetch('http://localhost:5001/api/books/featured');
        if (!response.ok) {
            throw new Error('Failed to fetch featured books');
        }
        const featuredBooks = await response.json();

        Books.displayFeaturedBooks(featuredBooks);
    } catch (error) {
        console.error('Error fetching featured books:', error.message);
    }
}

