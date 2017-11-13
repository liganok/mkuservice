// let mongoose = require('mongoose');
// let Agenda = mongoose.model('Agenda');

// let delArr = []

// async function save(agenda) {
//   if (agenda.id.search('NEW') >= 0) {
//     let data = await new Agenda(agenda).save();
//     return data.toJSON();
//   } else {
//     let data = await Agenda.findById(agenda.id);
//     let isNeedUpdate = false;
//     if (data.name !== agenda.name) {
//       isNeedUpdate = true;
//       data.name = agenda.name;
//     }

//     if (data.duration !== agenda.duration) {
//       isNeedUpdate = true;
//       data.duration = agenda.duration;
//     }

//     if (data.sequence !== agenda.sequence) {
//       isNeedUpdate = true;
//       data.sequence = agenda.sequence;
//     }

//     if (data.startedAt !== agenda.startedAt) {
//       isNeedUpdate = true;
//       data.startedAt = agenda.startedAt;
//     }

//     if (data.subItems !== agenda.subItems) {
//       isNeedUpdate = true;
      
//       //deep remove uneeded item
//       // date.subItems.foreach((item, index) => {
//       //   if (-1 === agenda.subItems.indexOf(item)) {
//       //     delArr.push(item)
//       //   }
//       // })
//       //console.log('sid-tid',data.subItems,agenda.subItems)
//       data.subItems = agenda.subItems;
//     }

//     if (isNeedUpdate) {
//       let agenda = await new Agenda(data).save();
//       return agenda.toJSON();
//     }
//     return agenda;
//   }
// }

// export default async function deepSave(agenda) {
//   if (agenda.subItems.length === 0) {
//     let agendaPromise = await save(agenda);
//     return agendaPromise;
//   } else {
//     for (let i = 0; i < agenda.subItems.length; i++) {
//       let data = await deepSave(agenda.subItems[i]);
//       if (agenda.subItems[i].id.search('NEW') >= 0) {
//         if(typeof data !== 'undefined'){
//           agenda.subItems[i] = data.id;
//         }
//         //console.log('id',data.id);
//       }else {
//         agenda.subItems[i] = agenda.subItems[i].id;
//       }
//     }
//     let agendaPromise = await save(agenda);
//     return { agendaPromise,delArr };
//   }
// }
import AgendaModel from '../models/Agenda'
let delArr=[]
async function save(data) {
  let agenda
  if (data.id.search('NEW') >= 0) {
    agenda = await AgendaModel.create(data)
  } else {
    agenda = await AgendaModel.findById(data.id)
    agenda.name = data.name
    agenda.duration = data.duration
    agenda.sequence = data.sequence
    agenda.startedAt = data.startedAt
    agenda.subItems = data.subItems
    await agenda.save()
  }
  return agenda
}

export default async function deepSave(data) {
  console.log('agenda')

  let agenda
  if (data.subItems.length === 0) {
    await save(data)
  } else {
    let subItems = data.subItems
    agenda = await AgendaModel.findById(data.id)
    for (let item in agenda.subItems) {
      if (-1 === subItems.indexOf(item)) {
        delArr.push(item)
      }
    }
    for (let i = 0; i < subItems.length; i++) {
      let data = await deepSave(subItems[i])
      if (subItems[i].id.search('NEW') >= 0) {
        subItems[i] = data.id
      } else {
        subItems[i] = subItems[i].id
      }
    }
    await save(data)
  }
}