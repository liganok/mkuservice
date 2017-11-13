import express from 'express';
import Mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {default as Logger} from 'morgan';
import passport from 'passport';
import cors from 'cors';
import Config from './config/config';
import router from './routes'

let app = express();
const path = require('path');
const PORT = process.env.PORT || 3001;


// Normal express config defaults
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(path.resolve(__dirname, '../client/build')));

//app.use(session({ secret: 'meetingku', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));
Mongoose.connect(Config.database);
Mongoose.connection.on('error', function () {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

app.set('port', PORT);
app.use(Logger('dev'));
require('./config/passport');
router(app)

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.send({
      status:401,
      type: 'AUTH/IVALID_TOKEN',
      message:'invalid token'
    });
  }
})

app.use('/', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + PORT);
});