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
 * @param {function} onLoadCallback
 * @param {function} onErrorCallback
 *
 * @since 1.0.0
 */
Connector.prototype.readProperties = function(options, onLoadCallback, onErrorCallback){
  var url     = this.apiPath + '/property_objects',
      request = new XMLHttpRequest();

  if(typeof options === 'string' && options.length > 0){
    url = url + '?' + options
  }

  request.open('GET', url, true);
  request.setRequestHeader('Authorization', 'Token token=' + this.token);
  request.onload = onLoadCallback.bind(this, request);
  request.onerror = onErrorCallback.bind(this, request);
  request.send(null);
};

/**
 * Sends request to propertyObjects controller only with id parameter
 * @param {number} id
 * @param {function} onLoadCallback
 * @param {function} onErrorCallback
 *
 * @since 1.0.0
 */
Connector.prototype.readPropertyById = function(id, onLoadCallback, onErrorCallback){
  var url     = this.apiPath + '/property_objects/?id=' + id,
      request = new XMLHttpRequest();

  request.open('GET', url, true);
  request.setRequestHeader('Authorization', 'Token token=' + this.token);
  request.onload = onLoadCallback.bind(this, request);
  request.onerror = onErrorCallback.bind(this, request);
  request.send(null);
};