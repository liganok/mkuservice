import passport from 'passport'
import LocalAuth from '../models/user/LocalAuth'
import UserInfo from '../models/user/UserInfo'
import OAuth from '../models/user/OAuth'

class User {
  async login(req, res, next) {
    try {
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
        return res.send({
          status: 200,
          data: user.toAuthJSON()
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
      let userInfo = await UserInfo.create({ email: email, username: username })
      let localAuth = new LocalAuth()
      localAuth.uid = userInfo._id
      localAuth.email = email
      localAuth.setPassword(password)
      await localAuth.save()

      return res.send({
        status: 200,
        data: userInfo.toAuthJSON(),
        message: 'Sign up success'
      })
    } catch (error) {
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
          message: 'password reset success'
        });
      } else {
        return res.send({
          status: 422,
          message: info
        });
      }
    })(req, res, next);
  }

  async getUserInfo(req, res, next) {
    try {
      const id = req.payload.uid
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

  async oAuthRegister(req, res, next) {
    try {
      var { oauth_name, oauth_id, oauth_access_token, oauth_expires } = req.body.user
      if (!oauth_name) {
        throw new Error('oAuth name is black')
      }
      if (!oauth_id) {
        throw new Error('oAuth id is black')
      }
      if (!oauth_access_token) {
        throw new Error('Access token is black')
      }
      if (!oauth_expires) {
        throw new Error('Expires is black')
      }
    } catch (error) {
      return res.send({
        status: 460,
        type: 'AUTH/ERROR_PARAM',
        message: error.message
      })
    }

    try {
      let oAuth = await OAuth.findOne({ oauth_name: oauth_name, oauth_id: oauth_id })
      let userInfo
      let oAuthUserInfo = await getOAuthUserInfo(oauth_name, oauth_access_token)
      if (oAuth) {
        oAuth.oauth_access_token = oauth_access_token
        oAuth.oauth_expires = oauth_expires
        await oAuth.save()
        userInfo = await UserInfo.findById(oAuth.uid)
      } else {
        userInfo = new UserInfo({
          auth_type: 'O',
          username: oAuthUserInfo.username,
          mobile: oAuthUserInfo.mobile,
          email: oAuthUserInfo.email
        }).save()

        let newOAuth = new oAuth({
          uid:userInfo._id,
          oauth_name: oauth_name,
          oauth_id: oauth_id,
          oauth_access_token:oauth_access_token,
          oauth_expires:oauth_expires
        }).save()
      }

      return res.send({
        status: 200,
        data: userInfo.toAuthJSON(),
        message: 'Sign up success'
      })
    } catch (error) {
      return res.send({
        status: 460,
        message: error
      })
    }
  }

  async getOAuthUserInfo(type,token){
    return {}
  }

}

export default new User()