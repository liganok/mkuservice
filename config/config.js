let isProduction = process.env.NODE_ENV === 'production' ? true:false
export const db = isProduction ? process.env.MONGO_URI : 'localhost/mku'
export const secret = isProduction ? process.env.SECRET : 'secret'