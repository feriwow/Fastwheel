const { verifyToken } = require("../helper/jwt");
const { Partner } = require('../models')


const authenticationPartner = async (req, res, next) => {
    const {access_token} = req.headers
    try {
        if (!access_token) {
            throw { name: 'JsonWebTokenError' }
        }
        
        const partnerId = verifyToken(access_token)
        // console.log(userId);
        const partner = await Partner.findOne({ where: { email: partnerId.email } })
        // console.log(partner);
    
        if (!partner) {
            throw { name: 'JsonWebTokenError' }
        }
    
        req.partner = partner;
        next()

    } catch (err) {
        next(err)
    }
}

module.exports = authenticationPartner 