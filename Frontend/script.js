
// JavaScript code to handle navbar toggler behavior for small devices and toggle FAQ answers
document.addEventListener("DOMContentLoaded", function () {
    var navbarToggler = document.querySelector(".navbar-toggler");
    var navbarCollapse = document.querySelector("#navbarNav");

    navbarToggler.addEventListener("click", function () {
        if (navbarCollapse.classList.contains("show")) {
            navbarCollapse.classList.remove("show");
        } else {
            navbarCollapse.classList.add("show");
        }
    });

    // Collapse the navbar when clicking outside of it
    document.addEventListener("click", function (event) {
        var isClickInsideNavbar = navbarCollapse.contains(event.target);
        var isClickInsideToggler = navbarToggler.contains(event.target);

        if (!isClickInsideNavbar && !isClickInsideToggler) {
            navbarCollapse.classList.remove("show");
        }
    });
});
// Function to toggle FAQ answers
function toggleAnswer(id) {
    var answer = document.getElementById(id + '-answer');
    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
    } else {
        answer.classList.add('hidden');
    }
}
