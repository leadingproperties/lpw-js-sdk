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