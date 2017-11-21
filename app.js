import express from 'express';
import Mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { default as Logger } from 'morgan';
import passport from 'passport';
import cors from 'cors';
import * as config from './config/config';
import router from './routes'
import https from 'https'
import fs from 'fs'
import path from 'path'

let app = express();

// Normal express config defaults
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());

//app.use(session({ secret: 'meetingku', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));
Mongoose.connect(config.db);
Mongoose.connection.on('error', function () {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});
let options
try {
  let options = {
    key: fs.readFileSync('./config/ca/2143483870209061.key'),
    cert: fs.readFileSync('./config/ca/2143483870209061.pem')
  }
} catch (error) {
  options = {}
}

app.set('port', config.port);
app.use(Logger('dev'));
require('./config/passport');
router(app)

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.send({
      status: 401,
      type: 'AUTH/IVALID_TOKEN',
      message: 'invalid token'
    });
  }
})

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
https.createServer(options, app).listen(443)
console.log(process.env.NODE_ENV, process.env.PORT, app.get('port'))