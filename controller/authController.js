const Usermodel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const sgMail = require('@sendgrid/mail')
const joi = require("joi")


//User Register Api
async function register(req,res) {
  try{
    const register = joi.object({
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required(),
        mobile_no: joi.number().required(),

      })
      const { error } = register.validate(req.body)
      if (error) {
        return res.status(422).send({ Message: error.details[0].message })
      }
  
    const { email, mobile_no, password } = req.body

    const find_user = await Usermodel.findOne({
        email: email
    })
    if(find_user){
       return res.status(422).send({Message:'User is already registered'}) 
    }
 
     const salt = bcrypt.genSaltSync(10) 
     const hash = bcrypt.hashSync(password, salt) 
 
    const user = new Usermodel ({
        email, 
        mobile_no, 
        password: hash
    })
    user.save()
    return res.status(200).send({Message: 'User registered successfully'})

  }catch(e){
    console.log(e)
    return res.status(500).send({Message: `Something went wrong ${e}`})
  }
  
}


//Login Api
async function login(req,res) {
try{
    const login = joi.object({
    email: joi.string().email(),
    password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required(),
    mobile_no: joi.number(),
  })
  const { error } = login.validate(req.body)
  if (error) {
    return res.status(422).send({ Message: error.details[0].message })
  }

    const { email, mobile_no, password } = req.body

    const login_user = await Usermodel.findOne({
     
        $or: [{
          "email": email
        }, {
          "mobile_no": mobile_no
        },]
    })
    console.log(login_user)

    if(!login_user){  
       return res.status(422).send({Message:'User not found'})
    }

    const compare = bcrypt.compareSync(password, login_user.password)
    if (!compare) {
       return res.status(422).send({ Message: 'Please enter valid password.' })
    }

    const token = jwt.sign({ id: login_user.id, email: login_user.email }, process.env.JWT_SECRET, { expiresIn: '20m' })
     return res.status(200).send({ Message: 'User login successfully.' , Token: token  })

    }catch(e){
    console.log(e)
    return res.status(500).send({Message: `Something went wrong ${e}`})
}
}


//Forgot password Api
async function forgot(req, res){
    try{
       const forgot = joi.object({
        email: joi.string().email().required()
    })
    const {error} = forgot.validate(req.body)
        if(error){
          return res.status(422).send({Message: error.details[0].message})
        }
    
        const {email} = req.body;
        const find_user = await Usermodel.findOne({ email })

    if(!find_user){
    return res.status(422).send({Message: 'User with email does not exists'})
    }
    
const token = jwt.sign({ id:find_user.id, email:find_user.email }, process.env.JWT_RESET_PASSWORD_SECRET, { expiresIn: '20m' })

const verify_url = `${process.env.CLIENT_URL}/resetpassword/${token}`
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email,
      from: 'dipalisinghpanwar@gmail.com',
      subject: 'Reset your Password',
      html: `<h2>Click the button below to reset your password.</h2><br><a href=${verify_url}>Click here to reset your password.</a>`
    }
    sgMail
      .send(msg)
      .then(() => {
        return res.status(200).send({ Message: 'Email has been sent. Please reset your password.' })
      })
      .catch((e) => {
        console.log(e)
        return res.status(500).send({ Message: 'Invalid email address.' })
      })


    }catch(e){
        console.log(e)
        return res.status(500).send({Message: `Something went wrong ${e}`})
    }
}



//Reset password Api
async function resetpassword(req, res){
    try{
        const resetpassword = joi.object({
            new_password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required(),
            confpassword: joi.ref('new_password'),
            email: joi.string().email().required()
        })
        const {error} = resetpassword.validate(req.body)
        if(error){
            return res.status(422).send({Message: error.details[0].message})
        }
        const {new_password , confpassword, email} = req.body

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(new_password, salt);
    
        await Usermodel.findOneAndUpdate({email:email},
            { password:hash })
    
    return res.status(200).send({Messsage:'Password updated successfully.' })  

    }catch(e){
      console.log(e)
     return res.status(500).send({Message:'Something went wrong'})
    }
}


module.exports = {
    register,
    login,
    forgot,
    resetpassword
}