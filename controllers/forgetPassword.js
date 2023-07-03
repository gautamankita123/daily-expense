const Sib = require('sib-api-v3-sdk');
const jwt = require('jsonwebtoken');

exports.forgetPassword = (req, res, next) => {
    // console.log(req.body.email)
    let id = req.user.id
    try {

        var defaultClient = Sib.ApiClient.instance;
        var apiK = defaultClient.authentications['api-key'];
        apiK.apiKey = process.env.API_KEY;

        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'ankitagautam6263@gmail.com'
        }
        const receivers = [
            {
                email: req.body.email
            }
        ]

        tranEmailApi
            .sendTransacEmail({
                sender,
                to: receivers,
                subject: 'new mail sended',
                htmlcontent: `<p>To reset your password<a href="http://localhost:4000/password/resetPassword/${id}" > click here</a></p>`
            })
            .then(d => {
                console.log(d)
                res.send(d)
            })

            .catch(err => console.log('123ee..', err.body))
    }
    catch (err) {
        console.log('err>>>', err.body)
    }
}