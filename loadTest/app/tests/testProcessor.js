'use strict'

// Configuring env for local test
if (!process.env.REMOTE) {
    require('dotenv').config();
}

// Required Items
const querystring = require('querystring');
const assert = require('assert');
const axios = require('axios');

// Token
var token = null;

// Getting token from auth service
const getToken = async () => {
    // Getting auth details from env
    const authUrl = process.env.AUTH_URL;
    const user = process.env.TEST_USER;
    const password = process.env.PASSWORD;
    const realam = process.env.REALM;
    const clientId = process.env.CLIENT_ID;
    const finalAuthURL = `${authUrl}/${realam}/protocol/openid-connect/token`;

     // Asserting each details value
     assert(authUrl, 'No authURL');
     assert(user, 'No user');
     assert(password, 'No password');
     assert(realam, 'No relam');
     assert(clientId, 'No Client Id');
 
     const formData = querystring.stringify( {
         grant_type: 'password',
         client_id: clientId,
         scope: 'openid',
         username: user,
         password: password
     });
     const options = {
         method: 'post',
         url: finalAuthURL,
         data: formData,
         headers: {
             'Content-Length': formData.length,
             'Content-Type': 'application/x-www-form-urlencoded'
         }
     };
 
     try {
         const resp = await axios(options);
         assert(resp.data, `No data in auth response`);
         assert(resp.data.access_token, `No Access token on data ${JSON.stringify(resp.data, null, 2)}`);
         token = resp.data.access_token;
         return token;
         
     } catch(excp) {
         console.error(`beforeRequestHandler: Exception: ${excp}`);
     }

};

/**
 * Get Token
 * @param {*} req 
 * @param {*} context 
 * @param {*} ee 
 * @param {*} next 
 */
async function beforeRequestHandler(req, context, ee, next) {
    //Change your function name and add your logic here.
    //For more information, check: https://artillery.io/docs/http-reference/#function-signatures
    if (context.vars['token']) {
        next();
    } else {
        const accessToken = await getToken();
        if (accessToken) {
            context.vars['token'] = accessToken;
            next();
        }
    }
};

/**
 * Placeholder for beforeScenarioHandler
 * @param {*} context 
 * @param {*} ee 
 * @param {*} next 
 */
async function beforeScenarioHandler(context, ee, next) {
    //Change your function name and add your logic here.
    //For more information, check: https://artillery.io/docs/http-reference/#function-signatures
};

// Exporting
module.exports = {
    beforeRequestHandler: beforeRequestHandler,
    beforeScenarioHandler: beforeScenarioHandler
};