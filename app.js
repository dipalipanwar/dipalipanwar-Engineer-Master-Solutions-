const express = require('express')
const app = express()
const authRoute = require("./routes/authRoute") 


//express middleware
app.use(express.json()) 
app.use(express.urlencoded({
    extended: true,
  })
) 

app.use(authRoute) 

//database
require('./config/db')


PORT = process.env.PORT || 8000

//Create a server
app.listen(PORT, () => {
    console.log(`server is listen on port ${PORT}`)
})