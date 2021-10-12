require ('dotenv').config();
const mongoose = require('mongoose');

// Database connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
 .then((result) => {
     console.log('Database connected.')
  }).catch((err) => {
     console.log(`Connection failed ${err}`)
 })


module.exports = mongoose;