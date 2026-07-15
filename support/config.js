require('dotenv').config();

const config = {
  baseUrl: process.env.BASE_URL || 'https://www.e-bebek.com/',
  credentials: {
    phone: process.env.E_BEBEK_PHONE,
    password: process.env.E_BEBEK_PASSWORD,
  },
  browser: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO || '0', 10),
    timeout: parseInt(process.env.TIMEOUT || '30000', 10),
  },
  parallel: {
    workers: parseInt(process.env.WORKERS || '2', 10),
  },
};

module.exports = config;
