let User = require('../models/model')


exports.leadBoardFeatures = async (req, res, next) => {
    try {
        let leaderboardArray = await User.findAll({
            attributes: ['userName', 'totalExpense'],
            order: [
                ['totalExpense', 'DESC']
            ]
        })
        res.json({ leaderboardArray: leaderboardArray })
    }
    catch (err) {
        console.log(err)
    }
}