require('babel-core/register');
try {
  if (process.env.NODE_ENV === 'development') throw new Error()
  require('./config/envPrd')
} catch (error) {
  process.env.MONGO_URI = 'localhost/mku'
  process.env.SECRET = 'secret'
  process.env.NODE_ENV = 'development'
  process.env.PORT = 443
}
require('./app');
