import AgendaModel from '../models/Agenda'
let delArr = []

async function getDelItems(id) {
  let agenda = await AgendaModel.findById(id)
  if(!agenda){throw new Error('no item was deleted')}
  let length = agenda.subItems.length
  if (length >= 0) {
    for (let i = 0; i < length; i++) {
      await getDelItems(agenda.subItems[i])
    }
  }
  delArr.push(agenda.id)
}

export default async function deepRemove(id) {
  delArr=[]
  await getDelItems(id)
  await AgendaModel.remove({ _id: { $in: delArr } })
  return delArr
}
