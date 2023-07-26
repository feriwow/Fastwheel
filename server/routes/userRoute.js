const express = require('express')
const userController = require('../controllers/userController')
const authentication = require('../middleware/authentication')
const router = express.Router()

router.post('/register', userController.register) //
router.post('/login', userController.login) //
router.post('/google-signin', userController.loginGoogle) //

router.use(authentication)
router.post("/distance", userController.findStoresByRadius)

router.post("/order", userController.createOrder) //
router.get("/order", userController.getOrderAll)
router.post("/payment-status", userController.paymentStatus)
router.post("/process-transaction/:orderId", userController.generateMidtransToken)
router.post('/review/:id', userController.review) //
router.get('/review/:id', userController.getReview) //
router.get("/detail/:id", userController.getOrderDetail) //
// router.put("/order/:orderId", userController.updateProblem)
router.put("/order/status/:orderId", userController.updateStatus)//
router.get("/order/detail/:orderId", userController.getOrder)//

router.post("/order/detail/:orderId", userController.addOrderDetail)

// router.put("/order/:orderId", userController.updateProblem)

router.get("/order/detail/:orderId", userController.getOrder)
router.post("/order/detail/:orderId", userController.addOrderDetail)

router.put("/order/status/:orderId", userController.updateStatus)

module.exports = router