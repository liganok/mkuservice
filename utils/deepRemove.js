let mongoose = require('mongoose');
let Agenda = mongoose.model('Agenda');

export default async function deepRemove(agenda) {
  if (agenda.subItems.length === 0) {
    let agendaPromise = await Agenda.findOneAndRemove({ _id: agenda.id });
    return agendaPromise;
  } else {
    for (let i = 0; i < agenda.subItems.length; i++) {
      let data = await deepRemove(agenda.subItems[i]);
    }
    let agendaPromise = await remove(agenda);
    return agendaPromise;
  }
}
