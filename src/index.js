var OAuth = require('oauth');

import Customers from './Customers';
import Documents from './Documents';

import OAuthManager from 'react-native-oauth';

const DEFAULT_ENDPOINT = 'https://apifeed.sellsy.com/0'

const api = {
  url: '/',
  requestTokenUrl: '/request_token',
  accessTokenUrl: '/access_token',
};


function Sellsy({ creds = {}, endPoint = DEFAULT_ENDPOINT  } = {}) {
  this.creds = creds;
  this.endPoint = endPoint;
  this.customers = new Customers(this);
  this.documents = new Documents(this);
}

Sellsy.prototype.api = function({ method = 'Infos.getInfos', params = {}} = {}) {
  const getOauth = async () => {

    // return new OAuth.OAuth(
    //   this.endPoint + api.requestTokenUrl,
    //   this.endPoint + api.accessTokenUrl,
    //   this.creds.consumerKey,
    //   this.creds.consumerSecret,
    //   '1.0',
    //   null,
    //   'PLAINTEXT'
    // );

    const manager = new OAuthManager('sellsy')
    manager.configure({
        sellsy: {
          consumer_key: this.creds.consumerKey,
          consumer_secret: this.creds.consumerSecret,
          user_token: this.creds.userToken,
          user_secret: this.creds.userSecret,
          request_url: this.endPoint + api.requestTokenUrl,
          access_url: this.endPoint + api.accessTokenUrl
        }
    })
    let result = await manager.authorize('google')
    console.log(result)
      return result
  }

  return new Promise(async (resolve, reject) => {
    const postData = {
      request: 1,
      io_mode: 'json',
      do_in: JSON.stringify({
        method: method,
        params: params
      })
    };

    let auth = await getOauth()
    auth.post(
      this.endPoint + api.url,
      this.creds.userToken,
      this.creds.userSecret,
      postData,
      function(e, data, res) {
        try {
          if (e) {
            console.log('oauth.error', e);
            console.log('Sellsy.api OAUTH ERROR', method, params);
            return reject(e);
          }
          if (data.error) {
            console.log('oauth.data.error', data.error);
            console.log('Sellsy.api ERROR', method, params);
            return reject(data.error);
          }
          //console.log('Sellsy.api', method, params, data);
          resolve(JSON.parse(data));
        } catch(err) {
          reject(err);
        }
      }
    );
  })

}

export default Sellsy;
module.exports = Sellsy;
