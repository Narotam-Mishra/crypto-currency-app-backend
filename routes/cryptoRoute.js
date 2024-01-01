const express = require('express');
const router = express.Router();

const { getCryptoCurrencies, getExchangeRate} = require('../controller/crypto_api');

router.route('/convert').get(getExchangeRate)
router.route('/crpto-list').get(getCryptoCurrencies);

module.exports = router;