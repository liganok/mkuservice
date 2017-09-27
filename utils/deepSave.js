let mongoose = require('mongoose');
let Agenda = mongoose.model('Agenda');

async function save(agenda) {
  if (agenda.id.search('NEW') >= 0) {
    let data = await new Agenda(agenda).save();
    return data.toJSON();
  } else {
    let data = await Agenda.findById(agenda.id);
    let isNeedUpdate = false;
    if (data.name !== agenda.name) {
      isNeedUpdate = true;
      data.name = agenda.name;
    }

    if (data.duration !== agenda.duration) {
      isNeedUpdate = true;
      data.duration = agenda.duration;
    }

    if (data.sequence !== agenda.sequence) {
      isNeedUpdate = true;
      data.sequence = agenda.sequence;
    }

    if (data.startedAt !== agenda.startedAt) {
      isNeedUpdate = true;
      data.startedAt = agenda.startedAt;
    }

    if (data.subItems !== agenda.subItems) {
      isNeedUpdate = true;
      data.subItems = agenda.subItems;
    }

    if (isNeedUpdate) {
      let agenda = await new Agenda(data).save();
      return agenda.toJSON();
    }
    return agenda;
  }
}



export default async function deepSave(agenda) {
  if (agenda.subItems.length === 0) {
    let agendaPromise = await save(agenda);
    return agendaPromise;
  } else {
    for (let i = 0; i < agenda.subItems.length; i++) {
      let data = await deepSave(agenda.subItems[i]);
      if (agenda.subItems[i].id.search('NEW') >= 0) {
        if(typeof data !== 'undefined'){
          agenda.subItems[i] = data.id;
        }
        //console.log('id',data.id);
      }else {
        agenda.subItems[i] = agenda.subItems[i].id;
      }
    }
    let agendaPromise = await save(agenda);
    return agendaPromise;
  }
}
