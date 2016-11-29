/**
 * Public API connector
 * @param {string} token
 * @constructor
 *
 * @since 1.0.0
 */
function Connector(token){
  this.token = token;
  this.apiPath = 'https://lpw-public-api.herokuapp.com';
}

/**
 * Sends request to propertyObjects controller with different options
 * @param {object} options
 * @param {function} lpwCallback
 *
 * @since 1.0.0
 */
Connector.prototype.readProperties = function(options, lpwCallback){
  var url     = this.apiPath + '/property_objects';

  if(typeof options === 'string' && options.length > 0){
    url = url + '?' + options
  }

  this._defaultRequest(url, 'GET', null, lpwCallback);
};

/**
 * Sends request to propertyObjects controller only with id parameter
 * @param {number} id - property id
 * @param {string} locale - locale
 * @param {function} lpwCallback
 *
 * @since 1.0.0
 */
Connector.prototype.readPropertyById = function(id, locale, lpwCallback){
  this._defaultRequest(this.apiPath + '/property_objects/' + id + '?locale=' + locale, 'GET', null, lpwCallback);
};

/**
 * Sends request to currencies controller
 * @param {function} lpwCallback
 *
 * @since 1.0.0
 */
Connector.prototype.readCurrencies = function(lpwCallback){
  this._defaultRequest(this.apiPath + '/currencies', 'GET', null, lpwCallback);
};

/**
 * Sends request to PDF controller
 * @param {number} id - property id
 * @param {boolean} forRent - request pdf with rent or sale data
 * @param {string} locale - pdf language
 * @param {function} lpwCallback
 *
 * @since 1.0.0
 */
Connector.prototype.readPDF = function(id, forRent, locale, lpwCallback){
  this._defaultRequest(this.apiPath + '/' + locale + '/pdf/' + id + (forRent ? '?for_rent=true' : ''), 'GET', null, lpwCallback);
};

/**
 * Sends request to total counters controller
 * @param {function} lpwCallback
 *
 * @since 1.0.0
 */
Connector.prototype.readTotalCounters = function(lpwCallback){
  this._defaultRequest(this.apiPath + '/counters/global', 'GET', null, lpwCallback);
};

/**
 * Default requester
 * @param {String} url - request url
 * @param {String} method - HTTP ('GET', 'POST', etc.) method
 * @param {Object} headers - HTTP headers
 * @param lpwCallback - lpw instance callback
 * @private
 *
 * @since 1.0.0
 */
Connector.prototype._defaultRequest = function(url, method, headers, lpwCallback){
  var request = new XMLHttpRequest();
  method = method || 'GET';

  request.open(method, url, true);
  request.setRequestHeader('Authorization', 'Token token=' + this.token);
  if(headers){
    for(var prop in headers){
      request.setRequestHeader(prop, headers[prop]);
    }
  }
  request.onload = lpwCallback.bind(this, request);
  request.onerror = lpwCallback.bind(this, request);
  request.send(null);
};