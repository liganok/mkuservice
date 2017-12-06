import AgendaModel from '../models/Agenda'
import UserInfoModel from '../models/user/UserInfo'
import deepSave from '../utils/deepSave'
import deepRemove from '../utils/deepRemove'

class Agenda {
  constructor() {
  }
  async getList(req, res, next) {
    let query = { isRoot: true, isDel: { $ne: true } }
    let limit = 20
    let offset = 0
    let httpStatus

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
      let agendas = await AgendaModel.find(query)
        .limit(Number(limit))
        .sort({ startedAt: -1 })
        .skip(Number(offset))
        .exec()
      return res.send({ data: agendas})
    } catch (err) {
      return res.status(404).send({ error: { code: 404, message: error.message } })
    }
  }

  async getTemplateList(req, res, next) {
    let query = { isRoot: true,isDel:false }
    let limit = 20
    let offset = 0
    if (typeof req.query.limit !== 'undefined') {
      limit = req.query.limit
    }

    if (typeof req.query.offset !== 'undefined') {
      offset = req.query.offset
    }
    try {
      let user = await UserInfoModel.findOne({ email: 'liganok86@qq.com' })
      query.user = user._id
      let templates = await AgendaModel.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .exec()
      return res.send({ data: templates})

    } catch (err) {
      return res.status(404).send({ error: { code: 404, message: error.message } })
    }
  }

  async getDetail(req, res, next) {
    try {
      const id = req.params.id
      let agenda = await AgendaModel.findOne({ _id: id, user: req.payload.uid })
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
        res.send({ data: agenda.toJSON()})
      } else {
        return res.status(404).send({ error: { code: 404, message: 'Data was not found' } })
      }
    } catch (error) {
      return res.status(500).send({ error: { code: 500, message: error.message } })
    }
  }

  async update(req, res, next) {
    let data
    try {
      let { agenda } = req.body
      agenda.user = req.payload.uid
      agenda.isRoot = true
      data = await deepSave(agenda)
      return res.send({
        data: data.savedAgenda,
        message: 'Success saved'
      })
    } catch (error) {
      return res.status(500).send({ error: { code: 500, message: error.message } })
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
      await agenda.save()
      return res.send({
        message: agenda.isDel ? 'Move to trash success' : 'Move out from trash success'
      })
    } catch (error) {
      return res.status(500).send({ error: { code: 500, message: error.message } })
    }
  }

  async delete(req, res, next) {
    let delArr
    try {
      const id = req.params.id
      if (!id) { throw new Error('No item need to be deleted') }
      delArr = await deepRemove(id)
      return res.send({
        data: delArr,
        message: 'Delete success'
      })
    } catch (error) {
      return res.status(500).send({ error: { code: 500, message: error.message } })
    }
  }

  async getTemplateDetail(req, res, next) {
    let query = { isRoot: true, _id: '', user: '' }
    if (req.params.id) {
      query._id = req.params.id
    }

    try {
      let user = await UserInfoModel.findOne({ email: 'liganok86@qq.com' })
      query.user = user._id
      let template = await AgendaModel.findOne(query)
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
      return res.send({ data: template.toJSON()})
    } catch (err) {
      return res.status(500).send({ error: { code: 500, message: error.message } })
    }
  }
}

export default new Agenda()