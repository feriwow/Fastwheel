const { verifyToken } = require("../helper/jwt");
const { User } = require('../models')


const authentication = async (req, res, next) => {
    const {access_token} = req.headers
    try {
        if (!access_token) {
            throw{name: "JsonWebTokenError"}
        }
        
        const userId = verifyToken(access_token)
        console.log(userId, "<<<<");
        const user = await User.findOne({ where: { email: userId.email } })
        console.log(user,  "<<<< user");
    
        if (!user) {
            throw{name: "JsonWebTokenError"}
        }
    
        req.user = user;
        next()

    } catch (err) {
        next(err)
    }
}

module.exports = authentication 