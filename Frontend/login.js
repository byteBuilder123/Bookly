document.addEventListener('DOMContentLoaded', function () {
    const toggleLoginBtn = document.getElementById('toggleLoginBtn');
    const toggleRegistrationBtn = document.getElementById('toggleRegistrationBtn');
    const registrationFormContainer = document.getElementById('registration-form-container');
    const loginFormContainer = document.getElementById('login-form-container');
    const registrationMessage = document.getElementById('registrationMessage');
    const loginMessage = document.getElementById('loginMessage');
    const loginRegistrationModal = document.getElementById('login-registration-modal');
    
    const registrationForm = document.getElementById('registrationForm1');
    const loginForm = document.getElementById('loginForm1');
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;


    // Function to clear input fields and messages
    function clearFormAndMessages(form, messageElement) {
        // Clear input fields
        form.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        // Clear message
        if (messageElement) {
            messageElement.textContent = '';
        }
    }
    // Event listener to clear input fields when clicking outside the modal
document.addEventListener('click', function(event) {
    // Check if the click occurred outside the loginRegistrationModal
    if (!loginRegistrationModal.contains(event.target)) {
        // Clear input field values for both login and registration forms
        clearFormAndMessages(loginForm, loginMessage);
        clearFormAndMessages(registrationForm, registrationMessage);
    }  
});

    

    // clear Error Message On Typing 
 const clearErrorMessageOnTyping = (inputField, messageElement) => {
        inputField.addEventListener('input', function () {
            messageElement.textContent = ''; // Clear the error message
        });
    };
    // Function to clear input fields
    function clearInput(form){
         // Clear input fields
        form.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
    }

    const navbarLinks = document.querySelectorAll('.nav-link');
    navbarLinks.forEach(link => {
        link.addEventListener('click', function () {
            // Toggle the visibility of both forms when a navbar link is clicked
            registrationFormContainer.style.display = registrationFormContainer.style.display === 'none' ? 'block' : 'none';
            loginFormContainer.style.display = loginFormContainer.style.display === 'none' ? 'block' : 'none';

            // Clear form fields and messages when switching between forms
            clearFormAndMessages(registrationFormContainer, registrationMessage);
            clearFormAndMessages(loginFormContainer, loginMessage);
        });
    });

    toggleLoginBtn.addEventListener('click', function () {
        registrationFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';

        // Clear form fields and messages when switching to login form
        clearFormAndMessages(loginFormContainer, loginMessage);
    });

    toggleRegistrationBtn.addEventListener('click', function () {
        // Toggle between showing login and registration forms
        loginFormContainer.style.display = loginFormContainer.style.display === 'none' ? 'block' : 'none';
        registrationFormContainer.style.display = registrationFormContainer.style.display === 'none' ? 'block' : 'none';

        // Clear form fields and messages when switching to registration form
        clearFormAndMessages(registrationFormContainer, registrationMessage);
    });

// Event listener for registration form submission
if (registrationForm) {
    registrationForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent page refresh

        const username = document.getElementById('registrationUsername1').value;
        const email = document.getElementById('registrationEmail1').value;
        const password = document.getElementById('registrationPassword1').value;
        if (!usernameRegex.test(username)) {
        registrationMessage.textContent = 'Username can only contain letters, numbers, and underscores.';
        return; // Exit the function if username is invalid
        }

        // Validate password against the regex pattern
        if (!passwordRegex.test(password)) {
            registrationMessage.textContent = 'Password should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one special character, and one number.';
            return; // Exit the function if password is invalid
        }

        try {
            const response = await fetch('http://localhost:5001/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            registrationMessage.textContent = data.message;
            clearInput(registrationForm);
            clearFormAndMessages(loginForm,loginMessage)
            // Open the login form container and hide the registration form container
            setTimeout(() => {
                loginFormContainer.style.display = 'block';
                registrationFormContainer.style.display = 'none'; // Redirect after a short delay
            }, 2000);
        } catch (error) {
            registrationMessage.textContent = 'Error registering user. Please try again later.';
            clearInput(registrationForm);
        }
    });

    // Clear error message when typing in input fields
    const registrationUsernameInput = document.getElementById('registrationUsername1');
    const registrationEmailInput = document.getElementById('registrationEmail1');
    const registrationPasswordInput = document.getElementById('registrationPassword1');
    clearErrorMessageOnTyping(registrationUsernameInput, registrationMessage);
    clearErrorMessageOnTyping(registrationEmailInput, registrationMessage);
    clearErrorMessageOnTyping(registrationPasswordInput, registrationMessage);
}

   // Event listener for login form submission
// Event listener for login form submission
if (loginForm) {
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent page refresh

        const loginUsername = document.getElementById('loginUsername1').value;
        const loginPassword = document.getElementById('loginPassword1').value;

        if (!usernameRegex.test(loginUsername)) {
            loginMessage.textContent = 'Username can only contain letters, numbers, and underscores.';
            return; // Exit the function if username is invalid
        }

        // Validate password against the regex pattern
        if (!passwordRegex.test(loginPassword)) {
            loginMessage.textContent = 'Invalid password. At least 8 characters long. 1 upper, 1 lower, 1 number & 1 symbol';
            return; // Exit the function if password is invalid
        }

        try {
            const response = await fetch('http://localhost:5001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: loginUsername, password: loginPassword })
            });
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                loginMessage.textContent = 'Login successful. Redirecting...';
                setTimeout(() => {
                   
                    // Redirect to the appropriate dashboard based on the isAdmin field
                    window.location.href = data.isAdmin ? '/admin/dashboard.html' : '/dashboard.html';
                }, 1000);
            } else {
                loginMessage.textContent = data.message;
            }
            clearInput(loginForm);
        } catch (error) {
            console.error('Error logging in:', error);
            loginMessage.textContent = 'Error logging in. Please try again later.';
            clearInput(loginForm);
        }
    });
}
});