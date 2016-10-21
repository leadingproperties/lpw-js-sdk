describe('OptionsParser class', function(){
  var optionsCase1 = {},
      optionsCase2 = {
        forSale: true,
        forRent: true,
        search: 'Property'
      },
      optionsCase3 = {
        id: 123,
        search: 'Property',
        locale: 'ru',
        page: 2,
        perPage: 6,
        forSale: false,
        forRent: true,
        orderBy: 'desc',
        locationPoint: {
          lat: 55.378051,
          lng: -3.435973,
          radius: 3,
          countryCode: 'GB'
        },
        locationShape: {
          topRight: {
            lat: 60.856553,
            lng: 1.7627096
          },
          bottomLeft: {
            lat: 49.8669688,
            lng: -8.6493571999999
          },
          countryCode: 'GB'
        },
        hdPhotos: true,
        childFriendly: false,
        petsAllowed: true,
        longRent: true,
        shortRent: true,
        persons: 3,
        area: {
          min: 50,
          max: 100
        },
        price: {
          min: 1000,
          max: 2000,
          currency: 'EUR',
          period: 'week'
        },
        propertyTypes: [1,2],
        rooms: [2,3],
        ids: [77,78,79]
      },
      answerCase1 = {
        locale: 'en',
        page: 1,
        per_page: 10,
        for_sale: true,
        for_rent: false
      },
      answerCase3 = {
        id: 123,
        search: 'Property',
        locale: 'ru',
        page: 2,
        per_page: 6,
        for_sale: false,
        for_rent: true,
        order_by: {order: 'desc'},
        location_point: {
          lat: 55.378051,
          lon: -3.435973,
          radius: 3,
          country_code: 'GB'
        },
        location_shape: {
          top_right: {
            lat: 60.856553,
            lon: 1.7627096
          },
          bottom_left: {
            lat: 49.8669688,
            lon: -8.6493571999999
          },
          country_code: 'GB'
        },
        hd_photos: true,
        // child_friendly: false,
        pets_allowed: true,
        long_rent: true,
        short_rent: true,
        persons: 3,
        area: {
          min: 50,
          max: 100
        },
        price: {
          min: 1000,
          max: 2000,
          currency: 'EUR',
          period: 'week'
        },
        property_types: [1,2],
        rooms: [2,3],
        ids: [77,78,79]
      };


  describe('#_getParsedLocationPoint()', function(){
    var helper,
        logger,
        optionsParser,
        argCase1 = {},
        argCase2 = 'some string',
        argCase3 = {
          lat        : 46.111,
          lng        : 10.123,
          countryCode: 'GB'
        },
        ansCase3 = {
          lat        : 46.111,
          lon        : 10.123,
          country_code: 'GB'
        };

    beforeEach(function(){
      helper = new Helper();
      logger = new Logger(true);
      optionsParser = new OptionsParser(helper, logger);
    });

    it('should exist', function(){
      should.exist(optionsParser._getParsedLocationPoint);
    });

    it('should return null and log lat-lon error', function(){
      var myLog = sinon.spy(console, 'log'),
          answer = optionsParser._getParsedLocationPoint(argCase1);
      should.equal(answer, null);
      myLog.calledOnce.should.be.true;
      myLog.firstCall.calledWith('Missing required parameters for locationPoint: lat or lng').should.be.true;
      console.log.restore();
    });

    it('should return null and log arg type error', function(){
      var myLog = sinon.spy(console, 'log'),
          answer = optionsParser._getParsedLocationPoint(argCase2);
      should.equal(answer, null);
      myLog.calledOnce.should.be.true;
      myLog.firstCall.calledWith('locationPoint is not an Object').should.be.true;
      console.log.restore();
    });

    it('should return valid data without console.log call', function(){
      var myLog  = sinon.spy(console, 'log');
      optionsParser._getParsedLocationPoint(argCase3).should.be.eql(ansCase3);
      myLog.notCalled.should.be.true;
      console.log.restore();
    });
  });

  describe('#_getParsedLocationShape()', function(){
    var helper,
        logger,
        optionsParser,
        argCase1 = 1,
        argCase2 = {
          topRight: {
            lat: 0.0,
            lng: 0.0
          }
        },
        argCase3 = {
          bottomLeft: {
            lat: 0.0,
            lng: 0.0
          }
        };

    beforeEach(function(){
      helper = new Helper();
      logger = new Logger(true);
      optionsParser = new OptionsParser(helper, logger);
    });

    it('should exist', function(){
      should.exist(optionsParser._getParsedLocationShape);
    });

    it('should return null and log arg type error', function(){
      var myLog = sinon.spy(console, 'log'),
          answer = optionsParser._getParsedLocationShape(argCase1);
      should.equal(answer, null);
      myLog.calledOnce.should.be.true;
      myLog.firstCall.calledWith('locationShape is not an Object').should.be.true;
      console.log.restore();
    });

    it('should return null and log arg bottomLeft error', function(){
      var myLog = sinon.spy(console, 'log'),
          answer = optionsParser._getParsedLocationShape(argCase2);
      should.equal(answer, null);
      myLog.calledOnce.should.be.true;
      myLog.firstCall.calledWith('Invalid value of locationShape.bottomLeft').should.be.true;
      console.log.restore();
    });

    it('should return null and log arg topRight error', function(){
      var myLog = sinon.spy(console, 'log'),
          answer = optionsParser._getParsedLocationShape(argCase3);
      should.equal(answer, null);
      myLog.calledOnce.should.be.true;
      myLog.firstCall.calledWith('Invalid value of locationShape.topRight').should.be.true;
      console.log.restore();
    });
  });

  describe('#_getParsedArea()', function(){
    var helper,
        logger,
        optionsParser,
        argCase1 = 12,
        argCase2 = {bar: 'foo'},
        argCase3 = {min: 20, max: 50};

    beforeEach(function(){
      helper = new Helper();
      logger = new Logger(true);
      optionsParser = new OptionsParser(helper, logger);
    });

    it('should exist', function(){
      should.exist(optionsParser._getParsedArea);
    });

    it('should return null and log arg type error', function(){
      var myLog = sinon.spy(console, 'log'),
          answer = optionsParser._getParsedArea(argCase1);
      should.equal(answer, null);
      myLog.calledOnce.should.be.true;
      myLog.firstCall.calledWith('getProperties options: options.area is not an Object').should.be.true;
      console.log.restore();
    });

    it('should return null and log invalid range error', function(){
      var myLog = sinon.spy(console, 'log');
      should.equal(optionsParser._getParsedArea(argCase2), null);
      myLog.calledOnce.should.be.true;
      myLog.firstCall.calledWith('getProperties options: Required at least one property `min` or `max` in options.area').should.be.true;
      console.log.restore();
    });

    it('should return valid value without logging', function(){
      var myLog  = sinon.spy(console, 'log');
      optionsParser._getParsedArea(argCase3).should.be.eql(argCase3);
      myLog.notCalled.should.be.true;
      console.log.restore();
    });
  });

  describe('#_getParsedPrice()', function(){
    var helper,
        logger,
        optionsParser;

    var argCase1 = {},
        argCase2 = {
          min: 1000,
          max: 2000
        },
        argCase3 = {
          min: 1000,
          max: 2000,
          currency: 'USD'
        },
        argCase4 = {
          min: 1000,
          max: 2000,
          currency: 'USD',
          period: 'week'
        };

    beforeEach(function(){
      helper = new Helper();
      logger = new Logger(true);
      optionsParser = new OptionsParser(helper, logger);
    });

    it('should exist', function(){
      should.exist(optionsParser._getParsedPrice);
    });

    it('should return null and log error if no min/max specified', function(){
      var myLog = sinon.spy(console, 'log');
      should.equal(optionsParser._getParsedPrice(argCase1), null);
      myLog.calledOnce.should.be.true;
      myLog.firstCall.calledWith('getProperties options: Required at least one property `min` or `max` in options.price').should.be.true;
      console.log.restore();
    });

    it('should return null and log error if no currency specified', function(){
      var myLog = sinon.spy(console, 'log');
      should.equal(optionsParser._getParsedPrice(argCase2), null);
      myLog.calledOnce.should.be.true;
      myLog.firstCall.calledWith('getProperties options: Missing property `currency` in options.price').should.be.true;
      console.log.restore();
    });

    it('should return null and log error if no period specified when for_rent is true', function(){
      var myLog = sinon.spy(console, 'log');
      should.equal(optionsParser._getParsedPrice(argCase3, true), null);
      myLog.calledOnce.should.be.true;
      myLog.firstCall.calledWith('getProperties options: Missing property `period` in options.price').should.be.true;
      console.log.restore();
    });

    it('should return valid value without logging', function(){
      var myLog  = sinon.spy(console, 'log');
      optionsParser._getParsedPrice(argCase4).should.be.eql(argCase4);
      myLog.notCalled.should.be.true;
      console.log.restore();
    });
  });

  describe('#getParsedOptions()', function(){
    var helper,
        logger,
        optionsParser,
        answer;

    beforeEach(function(){
      helper = new Helper();
      logger = new Logger();
      optionsParser = new OptionsParser(helper, logger);
    });

    it('should exist', function(){
      optionsParser.getParsedOptions.should.exist;
    });

    it('should return default structured data', function(){
      answer = optionsParser.getParsedOptions(optionsCase1);
      answer.should.be.eql(answerCase1);
    });

    it('should return for_rent:true and for_sale:false', function(){
      answer = optionsParser.getParsedOptions(optionsCase2);
      answer.for_rent.should.be.eql(true);
      answer.for_sale.should.be.eql(false);
    });

    it('should accept and return all options', function(){
      answer = optionsParser.getParsedOptions(optionsCase3);
      answer.should.be.eql(answerCase3);
    });

  });

  describe('#getSerializedOptions()', function(){
    var helper,
        logger,
        optionsParser;

    beforeEach(function(){
      helper = new Helper();
      logger = new Logger();
      optionsParser = new OptionsParser(helper, logger);
    });

    it('should exist', function(){
      optionsParser.getSerializedOptions.should.exist;
    });

    it('should remove first "&" sign', function(){
      optionsParser.getSerializedOptions({}).charAt(0).should.not.be.equal('&');
    });

    it('should serialize number,string,boolean as &key=value', function(){
      var arg = {
            page   : 1,
            forSale: true,
            search : 'Some search query'
          },
          ans = 'search=Some search query&locale=en&page=1&per_page=10&for_sale=true&for_rent=false';
      optionsParser.getSerializedOptions(arg).should.be.equal(ans);
    });

    it('should serialize array as &key[]=value', function(){
      var arg = {
            propertyTypes: [1, 2]
          },
          ans = 'locale=en&page=1&per_page=10&for_sale=true&for_rent=false&property_types[]=1&property_types[]=2';
      optionsParser.getSerializedOptions(arg).should.be.equal(ans);
    });

    it('should serialize hash as &propertyName[key]=value', function(){
      var arg = {
            area: {
              min: 50,
              max: 100
            }
          },
          ans = 'locale=en&page=1&per_page=10&for_sale=true&for_rent=false&area[min]=50&area[max]=100';
      optionsParser.getSerializedOptions(arg).should.be.equal(ans);
    });

  });
});