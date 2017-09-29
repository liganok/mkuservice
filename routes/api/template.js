var mongoose = require('mongoose')
var router = require('express').Router()
let User = mongoose.model('User')
let Agenda = mongoose.model('Agenda')
import deepSave from '../../utils/deepSave'

// router.param('template', function (req, res, next, id) {
//   Agenda.findOne({_id: id})
//     .then(function (agenda) {
//       if (!agenda) {
//         return res.sendStatus(404)
//       }
//       req.agenda = agenda[0]
//       return next()
//     }).catch(next)
// })
//Get detail template
router.get('/:id', function (req, res) {
  const getData = async function (req, res) {
    var query = {isRoot: true, _id:'',user:''}
    if (req.params.id) {
      query._id=req.params.id
    }

    try {
      let user = await User.findOne({email: 'liganok86@qq.com'})
      query.user = user._id
      console.log(query)
      let templates = await Agenda.find(query).exec()
      return res.json({templates: templates})
    } catch (err) {
      return res.send('not found')
    }
  }
  getData(req, res)
})

router.get('/', function (req, res, next) {

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