const Razorpay = require('razorpay');
const Order = require('../models/order');
const jwt = require('jsonwebtoken');

exports.getPremiumMembership = async (req, res, next) => {
    try {
        const razorpay = new Razorpay({
            key_id: 'rzp_test_gfRjJLO9U2Wzab',
            key_secret: 'TMAvMslRUcLKDoENX0EkDkgj'
        });

        razorpay.orders.create({
            amount: 2500,
            currency: 'INR',
        }, (err, order) => {
            if (err) {
                console.log('working here', err);
                throw new Error(JSON.stringify(err));
            } else {
                Order.create({
                    orderId: order.id,
                    userId: jwt.verify(req.headers.authorization, 'ZindagiNaMilegiDubara').id,
                    status: 'pending'
                }).then(order => {
                    return res.status(201).json({
                        order,
                        key_id: razorpay.key_id
                    });
                }).catch(err => {
                    throw new Error(JSON.stringify(err));
                });
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.postUpdateTransactionStatus = (req, res, next) => {
    Order.update(
        {
            paymentId: req.body.paymentId,
            status: 'success'
        },
        {
            where: {
                orderId: req.body.orderId
            }
        }
    )
        .then(() => {
            User.update(
                {
                    isPremium: true
                },
                {
                    where: {
                        id: jwt.verify(req.headers.authorization, 'ZindagiNaMilegiDubara').id
                    }
                }
            );
        })
        .then(() => {
            res.status(200).json({
                success: true,
                message: 'Transaction status updated successfully.'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Failed to update transaction status.'
            });
        });
};
