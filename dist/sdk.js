/* @version 1.0.0 | @license MIT */
;(function(window) {
"use strict";

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
 * Sends request to one of geographical points controllers
 * @param {string} endPoint - last part of geographical points controller path
 * @param {function} lpwCallback
 *
 * @since 1.0.0
 */
Connector.prototype.readGeoPionts = function(endPoint, lpwCallback){
  this._defaultRequest(this.apiPath + '/property_objects/' + endPoint, 'GET', null, lpwCallback);
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
var pdf;
/**
 * Main LPW class
 * @param {string} token - API user token
 * @param {constructorOptions} options - configuration data
 * @constructor
 *
 * @since 1.0.0
 */
function LPW(token, options){
  this.locale = (options && options.locale) || 'en';
  this.debugEnabled = (options && options.debugEnabled) || false;

  this.connector = new Connector(token);
  this.helper = new Helper();
  this.logger = new Logger(this.debugEnabled);
  this.optionsParser = new OptionsParser(this.helper, this.logger);

  pdf = new PDF(this.connector);
}

/**
 * Gets properties corresponding to options
 * @param {getPropertiesOptions} options - see getPropertiesOptions typedef
 * @param {userCallback} userCallback
 *
 * @since 1.0.0
 */
LPW.prototype.getProperties = function(options, userCallback){
  if(!userCallback || typeof userCallback !== 'function'){
    throw new TypeError('LPW.getProperties: callback is not a function');
  }

  if(!this.helper.isObject(options)){
    options = {};
  }

  if(!options.locale){
    options.locale = this.locale;
  }

  this.connector.readProperties(
    this.optionsParser.getSerializedOptions(options),
    this.defaultCallback.bind(this, userCallback)
  );
};

/**
 * Gets single property by ID
 * @param {number} id - property id
 * @param {getPropertyByIdOptions} options - config data (see getPropertyByIdOptions typedef)
 * @param {userCallback} userCallback
 *
 * @since 1.0.0
 */
LPW.prototype.getPropertyById = function(id, options, userCallback){
  id = parseInt(id, 10);

  if(typeof userCallback !== 'function'){
    throw new TypeError('LPW.getPropertyById: callback is not a function');
  }

  if(isNaN(id)){
    throw new TypeError('LPW.getPropertyById: ID is not a number');
  }

  if(!this.helper.isObject(options)){
    options = {};
  }

  if(!options.locale){
    options.locale = this.locale;
  }

  this.connector.readPropertyById(
    id,
    options.locale,
    this.defaultCallback.bind(this, userCallback)
  );
};

/**
 * Gets list of available currencies
 * @param {userCallback} userCallback
 *
 * @since 1.0.0
 */
LPW.prototype.getCurrencies = function(userCallback){
  this.connector.readCurrencies(
    this.defaultCallback.bind(this, userCallback)
  );
};

/**
 * Sets default locale
 * @param {string} locale - locale string ISO 639-1 {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes#Partial_ISO_639_table|Wiki}
 *
 * @since 1.0.0
 */
LPW.prototype.setLocale = function(locale){
  if(typeof locale !== 'string'){
    throw new TypeError('LPW.setLocale: locale is not a string');
  }
  this.locale = locale;
};

/**
 * Gets pdf link
 * @param {number} id - property ID
 * @param {getPDFOptions} options
 * @see {@link getPDFOptions}
 * @param {userCallback} userCallback
 *
 * @since 1.0.0
 */
LPW.prototype.getPDF = function(id, options, userCallback){
  id = parseInt(id, 10);

  if(typeof userCallback !== 'function'){
    throw new TypeError('LPW.getPDF: callback is not a function');
  }

  if(isNaN(id)){
    throw new TypeError('LPW.getPDF: ID is not a number');
  }

  var config = {};
  config.forRent = options.forRent || null;
  config.locale = options.locale || this.locale;

  pdf.requestPDF(id, config.forRent, config.locale, this.getPDFCallback.bind(this, userCallback));
};

/**
 * Gets total properties counters
 * @param {userCallback} userCallback
 *
 * @since 1.0.0
 */
LPW.prototype.getTotalCounters = function(userCallback){
  if(typeof userCallback !== 'function'){
    throw new TypeError('LPW.getPDF: callback is not a function');
  }

  this.connector.readTotalCounters(
    this.defaultCallback.bind(this, userCallback)
  );
};

/**
 * Gets geographical points
 * @param {string} type - points for a property offer type (sale, rent or commercial)
 * @param {userCallback} userCallback
 *
 * @since 1.0.0
 */
LPW.prototype.getGeoPoints = function(type, userCallback){
  if(typeof userCallback !== 'function'){
    throw new TypeError('LPW.getPDF: callback is not a function');
  }

  if(type !== 'sale' || type !== 'sale' || type !== 'commercial'){
    this.logger.log('LPW.getGeoPoints: type is not one of: "sale", "rent" or "commercial". "sale" used by default.')
  }

  var endPoint;
  switch (type){
    case 'rent':
      endPoint = 'rent_geo_points';
      break;
    case 'commercial':
      endPoint = 'invest_geo_points';
      break;
    default:
      endPoint = 'geo_points';
      break;
  }

  this.connector.readGeoPionts(
    endPoint,
    this.defaultCallback.bind(this, userCallback)
  );
};

//----------------------------------------------------------------------------------------
// Callbacks
//----------------------------------------------------------------------------------------
/**
 * Calls user callback with request response as argument
 * @param {userCallback} userCallback
 * @param {object} XMLHttpRequest
 *
 * @since 1.0.0
 */
LPW.prototype.defaultCallback = function(userCallback, XMLHttpRequest){
  var data   = this.helper.isSuccessHTTPStatus(XMLHttpRequest.status) ? JSON.parse(XMLHttpRequest.response) : null,
      answer = this.helper.getTransformedResponse(data, XMLHttpRequest);
  userCallback(answer);
};

/**
 * Calls user callback with request response as argument.
 * Only for getPDF method.
 * @param {userCallback} userCallback
 * @param {object} XMLHttpRequest
 *
 * @since 1.0.0
 */
LPW.prototype.getPDFCallback = function(userCallback, XMLHttpRequest){
  var data = XMLHttpRequest && this.helper.isSuccessHTTPStatus(XMLHttpRequest.status) ? JSON.parse(XMLHttpRequest.response) : null,
      answer = this.helper.getTransformedResponse(data, (XMLHttpRequest ? XMLHttpRequest : {status: 408, statusText: 'Request Timeout'}));
  userCallback(answer);
};

window.LPW = LPW;

//----------------------------------------------------------------------------------------
// Definitions
//----------------------------------------------------------------------------------------
/**
 * User callback
 * @callback userCallback
 * @param {userCallbackAnswer} answer from the API
 */

/**
 * Answer for userCallback
 * @typedef {object} userCallbackAnswer
 * @property {(*|null)} data - Public API answer
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status test
 */

/**
 * @typedef {object} constructorOptions
 * @property {string} locale - default locale
 * @property {boolean} debugEnabled - enable/disable errors logging
 */

/**
 * @typedef {object} getPropertyByIdOptions
 * @property {string} locale - locale
 * @property {boolean} forSale - show property data for sale
 * @property {boolean} forRent - show property data for rent
 */

/**
 * @typedef {object} getPDFOptions
 * @property {string} locale - locale
 * @property {boolean} forRent - show information for rent if true and for sale if false or not present
 */

/**
 * @typedef {object} locationPoint
 * @property {number} lat - latitude
 * @property {number} lng - longitude
 * @property {number} radius - radius from the point (km) to search in
 * @property {string} countryCode - country code (https://en.wikipedia.org/wiki/ISO_3166-1) to filter properties
 *                                  only from this country
 */

/**
 * @typedef {object} locationShape
 * @property {locationPoint} topRight - top-right point of target shape
 * @property {locationPoint} bottomLeft - bottom-left point of target shape
 * @property {string} countryCode - country code (https://en.wikipedia.org/wiki/ISO_3166-1) to filter properties
 *                                  only from this country
 */

/**
 * @typedef {object} propertyPrice
 * @property {number} min - minimum price
 * @property {number} max - maximum price
 * @property {string} currency - currency code
 * @property {'day'|'week'|'month'} [period] - rent period. Required only in rent query (optional)
 *
 * @description Requires min and|or max and currency code. Period is used only for properties for rent.
 */

/**
 * Available options for getPropertiesOptions
 * @typedef {object} getPropertiesOptions
 * @property {number} id - single property id
 * @property {string} search - search query
 * @property {string} locale - language of the response translations
 * @property {number}[1] page - pagination page
 * @property {number}[10] perPage - properties per page
 * @property {boolean} forSale - show properties for sale
 * @property {boolean} forRent - show properties for rent
 * @property {string} orderBy - asc/desc order of properties
 * @property {locationPoint} locationPoint - geographical point to search around (see locationPoint typedef)
 * @property {locationShape} locationShape - geographical shape to search in (see locationShape typedef)
 * @property {boolean} hdPhotos - only show properties with HQ photos
 * @property {object} area - area filter, sq.m. (min and|or max, see example below)
 * @property {object} price - price filter (see propertyPrice typedef)
 * @property {array.<number>} propertyTypes - array of property types ids
 * @property {array.<number>} rooms - array of room numbers
 * @property {array.<number>} ids - array of properties ids
 *
 *
 * Rent-only properties:
 * @property {boolean} childFriendly - show only child-friendly properties
 * @property {boolean} petsAllowed - show properties only where pets allowed
 * @property {boolean} longRent - show properties for long rent
 * @property {boolean} shortRent - show properties for short rent
 * @property {number} persons - max persons allowed to rent
 *
 *
 *
 * @example area
 * {min: 50,max: 100} or {min: 50} or {max: 100}
 *
 * @example rooms
 * [1] or [1,3,5]
 */

/**
 * A number, or a string containing a number.
 * @typedef {(number|string)} NumberLike
 */
function Logger(enabled){
  this.enabled = enabled || false;
}

Logger.prototype.log = function(string){
  if(this.enabled){
    console.log(string);
  }
};

Logger.prototype.logError = function(){

};
/**
 * LPW.getProperties options parser
 * @param helper
 * @param logger
 * @constructor
 * @since 1.0.0
 */
function OptionsParser(helper, logger){
  this.helper = helper;
  this.logger = logger;
}

/**
 * Parses and removes {null|undefined} values from options hash
 * @param {object} options
 * @since 1.0.0
 */
OptionsParser.prototype.getParsedOptions = function(options){
  var $this         = this,
      parsedOptions = {
        id            : options.id || null,
        locale        : options.locale || 'en',
        page          : options.page || 1,
        per_page      : options.perPage || 10,
        for_sale      : !options.forRent,
        for_rent      : !!options.forRent,
        order_by      : options.orderBy ? {order: options.orderBy} : null,
        location_point: options.locationPoint ? $this._getParsedLocationPoint(options.locationPoint) : null,
        location_shape: options.locationShape ? $this._getParsedLocationShape(options.locationShape) : null,
        hd_photos     : options.hdPhotos || null,  //don't send if falsy
        area          : options.area ? $this._getParsedArea(options.area) : null,
        price         : options.price ? $this._getParsedPrice(options.price, options.forRent) : null,
        property_types: options.propertyTypes && $this.helper.isArray(options.propertyTypes) ? options.propertyTypes : null,
        rooms         : options.rooms && $this.helper.isArray(options.rooms) ? options.rooms : null,
        ids           : options.ids && $this.helper.isArray(options.ids) ? options.ids : null
      };

  //rent only
  if(parsedOptions.for_rent){
    parsedOptions.child_friendly = (parsedOptions.for_rent && options.childFriendly) || null; //don't send if falsy
    parsedOptions.pets_allowed = (parsedOptions.for_rent && options.petsAllowed) || null; //don't send if falsy
    parsedOptions.long_rent = (parsedOptions.for_rent && options.longRent) || null; //don't send if falsy
    parsedOptions.short_rent = (parsedOptions.for_rent && options.shortRent) || null; //don't send if falsy
    parsedOptions.persons = parsedOptions.for_rent ? options.persons || null : null;
  }

  return this.helper.cleanObject(parsedOptions);
};

/**
 * Serializes options hash
 * @param {object} options
 * @returns {string}
 * @since 1.0.0
 */
OptionsParser.prototype.getSerializedOptions = function(options){
  var paramsString = '';
  options = this.getParsedOptions(options);

  for(var prop in options){
    if(options.hasOwnProperty(prop)){
      if(this.helper.isArray(options[prop])){
        for(var i = 0; i < options[prop].length; i++){
          paramsString += '&' + prop + '[]=' + options[prop][i];
        }
      }else if(this.helper.isObject(options[prop])){
        for(var objProp in options[prop]){
          if(options[prop].hasOwnProperty(objProp)){
            paramsString += '&' + prop + '[' + objProp + ']=' + options[prop][objProp];
          }
        }
      }else{
        paramsString += '&' + prop + '=' + options[prop];
      }
    }
  }

  if(paramsString.charAt(0) === '&'){
    paramsString = paramsString.slice(1);
  }

  return paramsString;
};

/**
 * Parses and validates options.locationPoint
 * @param {object} locationPoint
 * @returns {null|Object}
 * @private
 * @since 1.0.0
 */
OptionsParser.prototype._getParsedLocationPoint = function(locationPoint){
  if(!this.helper.isObject(locationPoint)){
    this.logger.log('locationPoint is not an Object');
    return null;
  }

  if(!(locationPoint.hasOwnProperty('lat') && locationPoint.hasOwnProperty('lng'))){
    this.logger.log('Missing required parameters for locationPoint: lat or lng');
    return null;
  }

  return this.helper.cleanObject({
                                   lat         : locationPoint.lat,
                                   lon         : locationPoint.lng,
                                   radius      : locationPoint.radius,
                                   country_code: locationPoint.countryCode
                                 });
};

/**
 * Parses and validates options.locationShape
 * @param {object} locationShape
 * @returns {null|object}
 * @private
 * @since 1.0.0
 */
OptionsParser.prototype._getParsedLocationShape = function(locationShape){
  if(!this.helper.isObject(locationShape)){
    this.logger.log('locationShape is not an Object');
    return null;
  }

  if(!(locationShape.hasOwnProperty('topRight') && this.helper.isObject(locationShape.topRight) &&
    locationShape.topRight.hasOwnProperty('lat') && locationShape.topRight.hasOwnProperty('lng'))){
    this.logger.log('Invalid value of locationShape.topRight');
    return null;
  }

  if(!(locationShape.hasOwnProperty('bottomLeft') && this.helper.isObject(locationShape.bottomLeft)
    && locationShape.bottomLeft.hasOwnProperty('lat') && locationShape.bottomLeft.hasOwnProperty('lng'))){
    this.logger.log('Invalid value of locationShape.bottomLeft');
    return null;
  }

  return this.helper.cleanObject({
                                   top_right   : {
                                     lat: locationShape.topRight.lat,
                                     lon: locationShape.topRight.lng
                                   },
                                   bottom_left : {
                                     lat: locationShape.bottomLeft.lat,
                                     lon: locationShape.bottomLeft.lng
                                   },
                                   country_code: locationShape.countryCode
                                 });
};

/**
 * Parses and validates options.area
 * @param {object} areaHash
 * @returns {null|object}
 * @private
 * @since 1.0.0
 */
OptionsParser.prototype._getParsedArea = function(areaHash){
  if(!this.helper.isObject(areaHash)){
    this.logger.log('getProperties options: options.area is not an Object');
    return null;
  }

  if(!(areaHash.hasOwnProperty('min') || areaHash.hasOwnProperty('max'))){
    this.logger.log('getProperties options: Required at least one property `min` or `max` in options.area');
    return null;
  }

  return areaHash;
};

/**
 * Parses and validates options.price
 * @param {object} priceHash
 * @param {boolean} isRent
 * @returns {null|object}
 * @private
 * @since 1.0.0
 */
OptionsParser.prototype._getParsedPrice = function(priceHash, isRent){
  isRent = isRent || false;
  if(!this.helper.isObject(priceHash)){
    this.logger.log('getProperties options: options.price is not an Object');
    return null;
  }

  if(!(priceHash.hasOwnProperty('min') || priceHash.hasOwnProperty('max'))){
    this.logger.log('getProperties options: Required at least one property `min` or `max` in options.price');
    return null;
  }

  if(!priceHash.hasOwnProperty('currency')){
    this.logger.log('getProperties options: Missing property `currency` in options.price');
    return null;
  }

  if(isRent && !priceHash.hasOwnProperty('period')){
    this.logger.log('getProperties options: Missing property `period` in options.price');
    return null;
  }

  return this.helper.cleanObject(priceHash);
};
/**
 * PDF
 * @param connector
 * @constructor
 *
 * @since 1.0.0
 */
function PDF(connector){
  this.attemptsMax = 20;
  this.attempt = 0;
  this.delay = 1000;
  this.timeoutID = undefined;

  this.connector = connector;
}

/**
 * Starts request pdf loop.
 * @param {number} id - property ID
 * @param {boolean} forRent - pdf with info for rent or sale. Sale is default
 * @param {string} locale - pdf locale
 * @param {function} lpwCallback
 *
 * @since 1.0.0
 */
PDF.prototype.requestPDF = function(id, forRent, locale, lpwCallback){
  this.attempt = 0;
  this.doRequest(id, forRent, locale, lpwCallback);
};

/**
 * Checks if attempts limit reached.
 * If it does - resets attempts and timeout, calls lpwCallback and stops execution.
 * If doesn't - increments attempt and calls connector.readPDF
 * @param {number} id - property ID
 * @param {boolean} forRent - pdf with info for rent or sale. For sale is default
 * @param {string} locale - pdf locale
 * @param {function} lpwCallback
 *
 * @since 1.0.0
 */
PDF.prototype.doRequest = function(id, forRent, locale, lpwCallback){
  if(this.attempt >= this.attemptsMax){
    this.attempt = 0;
    this.resetTimeout();
    lpwCallback(false);
    return;
  }
  this.attempt++;
  this.connector.readPDF(id, forRent, locale, this.pdfCallback.bind(this, id, forRent, locale, lpwCallback));
};

/**
 * Checks if valid answer was received.
 * If it does - resets attempts and timeout, calls lpwCallback and stops execution.
 * If doesn't - continues loop by calling doRequest again
 * @param {number} id - property ID
 * @param {boolean} forRent - pdf with info for rent or sale. Sale is default
 * @param {string} locale - pdf locale
 * @param {function} lpwCallback
 * @param {object} XMLHttpRequest
 *
 * @since 1.0.0
 */
PDF.prototype.pdfCallback = function(id, forRent, locale, lpwCallback, XMLHttpRequest){
  this.resetTimeout();

  if(XMLHttpRequest.response){
    var parsedResponse = JSON.parse(XMLHttpRequest.response);
    if(this.hasPath(parsedResponse)){
      this.attempt = 0;
      lpwCallback(XMLHttpRequest);
      return;
    }
  }

  this.timeoutID = setTimeout(function(){
    this.doRequest(id, forRent, locale, lpwCallback);
  }.bind(this), this.delay);
};

/**
 * Resets Timeout if present
 *
 * @since 1.0.0
 */
PDF.prototype.resetTimeout = function(){
  if(this.timeoutID){
    clearTimeout(this.timeoutID);
    this.timeoutID = undefined;
  }
};

/**
 * Checks if API answer has pdf_path
 * @param object
 * @returns {boolean}
 *
 * @since 1.0.0
 */
PDF.prototype.hasPath = function(object){
  return !!(object && object.hasOwnProperty('pdf_path') && object.pdf_path);
};
}(window));

//# sourceMappingURL=sdk.js.map
