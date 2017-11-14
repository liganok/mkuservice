import User from '../../models/User'
import express from 'express'
import Agenda from '../../controller/Agenda'
import auth from '../auth'
const router = express.Router()

router.get('/template', Agenda.getTemplateList)
router.get('/', auth.required, Agenda.getList)
router.get('/detail/:id', auth.required, Agenda.getDetail)
router.post('/', auth.required, Agenda.update)
router.put('/logicalDel/:id', auth.required, Agenda.logicDelete)
router.delete('/remove/:id', auth.required, Agenda.delete)

export default router
