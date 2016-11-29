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