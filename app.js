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
let options ={}
try {
   options = {
    key: fs.readFileSync('./config/ca/214348387020906.key'),
    cert: fs.readFileSync('./config/ca/214348387020906.pem')
  }
} catch (error) {
}

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

https.createServer(options, app).listen(config.port)
console.log(process.env.NODE_ENV, config.port, config.db.substring(0,4), config.secret.substring(0,4))