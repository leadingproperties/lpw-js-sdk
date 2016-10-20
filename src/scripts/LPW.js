function LPW(token, debugEnabled){
  this.connector = new Connector(token);
  this.helper = new Helper();
  this.logger = new Logger(debugEnabled);
  this.optionsParser = new OptionsParser(this.helper, this.logger);
}

LPW.prototype.getProperties = function(options, userCallback){
  if(typeof userCallback !== 'function' && typeof options !== 'function'){
    this.logger.log('getProperties: Callback required.');
    return;
  }

  if(typeof options === 'function'){
    userCallback = options;
    options = {};
  }

  options = this.optionsParser.getSerializedOptions(options);

  this.connector.getProperties(
    options,
    this.getPropertiesSuccess.bind(this, userCallback),
    this.getPropertiesError.bind(this, userCallback)
  );
};

LPW.prototype.getPropertyById = function(id, userCallback){
  id = parseInt(id, 10);

  if(typeof userCallback !== 'function'){
    this.logger.log('getPropertyById: Callback required.');
    return;
  }

  if(isNaN(id)){
    this.logger.log('getPropertyById: ID is not a number');
    return;
  }

  this.connector.getPropertyById(
    id,
    this.getPropertyByIdSuccess.bind(this, userCallback),
    this.getPropertiesError.bind(this, userCallback)
  );
};

//----------------------------------------------------------------------------------------
// Callbacks
//----------------------------------------------------------------------------------------
LPW.prototype.getPropertiesSuccess = function(userCallback, XMLHttpRequest){
  var data   = this.helper.isSuccessHTTPStatus(XMLHttpRequest.status) ? JSON.parse(XMLHttpRequest.response) : null,
      answer = this.helper.getTransformedResponse(data, XMLHttpRequest);
  userCallback(answer);
};

LPW.prototype.getPropertiesError = function(userCallback, XMLHttpRequest){
  userCallback(this.helper.getTransformedResponse(null, XMLHttpRequest));
};

LPW.prototype.getPropertyByIdSuccess = function(userCallback, XMLHttpRequest){
  // console.debug('getPropertyByIdSuccess', JSON.parse(XMLHttpRequest.response));
  var data   = this.helper.isSuccessHTTPStatus(XMLHttpRequest.status) ? JSON.parse(XMLHttpRequest.response) : null,
      answer = this.helper.getTransformedResponse(data, XMLHttpRequest);
  userCallback(answer);
};

window.LPW = LPW;