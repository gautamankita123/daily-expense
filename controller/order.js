const Order = require("../models/order");
const RazorPay = require("razorpay");
const jwt = require("jsonwebtoken");

const purchasepremium = async (req, res) => {
    console.log(req.user);

    try {
        var rzp = new RazorPay({
            key_id: "rzp_test_I5XWgdMdt8wbcA",
            key_secret: "iceq5SJmRHK4cadxjtIn807s",
        });
        const amount = 2500;

        await rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }

            //  await req.user.createOrder({ orderid: order.id, status:'PENDING'})
            await Order.create({
                orderid: order.id,
                status: "PENDING",
                userId: req.user.id,
            })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id });
                })
                .catch((err) => {
                    throw new Error(JSON.stringify(err));
                });
        });
    } catch (err) {
        res.status(501).json({ error: err });
    }
};

const updatepremium = (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;

        Order.findOne({ where: { orderid: order_id } })
            .then((order) => {
                order
                    .update({ paymentid: payment_id, status: "SUCCESSFUL" })
                    .then(() => {
                        req.user
                            .update({ ispremiumuser: true })
                            .then(() => {
                                return res
                                    .status(202)
                                    .json({ success: true, message: "TRansaction Successful" });
                            })
                            .catch((err) => {
                                throw new Error(err);
                            });
                    })
                    .catch((err) => {
                        throw new Error(err);
                    });
            })
            .catch((err) => {
                throw new Error(err);
            });
    } catch (err) {
        res.status(509).json({ error: err, message: "mission fail 1" });
    }
};

module.exports = { purchasepremium, updatepremium };