
import * as Cart from './cart.js'
    document.addEventListener("DOMContentLoaded", async function () {
   // Fetch and display cart items initially
    await Cart.getCartItems()

});