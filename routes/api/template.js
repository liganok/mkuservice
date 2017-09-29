import User from '../../models/User'
import Agenda from '../../models/Agenda'
import deepSave from '../../utils/deepSave'
import express from 'express'
const router = express.Router()

router.get('/:id', async function (req, res) {
  let query = { isRoot: true, _id: '', user: '' }
  if (req.params.id) {
    query._id = req.params.id
  }

  try {
    let user = await User.findOne({ email: 'liganok86@qq.com' })
    query.user = user._id
    let template = await Agenda.findOne(query)
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
    return res.json({
      status: 200,
      agenda: template
    })
  } catch (err) {
    return res.json({
      status: 0,
      type: 'ERROR_GET_TEMPLATE_DETAIL',
      message: 'Get template failed'
    })
  }
})

router.get('/', async function (req, res, next) {
  var query = { isRoot: true }
  var limit = 20
  var offset = 0
  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit
  }

  if (typeof req.query.offset !== 'undefined') {
    offset = req.query.offset
  }
  try {
    let user = await User.findOne({ email: 'liganok86@qq.com' })
    query.user = user._id
    let templates = await Agenda.find(query)
      .limit(Number(limit))
      .skip(Number(offset))
      .exec()
    return res.json({ templates: templates })
  } catch (err) {
    console.log(err)
    return err
  }
})

module.exports = router