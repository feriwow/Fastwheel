const express = require('express')
const router = express.Router()
// const authentication = require('../middleware/authentication')
// const Controller = require('../controllers/controller')
// const custRouter = require('./customer')
const partRouter = require('./partRoute')
const userRouter = require('./userRoute')
// router.get("/users", Controller)
// router.post("/register", UserController.register)
// router.post("/login", UserController.login)
// router.post("/google-signin", UserController.googleSignin)
// router.get("/history", Controller.historyList)

// router.use("/pub",custRouter)

router.use("/users",userRouter)
router.use("/partners",partRouter)
// router.use(authentication)
module.exports = router