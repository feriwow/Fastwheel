// const jwt = require('jsonwebtoken');
// // const { error } = require('../middleware/errorHandler');

// module.exports = {
//     verifyToken: async (req, res, next) => {
//         const authHeaders = req.headers['authorization'];
//         const token = authHeaders && authHeaders.split(' ')[1];

//         jwt.verify(token, process.env.SECRET || 'secret', (err, user) => {
//             if (err) {
//                 // return error(res, 401, 'unauthorized', err);
//                 res.status(401).json({message: "unauthorized"})
//             }

//             req.user = user;
//             next();
//         });
//     },
//     signToken: async (req, res, next) => {
//         return jwt.sign(data, SECRET)
//     }
// };

var jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SECRET
// console.log(SECRET_KEY, "<<<<<<<<<<");

// console.log({ SECRET_KEY })
const signToken = (data)=>{
    return jwt.sign(data, SECRET_KEY)
}
const verifyToken = (token)=>{
    return jwt.verify(token, SECRET_KEY)
}

module.exports = {
    signToken,
    verifyToken
}