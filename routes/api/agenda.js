var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
let User = mongoose.model('User');
let Agenda = mongoose.model('Agenda');
var auth = require('../auth');

router.param('agenda', function (req, res, next, id) {
  Agenda.find({_id: id}).then(function (agenda) {
    if (!agenda) {
      return res.sendStatus(404);
    }
    req.agenda = agenda[0];
    return next();
  }).catch(next);
});


router.post('/', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }

    let agenda = new Agenda(req.body.agenda);
    agenda.user = user;

    return agenda.save().then(function () {
      console.log(agenda.user);
      return res.json({agenda: agenda.toJSON()});
    }).catch(next);
  }).catch(next);
});

router.put('/:agenda', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (req.agenda.user.toString() === req.payload.id.toString()) {
      if (typeof req.body.agenda.name !== 'undefined') {
        req.agenda.name = req.body.agenda.name;
      }

      if (typeof req.body.agenda.startAt !== 'undefined') {
        req.agenda.startAt = req.body.agenda.startAt;
      }

      if (typeof req.body.agenda.duration !== 'undefined') {
        req.agenda.duration = req.body.agenda.duration;
      }

      if (typeof req.body.agenda.sequence !== 'undefined') {
        req.agenda.sequence = req.body.agenda.sequence;
      }

      if (typeof req.body.agenda.subItems !== 'undefined') {
        req.agenda.subItems = req.body.agenda.subItems;
      }

      req.agenda.save().then(function (agenda) {
        return res.json({agenda: agenda.toJSON()});
      }).catch(next);

    } else {
      return res.sendStatus(403);
    }
  });
});

router.get('/:agenda', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (req.agenda.user.toString() === req.payload.id.toString()) {
      return res.json(req.agenda.toJSON());
    } else {
      return res.sendStatus(403);
    }
  });
});

router.delete('/:agenda', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (req.agenda.user.toString() === req.payload.id.toString()) {
      return req.agenda.remove().then(function () {
        res.sendStatus(204);
      });
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

router.get('/', auth.required, function (req, res, next) {
  return Agenda.find({}).then(function (agenda) {
    return res.json({agenda: agenda});
  }).catch(next);
});

module.exports = router;
