const express = require('express');
const axios = require('axios');

const app = express();

// Crpto - APIs

// Fetch the top 100 cryptocurrencies and supported currencies
const getCryptoCurrencies = async (req,res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      }
    );
    const cryptocurrencies = response.data;
    const count = response.data.length
    res.json({cryptocurrencies, count});
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error" );
  }
};

// Perform currency conversion

const getExchangeRate = async (req, res) => {
  const { sourceCrypto, amount, targetCurrency } = req.query;

  try {
    // Get real-time exchange rates
    const exchangeRateResponse = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: sourceCrypto,
          vs_currencies: targetCurrency,
        },
      }
    );

    const exchangeRate = exchangeRateResponse.data[sourceCrypto]?.[targetCurrency];

    // Check if exchange rate is undefined or not a number
    if (exchangeRate === undefined || isNaN(exchangeRate)) {
      throw new Error('Invalid exchange rate');
    }

    // console.log("Exchange Rate val:", exchangeRate);

    // Perform conversion
    const convertedAmount = amount * exchangeRate;
    res.json({ convertedAmount, exchangeRate });
  } catch (error) {
    console.error(error);

    // Handle specific errors
    if (error.message === 'Invalid exchange rate') {
      res.status(400).json({ error: 'Invalid exchange rate' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = {
  getCryptoCurrencies, getExchangeRate
}
