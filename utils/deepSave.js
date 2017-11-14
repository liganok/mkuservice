import AgendaModel from '../models/Agenda'
let delArr = []

async function getDelItems(data){
  let delArr =[]
  if (data.id.search('NEW') < 0) {
    let agenda = await AgendaModel.findById(data.id)
    let targetSubItemsIdArr = []
    data.subItems.forEach(item => {
      targetSubItemsIdArr.push(item.id)
    })

    agenda.subItems.forEach(item => {
      if (-1 === targetSubItemsIdArr.indexOf(item.toString())) {
        delArr.push(item)
      }
    })
  }
  return delArr
}

async function save(data) {
  let result
  if (data.id.search('NEW') >= 0) {
    let agenda =  new AgendaModel()
    agenda.name = data.name
    agenda.duration = data.duration
    agenda.sequence = data.sequence
    agenda.startedAt = data.startedAt
    agenda.subItems = data.subItems
    result = await agenda.save()
  } else {
    let agenda = await AgendaModel.findById(data.id)
    agenda.name = data.name
    agenda.duration = data.duration
    agenda.sequence = data.sequence
    agenda.startedAt = data.startedAt
    agenda.subItems = data.subItems
    result = await agenda.save()
  }
  return result
}

async function deepSave(data) {
  let result
  if (data.subItems.length === 0) {
    delArr = delArr.concat(await getDelItems(data))
    result = await save(data)
  } else {
    delArr = delArr.concat(await getDelItems(data))
    for (let i = 0; i < data.subItems.length; i++) {
      let result = await deepSave(data.subItems[i])
      if (data.subItems[i].id.search('NEW') >= 0) {
        if (typeof result !== 'undefined'){
          data.subItems[i] = result.id
        }
      } else {
        data.subItems[i] = data.subItems[i].id
      }
    }
    result = await save(data)
  }
  return result
}

export default async function main(data) {
  delArr=[]
  await deepSave(data)
  console.log('delArr', delArr)
  await AgendaModel.remove({_id:{$in:delArr}})
  return delArr
}