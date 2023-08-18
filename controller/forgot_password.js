const uuid = require("uuid");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();

const User = require("../models/user");
const forgotPassword = require("../models/forgotpassword");
const { escape } = require("mysql");


exports.forgotpassword = async (req, res) => {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;

    var apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.API_KEY;

    try {
        const email = req.body.email;
        const user = await User.findOne({ where: { email } });

        if (user) {
            const id = uuid.v4();
            await forgotPassword.create({ id, active: true, userId: user.id });
            const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

            const sender = {
                email: "ankitagautam6263@gmail.com",
                name: "ANKITA GAUTAM",
            };

            const receivers = [
                {
                    email: req.body.email,
                },
            ];

            const msg = {
                sender,
                to: receivers,
                subject: "Reset Your Password",
                htmlContent: `<a href="http://localhost:3000/resetpassword/${id}">Reset password </a>`,
            };

            try {
                const sendEmail = await apiInstance.sendTransacEmail(msg);
                return res
                    .status(200)
                    .json({
                        message: "Link to reset password sent to your mail",
                        success: true,
                    });
            } catch (error) {
                console.error("Error sending the email:", error);
                throw new Error(error);
            }
        } else {
            throw new Error("User does not Exist");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message, success: false });
    }
};


exports.reset = async (req, res, next) => {
    const id = req.params.id;

    const forgotpasswordrow = await forgotPassword.findOne({ where: { id: id } });

    if (forgotpasswordrow.active === true) {
        forgotpasswordrow.update({ active: false });

        res.status(201).send(
            `<html>
  <body>
    <form action="/updatepassword/${id}" method="get">
      <div>
       <label for="password">Password</label>
       <input type="text" name="newPassword" required placeholder="enter password">
       <button type="submit">reset password</button>
      </div>
    </form>
  </body>
</html>`
        );
        res.end();
    }
};


exports.updatepassword = (req, res) => {
    const newPassword = req.query;
    const updateid = req.params.updateid;

    forgotPassword
        .findOne({ where: { id: updateid } })
        .then((forgotPasswordUser) => {
            User.findOne({ where: { id: forgotPasswordUser.userId } })
                .then((user) => {
                    const saltrounds = 10;
                    bcrypt.genSalt(saltrounds, function (err, salt) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }

                        bcrypt.hash(newPassword.newPassword, salt, function (err, hash) {
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }

                            user
                                .update({ password: hash })
                                .then(() => {
                                    res.status(201).send(
                                        `<html>
  <body>
    <h1>Successfuly update the new password</h1>
  </body>
</html>`
                                    );
                                    res.end();
                                })
                                .catch((err) => {
                                    throw new Error(err);
                                });
                        });
                    });
                })
                .catch((err) => {
                    return res
                        .status(404)
                        .json({ error: "No user Exists", success: false });
                })
                .catch((err) => {
                    return res.status(500).json(err);
                });
        });
};