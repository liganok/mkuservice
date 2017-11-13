import UserModel from '../models/User'
import passport from 'passport'
import auth from '../routes/auth'

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
      let user = new UserModel();
      user.email = email
      user.username = username
      user.setPassword(password)
      await user.save()
      return res.send({
        status: 200,
        message: 'sign up success'
      })
    } catch (error) {
      return res.send({
        status: 460,
        //type: 'AUTH/ERROR_PARAM',
        message: error.message
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
}

export default new User()