var mongoose = require('mongoose')
var router = require('express').Router()
var passport = require('passport')
let User = mongoose.model('User')
let Agenda = mongoose.model('Agenda')
var auth = require('../auth')
import deepSave from '../../utils/deepSave'

router.param('agenda', function (req, res, next, id) {
  if (id === 'template') {return next()}
  Agenda.findOne({_id: id})
    .populate({
      path: 'subItems',
      populate: {
        path: 'subItems',
        populate: {
          path: 'subItems',
          populate: {
            path: 'subItems',
            populate: {
              path: 'subItems'
            }
          }
        }
      }
    })
    .then(function (agenda) {
      if (!agenda) {
        return res.sendStatus(404)
      }
      req.agenda = agenda[0]
      return next()
    }).catch(next)
})

router.post('/', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401)
    }

    let agenda = req.body.agenda
    agenda.isRoot = true
    if (agenda) {
      agenda.user = req.payload.id
      deepSave(req.body.agenda).then(data => {
        agenda = data
        return res.json(agenda)
      })
    } else {
      return res.sendStatus(401)
    }

  }).catch(next)
})

router.put('/:agenda', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (req.agenda.user.toString() === req.payload.id.toString()) {
      if (typeof req.body.agenda.name !== 'undefined') {
        req.agenda.name = req.body.agenda.name
      }

      if (typeof req.body.agenda.startAt !== 'undefined') {
        req.agenda.startAt = req.body.agenda.startAt
      }

      if (typeof req.body.agenda.duration !== 'undefined') {
        req.agenda.duration = req.body.agenda.duration
      }

      if (typeof req.body.agenda.sequence !== 'undefined') {
        req.agenda.sequence = req.body.agenda.sequence
      }

      if (typeof req.body.agenda.subItems !== 'undefined') {
        req.agenda.subItems = req.body.agenda.subItems
      }

      req.agenda.save().then(function (agenda) {
        return res.json({agenda: agenda.toJSON()})
      }).catch(next)

    } else {
      return res.sendStatus(403)
    }
  })
})

router.get('/:agenda', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (req.agenda.user.toString() === req.payload.id.toString()) {
      return res.json(req.agenda.toJSON())
    } else {
      return res.sendStatus(403)
    }
  })
})

router.delete('/:agenda', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (req.agenda.user.toString() === req.payload.id.toString()) {
      return req.agenda.remove().then(function () {
        res.sendStatus(204)
      })
    } else {
      return res.sendStatus(403)
    }
  }).catch(next)
})

// type =0 agenda; type =1 trash
router.get('/', auth.required, function (req, res, next) {
  const getData = async function (req, res) {
    let query = {isRoot: true}
    let limit = 20
    let offset = 0

    if (typeof req.query.limit !== 'undefined') {
      limit = req.query.limit
    }

    if (typeof req.query.offset !== 'undefined') {
      offset = req.query.offset
    }

    if (req.query.type === 1) {
      query.isDel = true
    }

    try {
      query.user = req.payload.id
      let agendas = await Agenda.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .exec()
      return res.json({agendas: agendas})
    } catch (err) {
      console.log(err)
      return err
    }
  }
  getData(req, res)
})
router.get('/template', function (req, res, next) {

  const getTemplate = async function (req, res) {
    var query = {isRoot: true}
    var limit = 20
    var offset = 0
    if (typeof req.query.limit !== 'undefined') {
      limit = req.query.limit
    }

    if (typeof req.query.offset !== 'undefined') {
      offset = req.query.offset
    }
    try {
      let user = await User.findOne({email: 'liganok86@qq.com'})
      query.user = user._id
      let templates = await Agenda.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .exec()
      return res.json({templates: templates})
    } catch (err) {
      console.log(err)
      return err
    }
  }
  getTemplate(req, res)
})
module.exports = router
