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
app.get('/shop-list', (req, res) => {
	const shopLists = []

	db
	.collection('shoplists')
	.find()
	.forEach((list) => shopLists.push(list))
	.then(() => {
		res.status(200).json({shopLists})
	}).catch(() => res.status(500).json({error: 'DB IN FIRE!!!!!'}))
});

app.post('/shop-list', async(req, res) => {
	await db.collection('shoplists').deleteMany({});

	if(req.body.shopList.length > 0) {
		db
		.collection('shoplists')
		.insertMany(req.body.shopList)
		.then(() => {
			res.status(200).json({shopLists: req.body.shopList, message: 'Список збережено!'})
		}).catch(() => res.status(500).json({error: 'DB IN FIRE!!!!!'}))
	} else {
		res.status(200).json({shopLists: [], message: 'Список оновлено'})
	}
})

app.get('/current-day', (req, res) => {
	let currentDay = {}

	db
	.collection('currentday')
	.find()
	.forEach((list) => {
		currentDay = list
	})
	.then(() => {
		res.status(200).json({currentDay: currentDay.currentDay, currentDate: currentDay.currentDate})
	}).catch(() => res.status(500).json({error: 'DB IN FIRE!!!!!'}))
});

app.post('/current-day', async (req, res) => {
	await db.collection('currentday').deleteMany({});

	db
	.collection('currentday')
	.insertMany([req.body])
	.then(() => {
		return db.collection('currentday').findOne();
	})
	.then((updatedData) => {
		res.status(200).json({currentDay: updatedData, message: 'Меню на день змінено!'})
	}).catch(() => res.status(500).json({error: 'DB IN FIRE!!!!!'}))
});

app.patch('/current-day', (req, res) => {
	const changes = req.body.dayMill;
	const updateQuery = {};

	for (const key in changes) {
		if (changes.hasOwnProperty(key)) {

			const fieldUpdate = `currentDay.${key}`;
			updateQuery[fieldUpdate] = req.body.dayMill[key];
		}
	}

	db.collection('currentday')
	.updateOne({}, { $set: updateQuery })
	.then(() => {
		return db.collection('currentday').findOne();
	})
	.then((updatedData) => {
		res.status(200).json({dayMill: updatedData.currentDay, message: 'Меню оновлено!'});
	})
	.catch(() => res.status(500).json({ error: 'DB IN FIRE!!!!!' }));
});

app.get('/left-products', (req, res) => {
	let leftProducts = {}

	db
	.collection('leftproducts')
	.find()
	.forEach((list) => {
		leftProducts = list
	})
	.then(() => {
		res.status(200).json(leftProducts)
	}).catch(() => res.status(500).json({error: 'DB IN FIRE!!!!!'}))
});

app.patch('/left-products', (req, res) => {
	const changes = req.body.changeProduct;
	const updateQuery = {};

	for (const key in changes) {
		if (changes.hasOwnProperty(key)) {
			const fieldUpdate = `${key}.howMuch`;
			updateQuery[fieldUpdate] = changes[key].howMuch;
		}
	}

	db.collection('leftproducts')
	.updateOne({}, { $set: updateQuery })
	.then(() => {
		return db.collection('leftproducts').findOne();
	})
	.then((updatedData) => {
		res.status(200).json(updatedData);
	})
	.catch(() => res.status(500).json({ error: 'DB IN FIRE!!!!!' }));
});
