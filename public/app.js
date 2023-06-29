// Initialize Variables with HTML Element
let expenseAmount = document.querySelector('#expense-amount');
let expenseInfo = document.querySelector('#expense-info');
let expenseCategory = document.querySelector('#expense-category');
let btn = document.querySelector('.add-update');
let expenseList = document.querySelector('.expense-list');
let buyBtn = document.querySelector('.buy-btn');
let leaderboardBtn = document.querySelector('#leaderboard-btn');

// Event Handlers
document.addEventListener('DOMContentLoaded', getExpenses);
btn.addEventListener('click', addExpense);
expenseList.addEventListener('click', editExpense);
expenseList.addEventListener('click', deleteExpense);
buyBtn.addEventListener('click', addBuyPremium);
leaderboardBtn.addEventListener('click', updateLeaderboard);

// CRUD Functions

// Get All Expenses From Database
async function getExpenses() {
    if (localStorage.getItem('isPremium') == "true") {
        document.querySelector('.premium-text').style.display = 'block';
        buyBtn.style.display = 'none';
        document.querySelector('.leaderboard').classList.remove('d-none');
    } else {
        document.querySelector('.premium-text').style.display = 'none';
        buyBtn.style.display = 'block';
        document.querySelector('.leaderboard').classList.add('d-none');
    }
    const token = localStorage.getItem('token');
    document.querySelector('.logged-user').textContent = localStorage.getItem('name');
    if (token) {
        try {
            const response = await axios.get(`http://localhost:3000/expenses`, { headers: { 'Authorization': token } });
            response.data.forEach(expense => {
                generateHTML(expense.id, expense.amount, expense.description, expense.category);
            })
        } catch (error) {
            console.log(error);
        }
    }
}

// Add Expense In Database
async function addExpense(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
        const id = document.getElementById('expense-id').value;
        let obj = {
            "amount": parseInt(expenseAmount.value),
            "description": expenseInfo.value,
            "category": expenseCategory.value,
        };
        if (id) {
            try {
                const response = await axios.put(`http://localhost:3000/expenses/${id}`, obj, { headers: { 'Authorization': token } });
                window.location.reload();
            } catch (error) {
                console.log(error);
            }
        } else {
            if (!id && expenseAmount.value && expenseInfo.value && expenseCategory.value) {
                try {
                    const response = await axios.post("http://localhost:3000/expenses", obj, { headers: { 'Authorization': token } });
                    generateHTML(response.data.id, response.data.amount, response.data.description, response.data.category);
                    setInputValues();
                } catch (err) {
                    console.log(err);
                }
            } else {
                alert('Please fill all fields');
            }
        }
    } else {
        alert('Please login to add expense');
        window.location.href = 'http://localhost:3000/login.html';
    }
}

// Delete Expense From Database
async function deleteExpense(e) {
    if (e.target.classList.contains('delete')) {
        const id = e.target.getAttribute('id');
        e.target.parentElement.parentElement.remove();
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.delete(`http://localhost:3000/expenses/${id}`, { headers: { 'Authorization': token } });
                setInputValues();
            } catch (e) {
                console.log(e);
            }
        }
    }
}

// Edit Expense From Database
async function editExpense(e) {
    if (e.target.classList.contains('edit')) {
        const id = e.target.getAttribute('id');
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get(`http://localhost:3000/expenses/${id}`, { headers: { 'Authorization': token } });
                document.getElementById('expense-id').value = response.data.id;
                setInputValues(response.data.amount, response.data.description, response.data.category);
            } catch (e) {
                console.log(e);
            }
        }
    }
}

// Leaderboard information
async function updateLeaderboard(e) {
    try {
        const response = await axios.get("http://localhost:3000/premium/showleaderboard");
        const leaderBoardList = document.querySelector('.leaderboard-list');
        console.log(response.data)
        response.data.forEach(userDetail => {
            let output = `<li class="list-group-item d-flex justify-content-between align-items-center">
                        <span>Name - ${userDetail.name} Total Expense - ${userDetail.total_cost} Rs</span>
                    </li>`;
            leaderBoardList.innerHTML += output;
        })
    } catch (e) {
        console.log(e);
    }
}

// Razorpay Payment Method Integration
async function addBuyPremium(e) {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await axios.get("http://localhost:3000/purchase/premiummembership", { headers: { 'Authorization': token } });
            var options = {
                "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
                "name": "Acme Corp", //your business name
                "description": "Test Transaction",
                "order_id": response.data.order.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "handler": async function (response) {
                    document.querySelector('.premium-text').style.display = 'block';
                    buyBtn.style.display = 'none';
                    localStorage.setItem('isPremium', true);
                    document.querySelector('.leaderboard').classList.remove('d-none');
                    await axios.post("http://localhost:3000/updatetransactionstatus", {
                        orderId: options.order_id,
                        paymentId: response.razorpay_payment_id,
                        status: "success"
                    }, { headers: { 'Authorization': token } });
                }
            }
            const razorpay = new Razorpay(options);
            razorpay.open();
            e.preventDefault();
            razorpay.on('payment.failed', (response) => {
                axios.post("http://localhost:3000/updatetransactionstatus", {
                    orderId: options.order_id,
                    paymentId: response.error.metadata.payment_id,
                    status: "failed"
                }, { headers: { 'Authorization': token } });
                alert(response.error.description);
            });
        } catch (e) {
            console.log(e);
        }
    }
}

// Helper functions
function generateHTML(id, am, ds, ca) {
    let output = `<li class="list-group-item d-flex justify-content-between align-items-center">
                        <span>${am} - ${ds} - ${ca}</span>
                        <div>
                            <a class="edit btn btn-primary" id="${id}">Edit</a>
                            <a class="delete btn btn-danger" id="${id}">Delete</a>
                        </div>
                    </li>`;
    expenseList.innerHTML += output;
}

function setInputValues(a = '', d = '', c = '') {
    expenseAmount.value = a;
    expenseInfo.value = d;
    expenseCategory.value = c;
}