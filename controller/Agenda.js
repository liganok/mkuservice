import AgendaModel from '../models/Agenda'
import UserModel from '../models/User'
import deepSave from '../utils/deepSave'

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
      query.user = req.payload.id
      let agendas = await AgendaModel.find(query)
        .limit(Number(limit))
        .sort({ startedAt: -1 })
        .skip(Number(offset))
        .exec()
      return res.json({ agendas: agendas })
    } catch (err) {
      console.log(err)
      return err
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
      return res.send({ templates: templates })
    } catch (err) {
      console.log(err)
      return err
    }
  }

  async getDetail(req, res, next) {
    try {
      const id = req.params.id
      console.log(req.params.id)
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
          agenda: agenda.toJSON()
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
    try {
      let {agenda}=req.body
      await deepSave(agenda)
      res.send({
        status:200,
        //delArr:this.delArr,
        message:'success saved'
      })
    } catch (error) {
      res.send({
        status: 400,
        message: error.message
      })
    }
  }

  async logicDelete(req, res, next) {

  }

  async delete(req, res, next) {

  }

  

}

export default new Agenda()