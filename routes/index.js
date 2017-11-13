import agenda from './api/agenda'
import user from './api/users'
import template from './api/template'

export default app=>{
  app.use('/api/agenda',agenda)
  app.use('/api/user', user)
  app.use('/api/template', template)
}