const catchBlock = (res, err, msg = '') => {
    res.status(401).json({
        message: msg,
        err
    })
};

const sendResBlock = (res, response, msg = '') => {
    res.status(200).json({
        message: msg,
        response
    })
};

module.exports = {
    catchBlock,
    sendResBlock
};