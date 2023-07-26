const { describe, test, expect } = require('@jest/globals')
const request = require('supertest')
const app = require('../app')
const models = require('../models')
const { hashPassword } = require('../helper/bcrypt')
const bulkInsertPartner = require('../helper/PartnerBulkInsert')
const { signToken } = require('../helper/jwt')
const bulkInsertCust = require('../helper/UserBulkInsert')
const { OrderDetail } = require('../models')
// Karena ada generate pdf pake puppeter
jest.setTimeout(20000);

let access_token = ""
beforeAll(async function () {
    await bulkInsertCust()
    const partner = await bulkInsertPartner()
    access_token = signToken({
        id: partner.id,
        email: partner.email
    })

})
beforeEach(function(){
    jest.restoreAllMocks()
})
afterAll(async function () {
    await models.sequelize.close()
})

describe('Partner testing', function () {
    describe('Register partner', function () {
        test('POST /partners/register success', async function () {
            const response = await request(app)
                .post('/partners/register')
                .send({
                    partnerName: "bengkel jaya",
                    email: "juju@pro.com",
                    password: hashPassword("rahasia"),
                    phoneNumber: "0808080808",
                    address: "Jl. Tamani",
                    imageUrl: "https://teknisimobil.com/wp-content/uploads/2018/01/Kunci-yang-Diperlukan-di-Bengkel-Mobil-3.jpg"
                })

            expect(response.status).toEqual(201)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message')
            expect(typeof response.body.message).toEqual('string')
        })
        test('POST /partners/register  failed because email is empty', async function () {
            const response = await request(app)
                .post('/partners/register')
                .send({
                    partnerName: "bengkel jaya",
                    password: hashPassword("rahasia"),
                    phoneNumber: "0808080808",
                    address: "Jl. Tamani",
                    imageUrl: "https://teknisimobil.com/wp-content/uploads/2018/01/Kunci-yang-Diperlukan-di-Bengkel-Mobil-3.jpg"
                })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg')
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /partners/register failed because password is empty', async function () {
            const response = await request(app)
                .post('/partners/register')
                .send({
                    partnerName: "bengkel jaya",
                    email: "juju@pro.com",
                    phoneNumber: "0808080808",
                    address: "Jl. Tamani",
                    imageUrl: "https://teknisimobil.com/wp-content/uploads/2018/01/Kunci-yang-Diperlukan-di-Bengkel-Mobil-3.jpg"
                })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg')
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /partners/register  failed because partnerName is required', async function () {
            const response = await request(app)
                .post('/partners/register')
                .send({
                    partnerName: "",
                    email: "",
                    password: hashPassword("rahasia"),
                    phoneNumber: "0808080808",
                    address: "Jl. Tamani",
                    imageUrl: "https://teknisimobil.com/wp-content/uploads/2018/01/Kunci-yang-Diperlukan-di-Bengkel-Mobil-3.jpg"
                })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg')
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /partners/register  failed because email is required', async function () {
            const response = await request(app)
                .post('/partners/register')
                .send({
                    partnerName: "bengkel jaya",
                    email: "juju@pro.com",
                    password: hashPassword("rahasia"),
                    phoneNumber: "0808080808",
                    address: "Jl. Tamani",
                    imageUrl: "https://teknisimobil.com/wp-content/uploads/2018/01/Kunci-yang-Diperlukan-di-Bengkel-Mobil-3.jpg"
                })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg')
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /partners/register  failed because password is required', async function () {
            const response = await request(app)
                .post('/partners/register')
                .send({
                    partnerName: "bengkel jaya",
                    email: "juju@pro.com",
                    password: hashPassword(""),
                    phoneNumber: "0808080808",
                    address: "Jl. Tamani",
                    imageUrl: "https://teknisimobil.com/wp-content/uploads/2018/01/Kunci-yang-Diperlukan-di-Bengkel-Mobil-3.jpg"
                })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg')
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /partners/register  failed because phoneNumber is required', async function () {
            const response = await request(app)
                .post('/partners/register')
                .send({
                    partnerName: "bengkel jaya",
                    email: "juju@pro.com",
                    password: hashPassword("rahasia"),
                    phoneNumber: "",
                    address: "Jl. Tamani",
                    imageUrl: "https://teknisimobil.com/wp-content/uploads/2018/01/Kunci-yang-Diperlukan-di-Bengkel-Mobil-3.jpg"
                })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg')
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /partners/register  failed because address is required', async function () {
            const response = await request(app)
                .post('/partners/register')
                .send({
                    partnerName: "bengkel jaya",
                    email: "juju@pro.com",
                    password: hashPassword("rahasia"),
                    phoneNumber: "0808080808",
                    address: "",
                    imageUrl: "https://teknisimobil.com/wp-content/uploads/2018/01/Kunci-yang-Diperlukan-di-Bengkel-Mobil-3.jpg"
                })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg')
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /partners/register  failed because imageUrl is required', async function () {
            const response = await request(app)
                .post('/partners/register')
                .send({
                    partnerName: "bengkel jaya",
                    email: "juju@pro.com",
                    password: hashPassword("rahasia"),
                    phoneNumber: "0808080808",
                    address: "Jl. Tamani",
                    imageUrl: ""
                })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg')
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /partners/register  failed because email must be unique', async function () {
            const response = await request(app)
                .post('/partners/register')
                .send({
                    partnerName: "bengkel jaya",
                    email: "juju@pro.com",
                    password: hashPassword("rahasia"),
                    phoneNumber: "0808080808",
                    address: "Jl. Tamani",
                    imageUrl: "https://teknisimobil.com/wp-content/uploads/2018/01/Kunci-yang-Diperlukan-di-Bengkel-Mobil-3.jpg"
                })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg', "email must be unique")
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /partners/register  failed because email format is incorrect', async function () {
            const response = await request(app)
                .post('/partners/register')
                .send({
                    partnerName: "bengkel jaya",
                    email: "jujupro.com",
                    password: hashPassword("rahasia"),
                    phoneNumber: "0808080808",
                    address: "Jl. Tamani",
                    imageUrl: "https://teknisimobil.com/wp-content/uploads/2018/01/Kunci-yang-Diperlukan-di-Bengkel-Mobil-3.jpg"
                })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg', "Validation isEmail on email failed")
            expect(typeof response.body.msg).toEqual('string')
        })

    })
    describe('Login testing', function () {
        test('POST /partners/login success', async function () {
            const response = await request(app)
                .post('/partners/login')
                .send({
                    email: "bengkel@pro.com",
                    password: "rahasia",
                })

            expect(response.status).toEqual(200)
            expect(typeof response.body).toEqual('object')
            expect(typeof response.body.access_token).toEqual('string')
            expect(typeof response.body.email).toEqual('string')
        })
        test('POST /partners/login failed because wrong password input', async function () {
            const response = await request(app)
                .post('/partners/login')
                .send({
                    email: "bengkel@pro.com",
                    password: "rahasiahh",
                })
            expect(response.status).toEqual(401)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message', "Invalid email/password")
            expect(typeof response.body.message).toEqual('string')
        })
        test('POST /partners/login failed because wrong email input', async function () {
            const response = await request(app)
                .post('/partners/login')
                .send({
                    email: "bengkel1@pro.com",
                    password: "rahasiahh",
                })
            expect(response.status).toEqual(401)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message', "User not found")
            expect(typeof response.body.message).toEqual('string')
        })
        test('POST /partners/login failed because email is empty', async function () {
            const response = await request(app)
                .post('/partners/login')
                .send({
                    email: "",
                    password: "rahasia",
                })
            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message', "Email and Password is required")
            expect(typeof response.body.message).toEqual('string')
        })

    })
    describe('Create Order Detail', function () {
        test('POST /partners/products success', async function () {
            const response = await request(app)
                .post('/partners/products')
                .set({
                    access_token
                })
                .send({ "productId": 1, "orderId": 1, "quantity": 3 })

            expect(response.status).toEqual(201)
            expect(typeof response.body).toEqual('object')
            expect(typeof response.body.orderId).toEqual('number')
            expect(typeof response.body.quantity).toEqual('number')
            expect(typeof response.body.productId).toEqual('number')
        })
        test('POST /partners/products failed because access token is invalid token', async function () {
            const response = await request(app)
                .post('/partners/products')
                .set({
                    // access_token
                })
                .send({ "productId": 1, "orderId": 1, "quantity": 3 })

            expect(response.status).toEqual(401)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toEqual('Invalid Token')
        })
        test('POST /partners/products failed because productId is empty', async function () {
            const response = await request(app)
                .post('/partners/products')
                .set({
                    access_token
                })
                .send({ "productId": null, "orderId": 1, "quantity": 3 })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toEqual('No products provided')
        })
    })
    describe('Read Order Detail Partner', function () {
        test('GET /partners/products/:orderId success', async function () {
            const response = await request(app)
                .get('/partners/products/1')
                .set({
                    access_token
                })
            expect(response.status).toEqual(200)
            expect(typeof response.body).toEqual('object')
            expect(typeof response.body[0].orderId).toEqual('number')
            expect(typeof response.body[0].productId).toEqual('number')
            expect(typeof response.body[0].quantity).toEqual('number')
            expect(typeof response.body[0].Product).toEqual('object')
            expect(typeof response.body[0].Product.productName).toEqual('string')
            expect(typeof response.body[0].Product.type).toEqual('string')
            expect(typeof response.body[0].Product.price).toEqual('number')
            expect(typeof response.body[0].Product.image).toEqual('string')
        })
        test('GET /partners/products/:orderId failed because access token is invalid token', async function () {
            const response = await request(app)
                .get('/partners/products/1')
                .set({
                    // access_token
                })
                .send({ "productId": 1, "orderId": 1, "quantity": 3 })

            expect(response.status).toEqual(401)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toEqual('Invalid Token')
        })
        test('GET /partners/products/:orderId failed because access token is invalid token', async function () {
            const response = await request(app)
                .get('/partners/products/1')
                .set({
                    // access_token
                })
                .send({ "productId": 1, "orderId": 1, "quantity": 3 })

            expect(response.status).toEqual(401)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toEqual('Invalid Token')
        })
        test('GET /partners/products/:orderId failed because server error', async function () {
            jest.spyOn(OrderDetail, 'findAll').mockRejectedValue('Internal Server Error')
            const response = await request(app)
                .get('/partners/products/1')
                .set({
                    access_token
                })
                .send({ "productId": 1, "orderId": 1, "quantity": 3 })

            expect(response.status).toEqual(500)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toEqual('Internal Server Error')
        })
    })
    describe('Send email partner by order Id', function () {
        test('POST /partners/send-email/:orderId success', async function () {
            const response = await request(app)
                .post('/partners/send-email/1')
                .set({
                    access_token
                })
            expect(response.status).toEqual(200)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message', "Email sent successfully")
            expect(typeof response.body.message).toEqual('string')
        })
        test('POST /partners/send-email/:orderId failed', async function () {
            const response = await request(app)
                .post('/partners/send-email/10')
                .set({
                    access_token
                })
            expect(response.status).toEqual(500)
            expect(response.body).toHaveProperty('message', "Internal Server Error")
            expect(typeof response.body.message).toEqual('string')
        })
        test('POST /partners/send-email/:orderId failed because access token is invalid token', async function () {
            const response = await request(app)
                .post('/partners/send-email/1')
                .set({
                    // access_token
                })
            expect(response.status).toEqual(401)
            expect(response.body).toHaveProperty('message', "Invalid Token")
            expect(typeof response.body.message).toEqual('string')
        })
    })
    describe('Create Order Detail', function(){
        test('POST /partners/products success', async function(){
            const response = await request(app)
            .post('/partners/products')
            .set({
                access_token
            })
            .send({"productId": 1, "orderId": 1, "quantity": 3})
           
            console.log(response.status, "<<");
            expect(response.status).toEqual(201)
        })
    })
})
