const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', userSignup);

async function userSignup(e) {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirm-password').value;

    if (matchPassword(password, confirmPassword)) {
        try {
            if (name && email && password) {
                const response = await axios.post('http://localhost:3000/user/signup', {
                    name: name,
                    email: email,
                    password: password
                });
                console.log(response.data);
                if (response.status === 201) {
                    alert('User signed up successfully');
                    window.location.href = 'http://localhost:3000/login.html';
                }
            } else {
                alert('Please fill in all fields');
            }
        } catch (error) {
            console.log(error);
            alert('User Already Exists: ' + error.response.data);
        }
    } else {
        alert('Passwords do not match');
    }
}

function matchPassword(password, confirmPassword) {
    return password === confirmPassword;
}

