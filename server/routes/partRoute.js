const express = require('express')
const partControllers = require('../controllers/partController')
const router = express.Router()
const authenticationPartner = require('../middleware/authenticationPartner')

router.post('/register', partControllers.register)//
router.post('/login', partControllers.login)//
// router.post('/google-signin', partControllers.loginGoogle)

router.use(authenticationPartner)

router.get('/products', partControllers.getAllorder)//
router.post('/products', partControllers.createOrderDetail)//
router.get('/products/:orderId', partControllers.readOrderDetail)

router.post('/send-email/:orderId', partControllers.sendEmail)




module.exports = router