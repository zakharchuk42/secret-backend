const {MongoClient} = require('mongodb')
require('dotenv').config()

const uri = `mongodb+srv://admin-user-01:${process.env.PASS}@cluster0.3u4xfm3.mongodb.net/harmony-plate`

let dbConnection;

module.exports = {
	connectToDb: (cb) => {
		MongoClient.connect(uri).then((client) => {
			  console.log('Connected to DB')
			  dbConnection = client.db()
			  return cb()
		}).catch((err) => cb(err))
	},
	getDb: () => dbConnection
}