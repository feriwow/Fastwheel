const { comparePassword } = require('../helper/bcrypt')
const { signToken } = require('../helper/jwt')

const { Product, OrderDetail, User, Order, Partner } = require("../models")
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const inlineCss = require('inline-css');
const fs = require('fs');
const ejs = require('ejs');

class PartControllers {
    static async register(req, res, next) {
        try {
            const { partnerName, email, password, phoneNumber, address, imageUrl } = req.body
            const createPartner = await Partner.create({
                partnerName,
                email,
                password,
                phoneNumber,
                address,
                imageUrl
            })
            res.status(201).json({ message: `user with id ${createPartner.id} and email ${createPartner.partnerName} has been created` })
            // console.log(createUser, "<<<")
        } catch (error) {
            next(error);
            // console.log(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body
            console.log(req.body, 'req body login userr<<');
            if (!email || !password) {
                throw { name: "Email and Password is required"} // 401
            }
            const user = await Partner.findOne({ where: { email } })
            // console.log(user, "userr<<");
            if (!user) {
                throw{ name: "User not found"}
            }
            const isValidPassword = comparePassword(password, user.password)
            console.log(isValidPassword, "valid pass<<");
            if (!isValidPassword) {
                throw{ name: "Invalid email/password"}
            }
            const access_token = signToken({
                id: user.id,
                email: user.email
            })
            // console.log(user.dataValues.location, "<<<<fyfy");
            // const userPassword = user.dataValues.password
            const userData = user.dataValues
            delete userData.password
            console.log(userData, "ini inputannya ><><><><");
            res.json({
                access_token,
                email,
                userData
            })
        } catch (error) {
            next(error);
            // console.log(error, "<<err");
        }
    }

    // static async loginGoogle(req, res, next) {
    //     try {
    //         const googleToken = req.headers.google_token
    //         console.log(req.headers, "<<<<<");
    //         const client = new OAuth2Client(process.env.CLIENTID);
    //         const ticket = await client.verifyIdToken({
    //           idToken: googleToken,
    //           audience: process.env.CLIENTID
    //         });
    //         const payload = ticket.getPayload();
    //         const userid = payload['sub'];
    //         const [user, created] = await User.findOrCreate({
    //           where: { email: payload.email },
    //           defaults: {
    //             username: payload.name,
    //             password: "deacantik",
    //             phoneNumber: "12345",
    //             address: "jl.dea",
    //           },
    //           hooks: false
    //         })
    //         const access_token = signToken({
    //           id: user.id,
    //           email: user.email
    //         })
    //         res.json({ access_token })
    //     } catch (error) {
    //         next(error);
    //         console.log(error);
    //     }
    // }

    static async createOrderDetail(req, res, next) {
        try {

            const { orderId, productId, quantity } = req.body;
            console.log(req.body, "<<reqboday");
            if (!productId) {
                throw{ name: "No products provided"}
            }
            const orderDetail = await OrderDetail.create({orderId,quantity,productId});
          
            res.status(201).json(orderDetail);
          } catch (error) {
            next(error)
          }
          

    }

    static async readOrderDetail(req, res, next) {
        try {
            const { orderId } = req.params
            const myProducts = await OrderDetail.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }, include: {
                    model: Product,
                    attributes: {
                        exclude: ['id', 'createdAt', 'updatedAt']
                    }
                },
                where: { orderId: orderId }
            })
            res.status(200).json(myProducts)

        } catch (error) {
            next(error) //
            // res.status(500).json({ message: "Internal server error" })
        }
    }

    static async sendEmail(req, res, next) {
        try {

            const htmlContent = fs.readFileSync('invoice.ejs', 'utf-8');
            const { orderId } = req.params
            const myProducts = await OrderDetail.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }, include: ['Product', 'Order'],

                where: { orderId: orderId }
            })
            // console.log(myProducts, "<<< email send partner");
            let totalPrice = 0
            for (let i = 0; i < myProducts.length; i++) {
                let price = myProducts[i].Product.price * myProducts[i].quantity
                totalPrice += price
                console.log(myProducts[i].Product?.price, "<<<<<>>>HUHIU");
            }

            // res.json(myProducts)
            const id = req.params.orderId
            const order = await Order.findAll({
                include: ['User'],
                where: { id }
            })
            // res.json(order)

            const findPartner = await Partner.findByPk(req.partner.id)
            // console.log(findPartner);

            const renderedTemplate = ejs.render(htmlContent, { myProducts, order, findPartner, totalPrice });

            const inlineHtml = await inlineCss(renderedTemplate, {
                url: 'file://path/to/bootstrap.min.css'
            });

            async function convertHtmlToImage(renderedTemplate) {
                const browser = await puppeteer.launch({ headless: 'new' });
                const page = await browser.newPage();
                await page.setContent(renderedTemplate, { waitUntil: 'networkidle0' });
                await page.setViewport({ width: 800, height: 600 });
                const screenshot = await page.screenshot({ type: 'png', fullPage: true });
                await browser.close();
                return screenshot;
            }

            async function convertImageToPdf(imageBuffer) {
                const browser = await puppeteer.launch({ headless: 'new' });
                const page = await browser.newPage();

                await page.setContent(`<img src="data:image/png;base64,${imageBuffer.toString('base64')}">`, {
                    waitUntil: 'networkidle0',
                });

                const pdfBuffer = await page.pdf({
                    format: 'A3',
                    margin: {
                        top: "30px",
                        bottom: "20px",
                        left: "150px",
                    },
                    printBackground: true,
                });
                await browser.close();
                return pdfBuffer;
            }

            const imageBuffer = await convertHtmlToImage(renderedTemplate);
            const pdfBuffer = await convertImageToPdf(imageBuffer);

            async function sendEmailWithAttachment(pdfBuffer) {
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'fastwheel007official@gmail.com',
                        pass: 'zalyvjzqlhawrlmh',
                    },
                })

                const mailOptions = {
                    from: 'fastwheel007official@gmail.com',
                    to: order[0].User.email,
                    subject: "Terima kasih atas pembayaran Anda - Fast007 - " + "TRANSACTION_" + "24007" + myProducts[0].orderId,
                    text: 'This is the plain text body of the email',
                    html: inlineHtml,
                    attachments: [
                        {
                            filename: "INV" + "-" + "TRANSACTION_" + "24007" + myProducts[0].orderId + ".pdf" ,
                            content: pdfBuffer,
                            contentType: 'application/pdf',
                        },
                    ],
                };

                await transporter.sendMail(mailOptions);
            }

            await sendEmailWithAttachment(pdfBuffer);

            res.status(200).json({ message: 'Email sent successfully' });

        } catch (error) {
            next(error)
            // console.error(error);
            // res.status(500).send('Failed to generate PDF and send email.');
        }
    }

    static async getAllorder(req, res, next){
        try {
            const partnerId = req.partner.id
            const response = await Order.findAll({where: {id: partnerId}})
            console.log(response);
            res.status(200).json(response)
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = PartControllers