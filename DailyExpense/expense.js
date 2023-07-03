// let Razorpay = require('Razorpay');

let url = 'http://localhost:4000'

let token = localStorage.getItem('token');
let ls = localStorage.getItem('primeUser')
let table = document.getElementById('tableItems');
let form = document.getElementById('submitForm');
let editForm = document.getElementById('editForm');
let board = document.getElementById('board');

editForm.style.display = 'none';
board.style.display = 'none';

showData()

document.getElementById('exepenseBtn').addEventListener('click', (e) => {
    // e.preventDefault()
    let token = localStorage.getItem('token');

    let obj = JSON.stringify({
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        category: document.getElementById('category').value
    })
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url + '/expense',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: obj
    };

    axios.request(config)
        .then((res) => {
            // console.log(res)
            let response = res.data;
            let tr = document.createElement('tr');
            tr.innerHTML = `
        <td class="withDesc">${response.Description}</td>
        <td class="withPrice">${response.Price}</td>
        <td class="withQuty">${response.Category}</td>
        <td><button class="Btn1" id="${response.id}">delete</button><button class="Btn2" id="${response.id}">edit</button></td>`
            table.appendChild(tr);
        })
        .catch((error) => {
            console.log(error);
        });
})



function showData() {
    // console.log(token)

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url + '/expense',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
    };

    axios.request(config)
        .then((res) => {
            // console.log(res)
            let resp = res.data.data;
            resp.forEach(response => {

                let tr = document.createElement('tr');
                tr.innerHTML = `
          <td class="withDesc">${response.Description}</td>
          <td class="withPrice">${response.Price}</td>
          <td class="withcat">${response.Category}</td>
          <td><button class="Btn1 delete" id="${response.id}">delete</button><button class="Btn2 edit" id="${response.id}">edit</button></td>`
                table.appendChild(tr);
            });
            if (res.data.prime === true) {
                premium.style.display = 'none';
                let h1 = document.createElement('h1');
                h1.innerHTML = 'you are a prime user now!!'
                primeUser.append(h1)
                primeUser.style.display = 'block'
            }
        })
        .catch((error) => {
            console.log(error);
        });
}


document.getElementById('tableItems').addEventListener('click', (e) => {
    // e.preventDefault();
    if (e.target.classList.contains('delete')) {
        let id = e.target.id


        let data = JSON.stringify({ id: id })
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: url + '/expense',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            data: data
        };

        axios.request(config)
            .then((res) => {
                let li = e.target.parentElement.previousElementSibling
                let li2 = li.parentElement.previousElementSibling
                table.removeChild(li2)
                console.log(res.data)
            })
    }
})

let editId;
document.getElementById('tableItems').addEventListener('click', (e) => {
    // e.preventDefault();
    if (e.target.classList.contains('edit')) {
        let id = e.target.id
        editId = id
        form.style.display = 'none';
        table.style.display = 'none';
        editForm.style.display = "block";


        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: url + '/expense',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        };

        axios.request(config)
            .then((response) => {
                response.data.data.forEach(i => {
                    if (i.id == id) {
                        document.getElementById('newprice').value = i.Price;
                        document.getElementById('newdescription').value = i.Description;
                        document.getElementById('newcategory').value = i.Category;
                    }
                })
            })
    }
})


document.getElementById('updateBtn').addEventListener('click', (e) => {
    // e.preventDefault()
    let data = JSON.stringify({
        id: editId,
        description: document.getElementById('newdescription').value,
        price: document.getElementById('newprice').value,
        category: document.getElementById('newcategory').value
    });

    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: url + '/expense',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        data: data
    };

    axios.request(config)
        .then((res) => {
            console.log(res.data)
        })
})


document.getElementById('premium').addEventListener('click', (e) => {
    e.preventDefault()
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url + '/primemember/purches',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        // data: data
    };

    axios.request(config)
        .then((response) => {
            // console.log(response.data.key_id)
            // console.log(response.data.ord.id)
            console.log(response)
            let option = {
                "key": response.data.key_id,
                "order_id": response.data.ord.orderId,
                "handler": async function (response) {

                    axios.post(url + '/primemember/updatetransaction', {
                        order_id: option.order_id, payment_id: response.razorpay_payment_id, status: 'SUCCESSFUL'
                    }, { headers: { 'Authorization': token } })
                        .then((res) => {
                            premium.style.display = 'none';
                            let h1 = document.createElement('h1');
                            h1.innerHTML = 'you are a prime user now!!'
                            primeUser.append(h1)
                            primeUser.style.display = 'block';
                        })
                }
            }

            const rezl = new Razorpay(option);

            rezl.open();
            // e.preventDefault();

            rezl.on('payment.failed', async function (response) {
                axios.post(url + '/primemember/updatetransaction', {
                    order_id: option.order_id, payment_id: response.razorpay_payment_id, status: 'FAILED'
                }, { headers: { 'Authorization': token, } })
                    .then(alert('paymant fail'))
            })
        })
});

let premium = document.getElementById('premium');
let primeUser = document.getElementById('primeUser')
primeUser.style.display = 'none'


document.getElementById('leadboard').addEventListener('click', () => {
    board.style.display = "block";
    axios.get(url + '/prime/primeUser', { headers: { 'Authorization': token, } })
        .then(res => {
            console.log(res.data.leaderboardArray)
            res.data.leaderboardArray.forEach(data => {
                let li = document.createElement('li');
                li.innerHTML = `name = ${data.userName} total expenses = ${data.totalExpense}`
                board.appendChild(li);
            });
        })
})