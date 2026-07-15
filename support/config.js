// dotenv will NOT override existing env vars (e.g., CI-injected secrets)
require('dotenv').config({ override: false });

const baseUrl = new URL(process.env.BASE_URL || 'https://www.e-bebek.com/').href;

const config = {
  baseUrl,
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
    workers: Math.max(2, parseInt(process.env.WORKERS || '2', 10) || 2),
  },
  session: {
    useStorageState: process.env.USE_STORAGE_STATE === 'true',
    storageStatePath: process.env.STORAGE_STATE_PATH || 'state.json',
  },
  api: {
    clientAuthorization: process.env.E_BEBEK_API_CLIENT_AUTH,
  },
};

module.exports = config;
