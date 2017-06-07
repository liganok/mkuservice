import express from 'express';
import Mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {default as Logger} from 'morgan';
import passport from 'passport';
import cors from 'cors';
import Config from './config/config';

let app = express();

// Normal express config defaults
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

//app.use(session({ secret: 'meetingku', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));
Mongoose.connect(Config.database);
Mongoose.connection.on('error', function () {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

app.set('port', process.env.PORT || 3001);
app.use(Logger('dev'));

require('./models/User');
require('./models/Agenda');
require('./config/passport');

app.use(require('./routes'));


app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});