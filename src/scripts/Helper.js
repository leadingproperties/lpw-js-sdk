/**
 * Helper class containing methods called from several places
 * @constructor
 */
function Helper(){

}

/**
 * Checks if HTTP status is between 200 and 400
 * @param status
 * @returns {boolean}
 *
 * @since 1.0.0
 */
Helper.prototype.isSuccessHTTPStatus = function(status){
  return status >= 200 && status < 400;
};

/**
 * Returns structured answer from XMLHttpRequest
 * @param {*} data
 * @param {object} XMLHttpRequest
 * @returns {{data: (*|null), status: number, statusText: string}}
 *
 * @since 1.0.0
 */
Helper.prototype.getTransformedResponse = function(data, XMLHttpRequest){
  return {
    data      : data || null,
    status    : XMLHttpRequest ? XMLHttpRequest.status : 0,
    statusText: XMLHttpRequest ? XMLHttpRequest.statusText : ''
  };
};

/**
 * Checks if argument is array
 * @param any
 * @returns {boolean}
 *
 * @since 1.0.0
 */
Helper.prototype.isArray = function(any){
  return typeof any === 'object' && any instanceof Array && Object.prototype.toString.call(any) === '[object Array]';
};

/**
 * Checks if argument is object
 * @param any
 * @returns {boolean}
 *
 * @since 1.0.0
 */
Helper.prototype.isObject = function(any){
  return any === Object(any) && Object.prototype.toString.call(any) !== '[object Array]';
};

/**
 * Removes {null} and {undefined} from {object}
 * @param {object} object
 * @returns {*}
 *
 * @since 1.0.0
 */
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