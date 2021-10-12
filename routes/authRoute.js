const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
//const auth = require('../middlewares/auth')


router.post('/register', authController.register)
router.post('/login',authController.login)
router.post('/forgot',authController.forgot)
router.put('/resetpassword',authController.resetpassword)

module.exports = router