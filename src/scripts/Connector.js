/**
 * Public API connector
 * @param {string} token
 * @constructor
 *
 * @since 1.0.0
 */
function Connector(token){
  this.token = token;
  this.apiPath = 'https://lpw-public-api.herokuapp.com'
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

  this._defaultRequest(url, 'GET', lpwCallback);
};

/**
 * Sends request to propertyObjects controller only with id parameter
 * @param {number} id - property id
 * @param {function} lpwCallback
 *
 * @since 1.0.0
 */
Connector.prototype.readPropertyById = function(id, lpwCallback){
  this._defaultRequest(this.apiPath + '/property_objects/?id=' + id, 'GET', lpwCallback);
};

/**
 * Sends request to currencies controller
 * @param {function} lpwCallback
 *
 * @since 1.0.0
 */
Connector.prototype.readCurrencies = function(lpwCallback){
  this._defaultRequest(this.apiPath + '/currencies', 'GET', lpwCallback);
};

/**
 * Default requester
 * @param {String} url - request url
 * @param {String} method - HTTP ('GET', 'POST', etc.) method
 * @param lpwCallback - lpw instance callback
 * @private
 *
 * @since 1.0.0
 */
Connector.prototype._defaultRequest = function(url, method, lpwCallback){
  var request = new XMLHttpRequest();
  method = method || 'GET';

  request.open(method, url, true);
  request.setRequestHeader('Authorization', 'Token token=' + this.token);
  request.onload = lpwCallback.bind(this, request);
  request.onerror = lpwCallback.bind(this, request);
  request.send(null);
};