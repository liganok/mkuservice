import auth from '../auth'
import User from '../../controller/User'
let router = require('express').Router()

router.post('/login', User.login)
router.post('/register', User.register)
router.post('/oauthregister', User.register)
router.put('/resetpassword', User.resetPassword)
router.get('/userInfo',auth.required, User.getUserInfo)

module.exports = router;
