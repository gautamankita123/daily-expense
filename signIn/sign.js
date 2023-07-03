let url = 'http://localhost:4000/user'
let token = localStorage.getItem('token');

document.getElementById('submitBtn').addEventListener('click', (e) => {
    e.preventDefault()
    let obj = JSON.stringify({
        name: document.getElementById('nameInput').value,
        email: document.getElementById('emailInput').value,
        contact: document.getElementById('contactInput').value,
        password: document.getElementById('passwordInput').value
    })
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url + '/signin',
        headers: {
            'Content-Type': 'application/json'
        },
        data: obj
    };
    console.log(obj);

    axios.request(config)
        .then((response) => {
            // window.location.href = `http://127.0.0.1:5500/logIn/login.html?${response.data.id}`
            obj = JSON.stringify({
                email: document.getElementById('emailInput').value,
                password: document.getElementById('passwordInput').value
            })

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url + '/login',
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
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

})


