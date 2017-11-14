import passport from 'passport'
import LocalAuth from '../models/user/LocalAuth'
import UserInfo from '../models/user/UserInfo'
import OAuth from '../models/user/OAuth'

class User {
  async login(req, res, next) {
    try {
      console.log(req.body, req.query)
      let { email, password } = req.body.user
      if (!email) {
        throw new Error('email is black')
      }
      if (!password) {
        throw new Error('password is black')
      }
    } catch (error) {
      return res.send({
        status: 460,
        type: 'AUTH/ERROR_PARAM',
        message: error.message
      })
    }

    passport.authenticate('local', { session: false }, function (err, user, info) {
      if (err) { return next(err); }

      if (user) {
        user.token = user.generateJWT();
        console.log('auth passed');
        return res.send({
          status: 200,
          user: user.toAuthJSON()
        });
      } else {
        return res.send({
          status: 422,
          message: info
        });
      }
    })(req, res, next);
  }

  async register(req, res, next) {
    try {
      var { email, password, username } = req.body.user
      if (!email) {
        throw new Error('email is black')
      }
      if (!password) {
        throw new Error('password is black')
      }
      if (!username) {
        throw new Error('username is black')
      }
    } catch (error) {
      return res.send({
        status: 460,
        type: 'AUTH/ERROR_PARAM',
        message: error.message
      })
    }

    try {
      let userInfo = await UserInfo.create({email:email,username:username})
      let localAuth = new LocalAuth()
      localAuth.uid = userInfo._id
      localAuth.email = email
      localAuth.setPassword(password)
      await localAuth.save()

      return res.send({
        status: 200,
        data: Object.assign(userInfo.toJSON(), localAuth.toAuthJSON()),
        message: 'sign up success'
      })
    } catch (error) {
      console.log(error)

      return res.send({
        status: 460,
        message: error
      })
    }
  }

  async resetPassword(req, res, next) {
    try {
      var { newPassword, password, email } = req.body.user
      if (!email) {
        throw new Error('email is black')
      }
      if (!password) {
        throw new Error('password is black')
      }
      if (!newPassword) {
        throw new Error('newPassword is black')
      }
    } catch (error) {
      return res.send({
        status: 460,
        type: 'AUTH/ERROR_PARAM',
        message: error.message
      })
    }

    passport.authenticate('local', { session: false }, async function (err, user, info) {
      if (err) { return next(err); }

      if (user) {
        user.setPassword(newPassword)
        user = await user.save()
        return res.send({
          status: 200,
          user: user.toAuthJSON(),
          message:'password reset success'
        });
      } else {
        return res.send({
          status: 422,
          message: info
        });
      }
    })(req, res, next);
  }

  async getUserInfo(req, res, next){
    try {
      const id = req.params.id
      if (!id) { throw new Error('user not found') }
      let userInfo = await UserInfo.findById(id)
      res.send({
        status: 200,
        data: userInfo.toJSON(),
      })
    } catch (error) {
      res.send({
        status: 400,
        message: error.message
      })
    }
  }
}

export default new User()