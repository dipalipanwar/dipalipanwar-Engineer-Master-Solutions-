const mongoose = require('mongoose')

//Create schema
const userSchema = new mongoose.Schema({

    email : { 
        type: String, 
        require: true 
    },

    mobile_no: { 
        type: Number , 
        require: true 
    },

    password: { 
        type: String, 
        require: true 
    }},
    { 
        timestamps: true 
   });



module.exports = mongoose.model('User',userSchema)