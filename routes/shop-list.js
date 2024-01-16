const express = require('express'),
	router = express.Router()

//Shop List
router.get('/', (req, res) => {
	res.json('asd 123')
});

router.post('/', (req, res) => {
	res.json('asd')
})

module.exports = router