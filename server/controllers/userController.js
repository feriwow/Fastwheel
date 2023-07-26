const { comparePassword } = require('../helper/bcrypt')
const { signToken } = require('../helper/jwt')
const midtransClient = require('midtrans-client');
const { User, Order, OrderDetail, Review, Product } = require('../models')
const { sequelize } = require("../models");
const geolib = require("geolib");
const { OAuth2Client } = require('google-auth-library');

class UserController {
    static async register(req, res, next) {
        try {
            const { username, email, password, phoneNumber } = req.body
            const createUser = await User.create({
                username,
                email,
                password,
                phoneNumber
            })
            res.status(201).json({ message: `user with id ${createUser.id} and email ${createUser.email} has been created` })
            // console.log(createUser, "<<<")
        } catch (error) {
            next(error);
            console.log(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body
            console.log(req.body, 'req body login userr<<');
            if (!email || !password) {
                throw { name: "Email and Password is required" } // 401
            }
            const user = await User.findOne({ where: { email } })
            console.log(user, "userr<<");
            if (!user) {
                throw { name: "User not found" }
            }
            const isValidPassword = comparePassword(password, user.password)
            console.log(isValidPassword, "valid pass<<");
            if (!isValidPassword) {
                throw { name: "Invalid email/password" }
            }
            const access_token = signToken({
                id: user.id,
                email: user.email
            })
            // console.log(access_token, "<<<<fyfy");
            res.json({
                access_token,
                user
            })
        } catch (error) {
            next(error);
            console.log(error, "<<err");
        }
    }

    static async loginGoogle(req, res, next) {
        try {
            const googleToken = req.headers.google_token
            console.log(req.headers, "<<<<<");
            const client = new OAuth2Client(process.env.CLIENTID);
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.CLIENTID
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            const [user, created] = await User.findOrCreate({
                where: { email: payload.email },
                defaults: {
                    username: payload.name,
                    password: "deacantik",
                    phoneNumber: "12345",
                    address: "jl.dea",
                },
                hooks: false
            })
            const access_token = signToken({
                id: user.id,
                email: user.email
            })
            res.json({ access_token })

        } catch (error) {
            next(error)
            console.log(error);
        }
    }

    static async review(req, res, next) {
        try {
            // console.log(req.user.dataValues.id);
            const user = req.user.dataValues.id
            const { id } = req.params
            const { review, rating, } = req.body

            // console.log(user, id, review, rating, `<<<<<<`);

            const postReview = await Review.create({
                userId: user, partnerId: id, review, rating
            })
            res.status(200).json({ postReview })
        } catch (err) {
            // next(err)
            console.log(err);
        }
    }

    static async getReview(req, res, next) {
        try {
            const { id } = req.params
            const review = await Review.findAll({
                where: { partnerId: id }
            })

            res.status(200).json(review)
        } catch (err) {
            next(err)
        }
    }

    static async createOrder(req, res, next) {
        try {
            const userId = req.user.id
            const { lat, lng, problem, car, carType, license, partnerId } = req.body;
            // const userId = 1
            const geojson = {
                type: "Point",
                coordinates: [lng, lat],
            };
            const toString = JSON.stringify(geojson);
            const response = await Order.create({
                problem,
                location: toString,
                car,
                carType,
                userId,
                license,
                status: 'inactive',
                paymentStatus: 'unpaid',
                partnerId
            });
            console.log(response.dataValues);
            res.status(201).json(response.dataValues);
        } catch (err) {
            console.log(err, "<<<<< error");
            next(err)
        }
    }

    // static async updateProblem(req, res, next) {
    //     try {
    //         const id = req.params.orderId;
    //         const { problem, car, carType, license} = req.body
    //         const order = await Order.update({ problem, car, carType, license },
    //             { where: { id } }
    //         )
    //         res.status(200).json({ message: `order with id ${id} is created ` })
    //     } catch (error) {
    //         next(error)
    //     }
    // }

    static async updateStatus(req, res, next) {
        try {
            const id = req.params.orderId;
            const { partnerId } = req.body
            const order = await Order.update({ partnerId: partnerId, status: 'active' },
                { where: { id } }
            )
            console.log(order);
            res.status(201).json({ message: `entity with id ${id} updated ` })
        } catch (error) {
            next(error)
        }
    }

    static async addOrderDetail(req, res, next) {
        try {
            const orderId = req.params.orderId
            const { productId, quantity } = req.body
            const listOrder = await OrderDetail.create({ orderId: orderId, productId, quantity })
            console.log(listOrder, "<< ini order id controller");

            res.status(201).json(listOrder)
        } catch (error) {
            console.log(error, "<<<order detail add");
            next(error)
        }
    }

    static async getOrderDetail(req, res, next) {
        try {
            const { id } = req.params
            const response = await OrderDetail.findAll({ where: { orderId: id } })
            console.log(response, "<<< response");
            res.status(200).json(response)
        } catch (err) {
            console.log(err);
            next(err)
        }
    }

    // static async createOrder(req, res, next) {
    //     try {
    //         const { problem, lat, lng, car, carType, license } = req.body
    //         // console.log(req.body, ">>>>>>>>>>>");
    //         const geojson = {
    //             type: 'Point',
    //             coordinates: [lng, lat]
    //         };
    //         const toString = JSON.stringify(geojson)
    //         const response = await Order.create({ problem, location: toString, car, carType, userId: req.user.id, license })
    //         // console.log(response, ">>>>>>>>>>>>");
    //         res.status(201).json(response)
    //     } catch (err) {
    //         console.log(err);
    //         // next(err)
    //     }
    // }

    static async getOrderAll(req, res, next) {
        try {
            const userId = req.user.id
            const response = await Order.findAll({ where: {userId: userId} })
            console.log(response);
            res.status(200).json(response)
        } catch (err) {
            console.log(err);
        }
    }

    static async generateMidtransToken(req, res, next) {
        try {
            const { orderId } = req.params
            const findUser = await User.findByPk(req.user.id)

            let snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY,
            });

            const myProducts = await OrderDetail.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }, include: {
                    model: Product,
                },
                where: { orderId: orderId }
            })
            // res.status(201).json(myProducts[0])
            // console.log(myProducts[0], ">>>>>>>>>>>>>>>>");

            let totalPrice = 0
            for (let i = 0; i < myProducts.length; i++) {
                let price = myProducts[i].Product.price * myProducts[i].quantity
                totalPrice += price
            }
            // console.log(total);

            let items = []
            myProducts.forEach(el => {
                let obj = {}
                obj.id = el.productId
                obj.price = el.Product.price
                obj.quantity = el.quantity
                obj.name = el.Product.productName
                items.push(obj)
            });

            let parameter = {
                "payment_type": "bank_transfer",
                "transaction_details": {
                    "order_id": `${orderId} + ${Math.random()}`,
                    "gross_amount": totalPrice
                },
                "credit_card": {
                    "secure": true
                },
                "customer_details": {
                    // "first_name": "budi",
                    // "last_name": "pratama",
                    "email": findUser.email,
                    "phone": findUser.phoneNumber
                },
                "item_details": items
            };

            const midtransToken = await snap.createTransaction(parameter)
            console.log(midtransToken, ">>>>>>>>>>")
            res.status(201).json(midtransToken)

        } catch (error) {
            console.log(error);
        }
    }

    static async paymentStatus(req, res, next) {
        try {
            // console.log(req.body.transaction_status);
            const midtransRespond = req.body.transaction_status
            const id = req.body.order_id
            const totalPrice = req.body.gross_amount
            // console.log(orderId);

            if (midtransRespond === "settlement" || midtransRespond === "capture") {
                await Order.update({ paymentStatus: "isPaid", totalPrice: Number(totalPrice) }, { where: { id } })
                res.status(200).json("pembayaran berhasil")
            }

        } catch (error) {
            console.log(error);
        }
    }

    static async findStoresByRadius(req, res, next) {
        try {
            // distance on meter unit
            const distance = req.query.distance || 10000;
            const { long, lat } = req.body
            // const long = req.query.long || "-6.260576726969987";
            // const lat = req.query.lat || "106.78171420171469";

            let result = await sequelize.query(
                `select
            *
          from
            "Partners"
          where
            ST_DWithin(location,
            ST_MakePoint(:lat,
            :long),
            :distance,
          true) = true;`,
                {
                    replacements: {
                        distance: +distance,
                        long: parseFloat(long),
                        lat: parseFloat(lat),
                    },
                    logging: console.log,
                    plain: false,
                    raw: false,
                    type: sequelize.QueryTypes.SELECT,
                }
            );
            // console.log(result);

            const newResult = result.map((el) => {
                return {
                    ...el,
                    distance: geolib.getDistance(
                        { latitude: lat, longitude: long },
                        {
                            latitude: el.location.coordinates[0],
                            longitude: el.location.coordinates[1],
                        }
                    ),
                };
            });

            console.log(newResult[0].distance / 1000 + "km");
            res.status(200).json(newResult.sort((a, b) => a.distance - b.distance));
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    static async getOrder(req, res, next) {
        try {
            const { orderId } = req.params

            const order = await Order.findByPk(orderId, {
                include: {
                    model: Product
                }
            })

            res.status(200).json(order)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController