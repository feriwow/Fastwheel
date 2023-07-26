const errorHandle = (err, req, res, next) => {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
            msg: err.errors[0].message
        })
    } else if (err.name === "Email and Password is required") {
        res.status(400).json({ message: "Email and Password is required" }) //
    } else if (err.name === "Invalid email/password") {
        res.status(401).json({ message: "Invalid email/password" })
    } else if (err.name === "JsonWebTokenError") {
        res.status(401).json({ message: "Invalid Token" }) //
    } else if (err.name === "User not found") {
        res.status(401).json({ message: "User not found" })
    } else if (err.name === "No products provided") {
        res.status(400).json({ message: "No products provided" })
    } else {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = errorHandle