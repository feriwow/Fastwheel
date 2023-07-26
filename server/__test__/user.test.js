const { describe, test, expect } = require('@jest/globals')
const request = require('supertest')
const app = require('../app')
const models = require('../models')
const bulkInsertCust = require('../helper/UserBulkInsert')
const { hashPassword } = require('../helper/bcrypt')
const { signToken } = require('../helper/jwt')
// const models = require('../models')
let access_token = ""
beforeAll(async function () {
    console.log("TEST<<<")
try {
    const user = await bulkInsertCust()
    console.log(user, "<-----")
    access_token = signToken({
        id: user.id,
        email: user.email
    }) 
} catch (err) {
    console.log(err,"<--");
}
   
})
afterAll(async function () {
    await models.sequelize.close()
})
describe('User testing', function () {
    describe('Register user', function () {
        test('POST /users/register success', async function () {
            const response = await request(app)
                .post('/users/register')
                .send({ username: "deaimut", email: "justin@gmail.com", password: "inidea", phoneNumber: "081122333" })

            console.log(response.body, "<<<<<<");
            expect(response.status).toEqual(201)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message')
            expect(typeof response.body.message).toEqual('string')
        })
        test('POST /users/register failed because email is empty', async function () {
            const response = await request(app)
                .post('/users/register')
                .send({ username: "deaimut", password: "inidea", phoneNumber: "081122333" })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg')
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /users/registerfailed because password is empty', async function () {
            const response = await request(app)
                .post('/users/register')
                .send({ username: "deaimut", email: "justin@gmail.com", password: hashPassword(""), phoneNumber: "081122333" })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg')
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /users/register failed because email is required', async function () {
            const response = await request(app)
                .post('/users/register')
                .send({ username: "deaimut", email: "", password: "inidea", phoneNumber: "081122333" })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg')
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /users/register failed because password is required', async function () {
            const response = await request(app)
                .post('/users/register')
                .send({ username: "deaimut", email: "justin@gmail.com", phoneNumber: "081122333" })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg')
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /users/register failed because email must be unique', async function () {
            const response = await request(app)
                .post('/users/register')
                .send({ username: "deaimut", email: "justin@gmail.com", password: "inidea", phoneNumber: "081122333" })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg', "email must be unique")
            expect(typeof response.body.msg).toEqual('string')
        })
        test('POST /users/register failed because email format is incorrect', async function () {
            const response = await request(app)
                .post('/users/register')

                .send({ username: "deaimut", email: "justingmail.com", password: "inidea", phoneNumber: "081122333" })

            expect(response.status).toEqual(400)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('msg', "Validation isEmail on email failed")
            expect(typeof response.body.msg).toEqual('string')
        })
    })
    describe('Login testing', function () {
        console.log(access_token,"+++");
        test('POST /users/login success', async function () {
            const response = await request(app)
                .post('/users/login')
                .send({ email: "deacantik@gmail.com", password: "inidea" })

            expect(response.status).toEqual(200)
            console.log(response.body, "access tokennnnnn niii<<<<");
            expect(typeof response.body).toEqual('object')
            expect(typeof response.body.access_token).toEqual('string')
            expect(typeof response.body.email).toEqual('string')
        })
        test('POST /users/login failed because wrong password input', async function () {
            const response = await request(app)
                .post('/users/login')
                .send({ email: "deacantik@gmail.com", password: "inidepp" })

            expect(response.status).toEqual(401)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message', "InvalidToken")
            expect(typeof response.body.message).toEqual('string')
        })
        test('POST /users/login failed because wrong email input', async function () {
            const response = await request(app)
                .post('/users/login')
                .send({ email: "kambing@gmail.com", password: "inidea" })

            expect(response.status).toEqual(401)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message', "InvalidToken")
            expect(typeof response.body.message).toEqual('string')
        })
    })
    describe('User Order', function () {
        test('POST /users/order success', async function () {
            const response = await request(app)
                .post('/users/order')
                .set({
                    access_token
                })
                .send({
                    problem: "ban muter", lat: "-6.940669415817259", lng: "107.5925576773082", car: "BMW", carType: "sedan", license: "B 232 EE"
                })
            console.log(access_token, "<<<<<<< access tokennn");
            expect(response.status).toEqual(201)
            console.log(response.body, "niii<<<<");
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message')
            expect(typeof response.body.message).toEqual('string')
        })
     
        

        // test('POST /users/order fail create because Car is require', async function(){
        //     const response = await request(app)
        //     .post('/users/order')
        //     .set({
        //         access_token
        //     })
        //     .send({
        //         problem: "ban muter", lat: "-6.940669415817259",lng: "107.5925576773082", car: "", carType: "sedan", license: "B 232 EE" 
        //     })
        //     expect(response.status).toEqual(400)
        //     expect(typeof response.body).toEqual('object')
        //     expect(response.body).toHaveProperty('msg', "Car is require")
        //     expect(typeof response.body.msg).toEqual('string')
        // })
        // test('POST /users/order fail create because Car is require', async function(){
        //     const response = await request(app)
        //     .post('/users/order')
        //     .set({
        //         access_token
        //     })
        //     .send({
        //         problem: "ban muter", lat: "-6.940669415817259",lng: "107.5925576773082", car: "BMW", carType: "", license: "B 232 EE" 
        //     })
        //     expect(response.status).toEqual(400)
        //     expect(typeof response.body).toEqual('object')
        //     expect(response.body).toHaveProperty('msg', "car Type is require")
        //     expect(typeof response.body.msg).toEqual('string')
        // })
        // test('POST /users/order fail create because License is require', async function(){
        //     const response = await request(app)
        //     .post('/users/order')
        //     .set({
        //         access_token
        //     })
        //     .send({
        //         problem: "ban muter", lat: "-6.940669415817259",lng: "107.5925576773082", car: "BMW", carType: "bus", license: "" 
        //     })
        //     expect(response.status).toEqual(400)
        //     expect(typeof response.body).toEqual('object')
        //     expect(response.body).toHaveProperty('msg', "license is require")
        //     expect(typeof response.body.msg).toEqual('string')
        // })
    })
    describe('Get User detail by id', function () {
        test('GET /users/detail/:id success', async function () {
            const response = await request(app)
                .get('/users/detail/1')
                .set({
                    access_token
                })
            // .send({})

            expect(response.status).toEqual(200)
            expect(typeof response.body).toEqual('object')
            console.log(response.body, "niii detail id<<<<");

            // expect(response.body.id).toHaveProperty('string')
            // expect(typeof response.body.message).toEqual('string')

        })
        test('GET /users/detail/:id failed because access token is invalid', async function () {
            const response = await request(app)
                .get('/users/detail/1')
                .set({
                    // access_token
                })
            // .send({})
            expect(response.status).toEqual(401)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message', "invalid token")
            expect(typeof response.body.message).toEqual('string')
            console.log(response.body.message, "<<message");
        })
    })
    describe('Post User review by Id', function () {
        test('POST /users/review/:id success', async function () {
            const response = await request(app)
                .post('/users/review/1')
                .set({
                    access_token
                })

            expect(response.status).toEqual(200)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('postReview')
            expect(typeof response.body.postReview).toEqual("object")
            expect(typeof response.body.postReview.id).toEqual('number')
            expect(typeof response.body.postReview.userId).toEqual('number')
            expect(typeof response.body.postReview.partnerId).toEqual('number')
            expect(typeof response.body.postReview.review).toEqual('object')
            expect(typeof response.body.postReview.rating).toEqual('object')
            console.log(response.c, "<< post reveiw");
        })
        test('POST /users/review/:id failed because access token is invalid', async function () {
            const response = await request(app)
                .post('/users/review/1')
                .set({
                    // access_token
                })
            // .send({})
            expect(response.status).toEqual(401)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message', "invalid token")
            expect(typeof response.body.message).toEqual('string')
            console.log(response.body.message, "<<message");
        })
        test('GET /users/review/:id success', async function () {
            const response = await request(app)
                .get('/users/review/1')
                .set({
                    access_token
                })
            expect(response.status).toEqual(200)
            expect(typeof response.body[0]).toEqual('object')
            expect(typeof response.body[0].id).toEqual('number')
            expect(typeof response.body[0].userId).toEqual('number')
            expect(typeof response.body[0].partnerId).toEqual('number')
            expect(typeof response.body[0].review).toEqual('object')
            expect(typeof response.body[0].rating).toEqual('object')
        })
        test('GET /users/review/:id success', async function () {
            const response = await request(app)
                .get('/users/review/1')
                .set({
                    // access_token
                })
            expect(response.status).toEqual(401)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message', "invalid token")
            expect(typeof response.body.message).toEqual('string')
        })
    })

    describe('PUT User order update order', function(){
        test('PUT /users/order/:orderId success', async function () {
            const response = await request(app)
                .put('/users/order/3')
                .set({
                    access_token
                })
                .send({
                    problem: "ini masalah",
                    car: "BMW",
                    carType: "brum-brum",
                    license: "B 202 WOW"
                })

            expect(response.status).toEqual(200)
            expect(typeof response.body).toEqual('object')
            expect(response.body).toHaveProperty('message')
            expect(typeof response.body.message).toEqual('string')
            // expect(typeof response.body.postReview).toEqual("object")
            // expect(typeof response.body.postReview.id).toEqual('number')
            // expect(typeof response.body.postReview.userId).toEqual('number')
            // expect(typeof response.body.postReview.partnerId).toEqual('number')
            // expect(typeof response.body.postReview.review).toEqual('object')
            // expect(typeof response.body.postReview.rating).toEqual('object')
            console.log(response.c, "<< post reveiw");
        })
        test('PUT /users/order/:orderId failed because problem column not filled', async function () {
            const response = await request(app)
                .put('/users/order/3')
                .set({
                    access_token
                })
                .send({
                    problem: "",
                    car: "BMW",
                    carType: "brum-brum",
                    license: "B 202 WOW"
                })

                expect(response.status).toEqual(400)
                expect(typeof response.body).toEqual('object')
                expect(response.body).toHaveProperty('msg')
                expect(typeof response.body.msg).toEqual('string')
            console.log(response.c, "<< post reveiw");
        })
        test('PUT /users/order/:orderId failed because car column not filled', async function () {
            const response = await request(app)
                .put('/users/order/3')
                .set({
                    access_token
                })
                .send({
                    problem: "ada masalah",
                    car: "",
                    carType: "brum-brum",
                    license: "B 202 WOW"
                })

                expect(response.status).toEqual(400)
                expect(typeof response.body).toEqual('object')
                expect(response.body).toHaveProperty('msg')
                expect(typeof response.body.msg).toEqual('string')
            console.log(response.c, "<< post reveiw");
        })
        test('PUT /users/order/:orderId failed because carType column not filled', async function () {
            const response = await request(app)
                .put('/users/order/3')
                .set({
                    access_token
                })
                .send({
                    problem: "ada masalah",
                    car: "BMW",
                    carType: "",
                    license: "B 202 WOW"
                })

                expect(response.status).toEqual(400)
                expect(typeof response.body).toEqual('object')
                expect(response.body).toHaveProperty('msg')
                expect(typeof response.body.msg).toEqual('string')
            console.log(response.c, "<< post reveiw");
        })
        test('PUT /users/order/:orderId failed because license column not filled', async function () {
            const response = await request(app)
                .put('/users/order/3')
                .set({
                    access_token
                })
                .send({
                    problem: "ada masalah",
                    car: "BMW",
                    carType: "brum-brum",
                    license: ""
                })

                expect(response.status).toEqual(400)
                expect(typeof response.body).toEqual('object')
                expect(response.body).toHaveProperty('msg')
                expect(typeof response.body.msg).toEqual('string')
            console.log(response.c, "<< post reveiw");
        })


    })

    describe('PUT User order status by order id', function(){
        test('PUT /users/order/status/:orderId success', async function(){
            const response = await request(app)
            .put('/users/order/status/9')
            .set({
                access_token
            })
            
            expect(response.status).toEqual(201)
            expect(typeof response.body). toEqual('object')
            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toEqual('entity with id 9 updated ')

        })
        test('PUT /users/order/status/:orderId failed because access token is Invalidtoken', async function(){
            const response = await request(app)
            .put('/users/order/status/9')
            .set({
                // access_token
            })
            
            expect(response.status).toEqual(401)
            expect(typeof response.body). toEqual('object')
            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toEqual('invalid token')

        })
    })
    describe('GET User order detail by order id', function(){
        test('GET /users/order/detail/:orderId success', async function(){
            const response = await request(app)
            .get('/users/order/detail/1')
            .set({
                access_token
            })
            expect(response.status).toEqual(200)
            expect(typeof response.body). toEqual('object')
            expect(typeof response.body.id).toEqual('number')
            expect(typeof response.body.problem).toEqual('string')
            expect(typeof response.body.location).toEqual('object')
            expect(typeof response.body.totalPrice).toEqual('number')
            expect(typeof response.body.status).toEqual('string')
            expect(typeof response.body.car).toEqual('string')
            expect(typeof response.body.carType).toEqual('string')
            // expect(typeof response.body.lisence).toEqual('string')
            expect(typeof response.body.userId).toEqual('number')
        })
        test('GET /users/order/detail/:orderId failed because access token is Invalidtoken', async function(){
            const response = await request(app)
            .put('/users/order/detail/1')
            .set({
                // access_token
            })
            expect(response.status).toEqual(401)
            expect(typeof response.body). toEqual('object')
            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toEqual('invalid token')
        })
    })
    describe('POST User order detail by order id', function(){
        test('POST /users/order/detail/:orderId success', async function(){
            const response = await request(app)
            .post('/users/order/detail/1')
            .set({
                access_token
            })
            .send({productId: 1, quantity: 2})

            expect(response.status).toEqual(201)
        })
        test('POST /users/order/detail/:orderId failed because product id is missing', async function(){
            const response = await request(app)
            .post('/users/order/detail/10')
            .set({
                access_token
            })
            .send({productId: "", quantity: 2})
            expect(response.status).toEqual(400)
            expect(typeof response.body). toEqual('object')
            expect(response.body).toHaveProperty('msg')
        })
        test('POST /users/order/detail/:orderId failed because quantity is missing', async function(){
            const response = await request(app)
            .post('/users/order/detail/10')
            .set({
                access_token
            })
            .send({productId: 1, quantity: ""})
            expect(response.status).toEqual(400)
            expect(typeof response.body). toEqual('object')
            expect(response.body).toHaveProperty('msg')
        })
        test('POST /users/order/detail/:orderId failed because acess token is invalid', async function(){
            const response = await request(app)
            .post('/users/order/detail/10')
            .set({
                // access_token
            })
            .send({productId: 1, quantity: ""})

            expect(response.status).toEqual(401)
            expect(typeof response.body). toEqual('object')
            expect(response.body).toHaveProperty('message')
            expect(response.body.message).toEqual('invalid token')
        })
    })
})
