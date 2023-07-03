let url = 'http://localhost:4000/'

let token = localStorage.getItem('token');

document.getElementById('loginBtn').addEventListener('click', (e) => {
    e.preventDefault()

    obj = JSON.stringify({
        email: document.getElementById('emailInput').value,
        password: document.getElementById('passwordInput').value
    })

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url + 'user/login',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        data: obj
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            if (response.status === 200) {
                // console.log(response.data.token)

                localStorage.setItem('token', response.data.token);
                window.location.href = 'http://127.0.0.1:5500/DailyExpense/expense.html?'
            }
        })
        .catch((error) => {
            console.log(error);
        });
})


let forgetPass = document.getElementById('forgetPass');
let forgetemailform = document.getElementById('forgetemailform');

forgetemailform.style.display = 'none';

forgetPass.addEventListener('click', (e) => {
    // e.preventDefault()
    forgetemailform.style.display = 'block';
    document.getElementById('submitForm').style.display = 'none'
})

document.getElementById('forgetBtn').addEventListener('click', (e) => {
    // e.preventDefault()

    let obj = {
        email: document.getElementById('forgetemailInput').value,
    }
    console.log(obj)
    axios.post(url + 'password/forgotpassword', obj, { headers: { 'Authorization': token } })
        .then(response => {
            alert('mail send to registered Email');
        })
        .catch(err => {
            console.log(err)
        })
})