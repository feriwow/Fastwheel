require('dotenv').config()
var cors = require('cors')
const express = require('express')
const router = require('./routes');
const app = express()
const partRoute = require('./routes/partRoute')
const userRoute = require('./routes/userRoute');
const errorHandle = require('./middleware/errorHandler');
/*  */

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(router)
router.use(errorHandle)

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

module.exports = app;
