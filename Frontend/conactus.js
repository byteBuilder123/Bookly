document.getElementById('contactForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  // Clear previous status messages
  clearStatusMessage();

  let name = document.getElementById('name').value.trim();
  let email = document.getElementById('email').value.trim();
  let phone = document.getElementById('phone').value.trim();
  let message = document.getElementById('message').value.trim();

  if (name === '' || email === '' || phone === '' || message === '') {
    setStatusMessage('Error: All fields are required!');
    return;
  }

  if (!/^[a-zA-Z\s]+$/.test(name)) {
    setStatusMessage('Error: Name should only contain letters and spaces!');
    return;
  }

  if (!/^[.,!;:?\s\w]+$/.test(message)) {
    setStatusMessage('Error: Message contains invalid characters!');
    return;
  }

  if (!/^\d{8,}$/.test(phone)) {
    setStatusMessage('Error: Phone number should be at least 8 digits long and contain only numbers!');
    return;
  }

  let data = {
    name: name,
    email: email,
    phone: phone,
    message: message
  };

  try {
    const response = await fetch('http://127.0.0.1:5001/api/users/contactus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    setStatusMessage('Message sent successfully!', true);
   
    setTimeout(function() {
      clearStatusMessage();
      clearFormFields();
    }, 2000);
  } catch (error) {
    setStatusMessage('Error: ' + error.message);
    
    setTimeout(function() {
      clearStatusMessage();
    }, 2000);
  }
});

function setStatusMessage(message, isSuccess = false) {
  const statusMessageElement = document.getElementById('statusMessage');
  statusMessageElement.style.display = 'block';
  statusMessageElement.innerHTML = message;
  statusMessageElement.classList.remove('alert-danger', 'alert-success');
  statusMessageElement.classList.add(isSuccess ? 'alert-success' : 'alert-danger');
}

function clearStatusMessage() {
  const statusMessageElement = document.getElementById('statusMessage');
  statusMessageElement.innerHTML = '';
  statusMessageElement.style.display = 'none';
  statusMessageElement.classList.remove('alert-danger', 'alert-success');
}

function clearFormFields() {
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('message').value = '';
}

// Add event listeners to clear status message when user starts typing
const formFields = document.querySelectorAll('#name, #email, #phone, #message');
formFields.forEach(field => {
  field.addEventListener('input', clearStatusMessage);
});
