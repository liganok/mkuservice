import AgendaModel from '../models/Agenda'
import UserModel from '../models/User'
import deepSave from '../utils/deepSave'
import deepRemove from '../utils/deepRemove'

class Agenda {
  constructor() {
  }
  async getList(req, res, next) {
    let query = { isRoot: true, isDel: { $ne: true } }
    let limit = 20
    let offset = 0

    if (typeof req.query.limit !== 'undefined') {
      limit = req.query.limit
    }

    if (typeof req.query.offset !== 'undefined') {
      offset = req.query.offset
    }

    if (req.query.type === '1') {
      query.isDel = true
    }
    try {
      query.user = req.payload.uid
      console.log(query)
      let agendas = await AgendaModel.find(query)
        .limit(Number(limit))
        .sort({ startedAt: -1 })
        .skip(Number(offset))
        .exec()
      res.send({
        status: 200,
        data: agendas
      })
    } catch (err) {
      res.send({
        status: 400,
        message: error.message
      })
    }
  }

  async getTemplateList(req, res, next) {
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
      let user = await UserModel.findOne({ email: 'liganok86@qq.com' })
      query.user = user._id
      let templates = await AgendaModel.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .exec()
      res.send({
        status: 200,
        data: templates
      })
    } catch (err) {
      res.send({
        status: 400,
        message: error.message
      })
    }
  }

  async getDetail(req, res, next) {
    try {
      const id = req.params.id
      let agenda = await AgendaModel.findById(id)
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
      if (agenda) {
        res.send({
          status: 200,
          data: agenda.toJSON()
        })
      } else {
        throw new Error('agenda was not found')
      }
    } catch (error) {
      return res.send({
        status: 404,
        type: 'AGENDA/NOT_FOUND',
        message: error.message
      })
    }
  }

  async update(req, res, next) {
    let data
    try {
      let { agenda } = req.body
      agenda.user = req.payload.uid
      agenda.isRoot = true
      data = await deepSave(agenda)
      res.send({
        status: 200,
        data: data.savedAgenda,
        message: 'success saved'
      })
    } catch (error) {
      res.send({
        status: 400,
        message: error.message
      })
    }
  }

  async logicDelete(req, res, next) {
    try {
      const id = req.params.id
      let agenda = await AgendaModel.findById(id)
      const { undo } = req.query
      if (undo === '1') {
        agenda.isDel = false
      } else {
        agenda.isDel = true
      }
      console.log(req.query.undo, agenda.isDel)
      await agenda.save()
      res.send({
        status: 200,
        message: agenda.isDel ? 'move to trash success' : 'move out from trash success'
      })
    } catch (error) {
      res.send({
        status: 400,
        message: error.message
      })
    }
  }

  async delete(req, res, next) {
    let delArr
    try {
      const id = req.params.id
      if (!id) { throw new Error('no item need to be deleted') }
      delArr = await deepRemove(id)
      res.send({
        status: 200,
        data: delArr,
        message: 'delete success'
      })
    } catch (error) {
      res.send({
        status: 400,
        message: error.message
      })
    }
  }


}

export default new Agenda()