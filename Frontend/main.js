import * as books from './newArival.js'
document.addEventListener("DOMContentLoaded", async function () {
    await books.fetchAndDisplayNewArrivals();
});
