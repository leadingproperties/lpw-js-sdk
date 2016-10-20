function OptionsParser(helper, logger){
  this.helper = helper;
  this.logger = logger;
}

OptionsParser.prototype.getParsedOptions = function(options){
  var $this         = this,
      parsedOptions = {
        id            : options.id || null,
        search        : options.search || null,
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

OptionsParser.prototype._getParsedLocationPoint = function(locationPoint){
  if(!this.helper.isObject(locationPoint)){
    this.logger.log('locationPoint is not an Object');
    return null;
  }

  if(!(locationPoint.hasOwnProperty('lat') && locationPoint.hasOwnProperty('lon'))){
    this.logger.log('Missing required parameters for locationPoint: lat or lon');
    return null;
  }

  return this.helper.cleanObject({
                                   lat         : locationPoint.lat,
                                   lon         : locationPoint.lon,
                                   radius      : locationPoint.radius,
                                   country_code: locationPoint.countryCode
                                 });
};

OptionsParser.prototype._getParsedLocationShape = function(locationShape){
  if(!this.helper.isObject(locationShape)){
    this.logger.log('locationShape is not an Object');
    return null;
  }

  if(!(locationShape.hasOwnProperty('topRight') && this.helper.isObject(locationShape.topRight) &&
    locationShape.topRight.hasOwnProperty('lat') && locationShape.topRight.hasOwnProperty('lon'))){
    this.logger.log('Invalid value of locationShape.topRight');
    return null;
  }

  if(!(locationShape.hasOwnProperty('bottomLeft') && this.helper.isObject(locationShape.bottomLeft)
    && locationShape.bottomLeft.hasOwnProperty('lat') && locationShape.bottomLeft.hasOwnProperty('lon'))){
    this.logger.log('Invalid value of locationShape.bottomLeft');
    return null;
  }

  return this.helper.cleanObject({
                                   top_right   : locationShape.topRight,
                                   bottom_left : locationShape.bottomLeft,
                                   country_code: locationShape.countryCode
                                 });
};

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

  return priceHash;
};

//https://www.leadingproperties.com/property_objects?area%5Bmax%5D=100&area%5Bmin%5D=50&for_rent=true&for_sale=false&long_rent=false&page=1&per_page=12&rooms%5B%5D=1&rooms%5B%5D=2&short_rent=false
//https://www.leadingproperties.com/property_objects?area[max]=100&area[min]=50&for_rent=true&for_sale=false&long_rent=false&page=1&per_page=12&rooms[]=1&rooms[]=2&short_rent=false