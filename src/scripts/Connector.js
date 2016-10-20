function Connector(token){
  this.token = token;
  this.apiPath = 'https://lpw-public-api.herokuapp.com'
}

Connector.prototype.getProperties = function(options, onLoadCallback, onErrorCallback){
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

Connector.prototype.getPropertyById = function(id, onLoadCallback, onErrorCallback){
  var url     = this.apiPath + '/property_objects/?id=' + id,
      request = new XMLHttpRequest();

  request.open('GET', url, true);
  request.setRequestHeader('Authorization', 'Token token=' + this.token);
  request.onload = onLoadCallback.bind(this, request);
  request.onerror = onErrorCallback.bind(this, request);
  request.send(null);
};