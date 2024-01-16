const express = require('express')
const cors = require('cors');
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors());

const root = require('./routes/index')
const shop_list = require('./routes/shop-list')

// Routes
app.use('/', root)
app.use('/shop-list', shop_list)

// connection
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log('working...')
})


