import User from '../../models/User'
//import deepSave from '../../utils/deepSave'
import express from 'express'
import passport from 'passport'
import Agenda from '../../controller/Agenda'
//import auth from '../auth'
const router = express.Router()
var auth = require('../auth')

// router.param('agenda', async function (req, res, next, id) {
//   try {
//     let agenda = await Agenda.findById(id)
//       .populate({
//         path: 'subItems',
//         populate: {
//           path: 'subItems',
//           populate: {
//             path: 'subItems',
//             populate: {
//               path: 'subItems',
//               populate: {
//                 path: 'subItems'
//               }
//             }
//           }
//         }
//       })
//     if (!agenda) {
//       return res.json({
//         status: 1,
//         agenda: null
//       })
//     } else {
//       req.agenda = agenda
//       return next()
//     }
//   } catch (error) {
//     return res.json({
//       status: 0,
//       type: 'ERROR',
//       message: error
//     })
//   }
// })

// router.post('/', auth.required, async function (req, res, next) {

//   try {
//     let user = await User.findById(req.payload.id)
//     if (typeof user._id === 'undefined') {
//       return res.json({
//         status: 400,
//         type: 'ERROR_GET_USER',
//         message: 'User was not found'
//       })
//     }

//     let agenda = req.body.agenda
//     if (!agenda) {
//       return res.json({
//         status: 400,
//         type: 'ERROR_NULL_POST_DATA',
//         message: 'Nothing need to be saved'
//       })
//     }
//     agenda.isRoot = true
//     agenda.user = req.payload.id
//     console.log('source', req.body.delArr)

//     let savedAgenda = await deepSave(agenda)
//     //console.log('target', savedAgenda)
//     return res.json({
//       status: 200,
//       message: 'Data saved'
//     })
//   } catch (error) {
//     return res.json({
//       status: 400,
//       type: 'ERROR_SAVED_FAILED',
//       message: error
//     })
//   }
// })

// router.put('/:agenda', auth.required, async function (req, res, next) {
//   try {
//     let user = await User.findById(req.payload.id)
//     if (typeof user._id === 'undefined') {
//       if (typeof user._id) {
//         return res.json({
//           status: 400,
//           type: 'ERROR_GET_USER',
//           message: 'User was not found'
//         })
//       }
//     } else {
//       if (typeof req.body.agenda.name !== 'undefined') {
//         req.agenda.name = req.body.agenda.name
//       }

//       if (typeof req.body.agenda.startAt !== 'undefined') {
//         req.agenda.startAt = req.body.agenda.startAt
//       }

//       if (typeof req.body.agenda.duration !== 'undefined') {
//         req.agenda.duration = req.body.agenda.duration
//       }

//       if (typeof req.body.agenda.sequence !== 'undefined') {
//         req.agenda.sequence = req.body.agenda.sequence
//       }

//       if (typeof req.body.agenda.subItems !== 'undefined') {
//         req.agenda.subItems = req.body.agenda.subItems
//       }

//       if (typeof req.body.agenda.isDel !== 'undefined') {
//         req.agenda.isDel = req.body.agenda.isDel
//       }
//       let savedAgenda = await req.agenda.save()
//       console.table('source', req.agenda)
//       console.table('target', req.body.agenda)
//       return res.json({
//         status: 200,
//         message: 'Data saved'
//       })
//     }
//   } catch (error) {
//     return res.json({
//       status: 400,
//       type: 'ERROR_SAVED_FAILED',
//       message: error
//     })
//   }
// })


// router.get('/:agenda', auth.required, async function (req, res, next) {
//   try {
//     let user = await User.findById(req.payload.id)
//     if (user._id.toString() === req.payload.id.toString()) {
//       return res.json({
//         status: 1,
//         agenda: req.agenda.toJSON()
//       })
//     } else {
//       return res.json({
//         status: 1,
//         agenda: null
//       })
//     }
//   } catch (error) {
//     return res.json({
//       status: 0,
//       type: 'ERROR',
//       message: error
//     })
//   }
// })

// router.delete('/:agenda', auth.required, function (req, res, next) {
//   User.findById(req.payload.id).then(function (user) {
//     if (req.agenda.user.toString() === req.payload.id.toString()) {
//       return req.agenda.remove().then(function () {
//         res.sendStatus(204)
//       })
//     } else {
//       return res.sendStatus(403)
//     }
//   }).catch(next)
// })
router.get('/template', Agenda.getTemplateList)
router.get('/', auth.required, Agenda.getList)
router.get('/detail/:id', auth.required, Agenda.getDetail)
router.post('/', auth.required, Agenda.update)
router.put('/logicdel/:id', auth.required, Agenda.logicDelete)
router.delete('/detail/:id', auth.required, Agenda.delete)

export default router
