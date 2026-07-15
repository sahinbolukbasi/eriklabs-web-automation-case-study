const { request } = require('@playwright/test');

/**
 * Helper class for interacting with e-bebek's backend APIs directly.
 * Useful for Hybrid (API+UI) testing, bypassing UI bottlenecks like CAPTCHAs or slow rendering.
 */
class ApiHelper {
  constructor(baseURL, clientAuthorization) {
    this.baseURL = baseURL;
    this.clientAuthorization = clientAuthorization;
  }

  /**
   * Authenticates the user via the OAuth token endpoint (Spartacus backend)
   * and returns the access_token.
   * 
   * @param {string} phone - User phone number
   * @param {string} password - User password
   * @returns {Promise<string>} access_token
   */
  async loginViaApi(phone, password) {
    // Note: E-bebek uses SAP Commerce (Spartacus). 
    // The typical OAuth endpoint is /authorizationserver/oauth/token
    const tokenEndpoint = new URL('authorizationserver/oauth/token', this.baseURL).href;
    if (!this.clientAuthorization) {
      throw new Error('E_BEBEK_API_CLIENT_AUTH tanımlanmadan API login kullanılamaz.');
    }
    
    // Create an isolated request context
    const apiContext = await request.newContext();

    try {
      const response = await apiContext.post(tokenEndpoint, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.clientAuthorization,
        },
        form: {
          client_id: 'mobile_android',
          grant_type: 'password',
          username: phone,
          password: password,
        },
        // Don't fail the test immediately if it's 401/403, we want to handle the error gracefully
        failOnStatusCode: false 
      });

      if (!response.ok()) {
        const body = await response.text();
        throw new Error(`API Login Failed: ${response.status()} - ${body}`);
      }

      const responseBody = await response.json();
      return responseBody.access_token;
    } finally {
      await apiContext.dispose();
    }
  }

  /**
   * Generates the JS code string needed to inject the Spartacus Auth State 
   * into the browser's localStorage.
   * 
   * @param {string} accessToken 
   * @returns {string} JS code for page.evaluate()
   */
  generateLocalStorageInjectionScript(accessToken) {
    const authState = {
      token: {
        access_token: accessToken,
        token_type: 'bearer',
        expires_in: 43199,
        scope: 'basic'
      }
    };
    
    // Spartacus typically stores auth state under 'spartacus-local-data' or similar keys
    return `
      const state = {
        auth: {
          core: ${JSON.stringify(authState)}
        }
      };
      localStorage.setItem('spartacus-local-data', JSON.stringify(state));
      // E-bebek specific generic token key might also be used
      localStorage.setItem('access_token', ${JSON.stringify(accessToken)});
    `;
  }
}

module.exports = ApiHelper;
