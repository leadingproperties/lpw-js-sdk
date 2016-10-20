function Helper(){

}

Helper.prototype.isSuccessHTTPStatus = function(status){
  return status >= 200 && status < 400;
};

Helper.prototype.getTransformedResponse = function(data, XMLHttpRequest){
  return {
    data      : data || null,
    status    : XMLHttpRequest ? XMLHttpRequest.status : 0,
    statusText: XMLHttpRequest ? XMLHttpRequest.statusText : ''
  };
};
Helper.prototype.isArray = function(any){
  return typeof any === 'object' && any instanceof Array && Object.prototype.toString.call( any ) === '[object Array]';
};

Helper.prototype.isObject = function(any){
  return any === Object(any) && Object.prototype.toString.call( any ) !== '[object Array]';
};

Helper.prototype.cleanObject = function(object){
  if(!this.isObject(object)){
    return object;
  }

  for(var prop in object){
    if(object.hasOwnProperty(prop) && (object[prop] === null || object[prop] === undefined)){
      delete object[prop];
    }
  }

  return object;
};