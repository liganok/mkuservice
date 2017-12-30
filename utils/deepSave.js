import AgendaModel from '../models/Agenda'
let delArr = []

//Get the subitem with itself
async function getAllSubItems(id) {
  let result = [id]
  let agenda = await AgendaModel.findById(id)
  for (let i = 0; i < agenda.subItems.length; i++) {
    result = result.concat(await getAllSubItems(agenda.subItems[i]))
  }
  return result
}

async function getDelItems(data) {
  let delArr = []
  if (data.id.search('NEW') < 0) {
    let agenda = await AgendaModel.findById(data.id)
    let targetSubItemsIdArr = []
    data.subItems.forEach(item => {
      targetSubItemsIdArr.push(item.id)
    })

    for(let i=0;i<agenda.subItems.length;i++){
      if (-1 === targetSubItemsIdArr.indexOf(agenda.subItems[i].toString())) {
        delArr = delArr.concat(await getAllSubItems(agenda.subItems[i]))
      }
    }
  }
  return delArr
}

async function save(data) {
  let result
  if (data.id.search('NEW') >= 0) {
    result = await new AgendaModel(data).save()
  } else {
    let agenda = await AgendaModel.findById(data.id)
    agenda.name = data.name
    agenda.duration = data.duration
    agenda.sequence = data.sequence
    agenda.startedAt = data.startedAt
    agenda.subItems = data.subItems
    agenda.location = data.location

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
        if (typeof result !== 'undefined') {
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
  delArr = []
  let savedAgenda = await deepSave(data)
  await AgendaModel.remove({ _id: { $in: delArr } })
  //console.log(delArr)
  return { delArr, savedAgenda }
}