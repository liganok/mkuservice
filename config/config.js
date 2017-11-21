export const db = process.env.MONGO_URI || 'localhost/mku'
export const secret = process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret'