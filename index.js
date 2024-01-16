const express = require('express')
const cors = require('cors');
const {connectToDb, getDb} = require('./db');
require('dotenv').config()


const app = express()
app.use(express.json())
app.use(cors());

// connection
const PORT = process.env.PORT || 3001

let db;
connectToDb((err) => {
	if (!err) {
		app.listen(PORT, () => {
			console.log('Working...')
		})
		db = getDb()
	} else {
		console.log('DB connection error')
	}
})


// ROUTES
app.get('/shop-lists', (req, res) => {
	const shopLists = []

	db
	.collection('shoplists')
	.find()
	.forEach((list) => shopLists.push(list))
	.then(() => {
		res.status(200).json({shopLists})
	}).catch(() => res.status(500).json({error: 'DB IN FIRE!!!!!'}))
});

app.post('/shop-lists', async(req, res) => {
	await db.collection('shoplists').deleteMany({});

	if(req.body.shopList.length > 0) {
		db
		.collection('shoplists')
		.insertMany(req.body.shopList)
		.then((result) => {
			res.status(200).json({shopLists: req.body.shopList, message: 'Список збережено!'})
		}).catch(() => res.status(500).json({error: 'DB IN FIRE!!!!!'}))
	} else {
		res.status(200).json({shopLists: [], message: 'Список оновлено'})
	}
})