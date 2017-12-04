import passport from 'passport'
import axios from 'axios'

import LocalAuth from '../models/user/LocalAuth'
import UserInfo from '../models/user/UserInfo'
import OAuth from '../models/user/OAuth'

class User {
  constructor() {
    this.oAuthRegister = this.oAuthRegister.bind(this)

  }
  async login(req, res, next) {
    try {
      let { email, password } = req.body.user
      if (!email) {
        throw new Error('Email is black')
      }
      if (!password) {
        throw new Error('Password is black')
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
          message: info.errors
        });
      }
    })(req, res, next);
  }

  async register(req, res, next) {
    try {
      var { email, password, username } = req.body.user
      if (!email) {
        throw new Error('Email is black')
      }
      if (!password) {
        throw new Error('Password is black')
      }
      if (!username) {
        throw new Error('Username is black')
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
        message: 'Email is invailid'
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
      var { oauth_name, oauth_access_token, oauth_expires } = req.body.user
      if (!oauth_name) {
        throw new Error('oAuth name is black')
      }
      if (!oauth_access_token) {
        throw new Error('Access token is black')
      }
    } catch (error) {
      return res.send({
        status: 460,
        type: 'AUTH/ERROR_PARAM',
        message: error.message
      })
    }

    try {
      let oAuthUserInfo = await this.getOAuthUserInfo(oauth_name, oauth_access_token)
      //console.log(oAuthUserInfo)

      let oAuth = await OAuth.findOne({ oauth_name: oAuthUserInfo.oauth_name, oauth_id: oAuthUserInfo.oauth_id })
      console.log(oAuth)
      let userInfo

      if (oAuth) {
        oAuth.oauth_access_token = oauth_access_token
        oAuth.oauth_expires = oauth_expires
        await oAuth.save()
        userInfo = await UserInfo.findById(oAuth.uid)
        userInfo.username = oAuthUserInfo.username
        userInfo.email = oAuthUserInfo.email
        userInfo.image = oAuthUserInfo.image
        await userInfo.save()
      } else {
        userInfo = await new UserInfo({
          auth_type: 'O',
          username: oAuthUserInfo.username,
          image: oAuthUserInfo.image,
          email: oAuthUserInfo.email
        }).save()

        await OAuth.create({
          uid:userInfo._id,
          oauth_name: oAuthUserInfo.oauth_name,
          oauth_id: oAuthUserInfo.oauth_id,
          oauth_access_token:oauth_access_token,
          oauth_expires:oauth_expires
        })
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
    let targetURL = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
    try {
      let res = await axios.get(targetURL)
      let userInfo = res.data
      return {
        oauth_name: type,
        oauth_id: userInfo.id,
        oauth_access_token: token,
        username: userInfo.name,
        email: userInfo.email,
        image: userInfo.picture,
        gender: userInfo.gender
      }
    } catch (error) {
      return {
        oauth_name: type,
        oauth_id: 'id123',
        oauth_access_token: token,
        username: 'ligan',
        email: 'liganok86@xx.com',
        image: '',
        gender: 'male'
      }
    }
  }

}

export default new User()