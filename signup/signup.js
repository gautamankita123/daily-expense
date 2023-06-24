
async function signup(e) {
    try {
        e.preventDefault();
        const nameInput = document.querySelector('input[name="name"]');
        const emailInput = document.querySelector('input[name="email"]');
        const passwordInput = document.querySelector('input[name="password"]');

        const signupDetails = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        }

        const response = await axios.post("http://localhost:3000/user/signup", signupDetails);
        if (response.status === 201) {
            window.location.href = "../Login/login.html";
        } else {
            throw new Error('Failed to sign up');
        }
    } catch (err) {
        document.body.innerHTML += `<div style="color: red;">${err}</div>`;
    }
}

document.querySelector('form').addEventListener('submit', signup);
