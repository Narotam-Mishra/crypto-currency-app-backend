const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { getExchangeRate } = require('../../controller/crypto_api'); 

describe('getExchangeRate', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should return converted amount and exchange rate when valid data is provided', async () => {
    const req = {
      query: {
        sourceCrypto: 'bitcoin',
        amount: 1,
        targetCurrency: 'usd',
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn(),
    };

    // Mock the exchange rate response from the API
    mock.onGet('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin',
        vs_currencies: 'usd',
      },
    }).reply(200, {
      bitcoin: { usd: 50000 }, // Set a sample exchange rate
    });

    await getExchangeRate(req, res);

    // Assert that the response is as expected
    expect(res.json).toHaveBeenCalledWith({ convertedAmount: 50000, exchangeRate: 50000 });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should handle invalid exchange rate and return a 400 status code', async () => {
    const req = {
      query: {
        sourceCrypto: 'invalid_crypto',
        amount: 1,
        targetCurrency: 'usd',
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn(),
    };

    // Mock the exchange rate response from the API with invalid data
    mock.onGet('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'invalid_crypto',
        vs_currencies: 'usd',
      },
    }).reply(200, {
      invalid_crypto: { usd: 'invalid_rate' },
    });

    await getExchangeRate(req, res);

    // Assert that the response is as expected
    expect(res.json).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid exchange rate' });
  });

  it('should handle internal server error and return a 500 status code', async () => {
    const req = {
      query: {
        sourceCrypto: 'bitcoin',
        amount: 1,
        targetCurrency: 'usd',
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn(),
    };

    // Mock a network error to simulate internal server error
    mock.onGet('https://api.coingecko.com/api/v3/simple/price').networkError();

    await getExchangeRate(req, res);

    // Assert that the response is as expected
    expect(res.json).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
