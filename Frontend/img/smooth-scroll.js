

    document.getElementById('cta-button').addEventListener('click', function(event) {
        event.preventDefault();

        // Show loading spinner
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

        const targetSection = document.querySelector(this.getAttribute('href'));
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });

            // Reset button text after scrolling
            const ctaButton = this;
            setTimeout(function() {
                ctaButton.innerHTML = 'Discover Our Collection';
            }, 1000); // Adjust the delay as needed
        }
    });
