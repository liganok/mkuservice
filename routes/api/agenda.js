var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
let User = mongoose.model('User');
let Agenda = mongoose.model('Agenda');
var auth = require('../auth');

router.param('agenda',function (req, res, next, id) {
  Agenda.findById(id).then(function (agenda) {
    if(!agenda){return res.sendStatus(404);}
    req.agenda = agenda;
  }).catch(next);
});


router.post('/',auth.required,function (req,res,next) {
  User.findById(req.payload.id).then(function (user) {
    if(!user) {return res.sendStatus(401);}

    let agenda = new Agenda(req.body.agenda);
    agenda.user = user;

    return agenda.save().then(function () {
      console.log(agenda.user);
      return res.json({agenda:agenda.toJSON()});
    }).catch(next);
  }).catch(next);
});


router.get('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    return res.json({user: user.toAuthJSON()});
  }).catch(next);
});

router.post('/users', function(req, res, next){
  let user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user.save().then(function(){
    return res.json({user: user.toAuthJSON()});
  }).catch(next);
});

router.post('/users/login', function(req, res, next){
  if(!req.body.user.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      console.log('auth passed');
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

module.exports = router;
