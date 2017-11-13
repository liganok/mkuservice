import passport from'passport'
import UserModel from '../../models/User'
import auth from '../auth'
import User from '../../controller/User'
let router = require('express').Router()

router.post('/login', User.login)
router.post('/register', User.register)
router.put('/resetpassword', User.resetPassword)

module.exports = router;
