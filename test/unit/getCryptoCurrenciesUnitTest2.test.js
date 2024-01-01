const axios = require('axios');
const chai = require('chai');
const chaiHttp = require('chai-http');
const MockAdapter = require('axios-mock-adapter');
const { getCryptoCurrencies } = require('../../controller/crypto_api');

const { expect } = chai;
chai.use(chaiHttp);

describe('getCryptoCurrencies', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should return cryptocurrency data and count', async () => {
    // Mock the response from the Coingecko API
    const mockResponse = [
      { id: 'bitcoin', name: 'Bitcoin', market_cap: 1000000000 },
      { id: 'ethereum', name: 'Ethereum', market_cap: 500000000 },
    ];

    mock.onGet('https://api.coingecko.com/api/v3/coins/markets').reply(200, mockResponse);

    // Create a mock response object
    const res = {
      json: chai.spy(),
      status: chai.spy(),
    };

    // Simulate an HTTP request to getCryptoCurrencies
    await getCryptoCurrencies({}, res);

    // Assert that the function behaves as expected
    expect(res.status).to.not.have.been.called();
    expect(res.json).to.have.been.called.with({ cryptocurrencies: mockResponse, count: mockResponse.length });
  });

  it('should handle errors and return a 500 status code', async () => {
    // Mock an error response from the Coingecko API
    mock.onGet('https://api.coingecko.com/api/v3/coins/markets').reply(500);

    // Create a mock response object
    const res = {
      json: chai.spy(),
      status: chai.spy(),
    };

    // Simulate an HTTP request to getCryptoCurrencies
    await getCryptoCurrencies({}, res);

    // Assert that the function handles errors correctly
    expect(res.status).to.have.been.called.with(500);
    expect(res.json).to.have.been.called.with('Internal Server Error');
  });
});
