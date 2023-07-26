const app = require("./app")

const PORT = process.env.PORT || 3000
app.listen(PORT,()=> console.log(`i love u ${PORT}`))