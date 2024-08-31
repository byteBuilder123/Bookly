// // links.js
// document.addEventListener('DOMContentLoaded', function () {
//   // Function to fetch the content of the target URL asynchronously
//   function fetchPage (url) {
//     fetch(url)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok')
//         }
//         return response.text()
//       })
//       .then(data => {
//         // Update the content of the current page with the fetched content
//         document.body.innerHTML = data
//         // Update the URL in the browser's address bar
//         history.pushState({}, '', url)
//       })
//       .catch(error => {
//         console.error('There was a problem with fetching the page:', error)
//       })
//   }

//   // Get all the links
//   const links = document.querySelectorAll('.nav-link')

//   // Loop through each link
//   links.forEach(link => {
//     // Add click event listener to each link
//     link.addEventListener('click', function (event) {
//       // Prevent the default behavior of the link
//       event.preventDefault()

//       // Get the target URL from the href attribute
//       const targetUrl = this.getAttribute('href')

//       // Fetch the content of the target URL asynchronously
//       fetchPage(targetUrl)
//     })
//   })
// })
