const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');

exports.getPremiumMemberShip = async (req, res, next) => {
    const razorpay = new Razorpay({
        key_id: 'rzp_test_juYOltsrCYTr7t',
        key_secret: 'AhJ26nonZIOvnyIXSeZtz4eO'
    });

    razorpay.orders.create({
        amount: 2500,
        currency: 'INR',
    }, (err, order) => {
        if (err) {
            return res.status(500)
                .json({
                    error: err,
                    message: "Order id not created in razorpay"
                });
        } else {
            Order.create({
                orderId: order.id,
                userId: req.user.id,
                status: 'pending'
            }).then(order => {
                return res.status(201).json({
                    order,
                    key_id: razorpay.key_id
                })
            }).catch(e => console.log(e));
        }
    })

}

exports.postUpdatetransactionStatus = (req, res, next) => {
    Order.update({
        paymentId: req.body.paymentId,
        status: req.body.status
    },
        {
            where: {
                orderId: req.body.orderId,
            }
        }
    ).then(() => {
        User.update({
            isPremium: true
        }, {
            where: {
                id: req.user.id
            }
        })
    })
        .then()
        .catch(e => console.log(e));
}