describe('LPW class', function(){
  var propertyId = 70979,
      lpw,
      xhr,
      requests;

  describe('#getProperties()', function(){
    var fakeResponse            = {
          property_objects: [],
          offmarket       : 10,
          total           : 20
        },
        fakeResponseStringified = JSON.stringify(fakeResponse);
    beforeEach(function(){
      lpw = new LPW('etd4xUyDUMsa47sQBwNB', {debugEnabled: true});
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = function (xhr) {
        requests.push(xhr);
      };
    });

    afterEach(function(){
      xhr.restore();
    });

    it('should exist', function(){
      lpw.getProperties.should.exist;
    });

    it('should throw TypeError if no userCallback or userCallback is not a function', function(){
      should.Throw(function(){lpw.getProperties()}, TypeError);
    });

    it('should call userCallback with answer as first argument', function(){
      var callback = sinon.spy();
      lpw.getProperties({}, callback);
      requests[0].respond(
        200,
        {"Content-Type": "application/json"},
        fakeResponseStringified
      );
      callback.calledOnce.should.be.true;
      var answer = callback.args[0][0];
      answer.data.should.exist;
      answer.data.should.be.an('object');
      answer.data.should.have.ownProperty('property_objects');
      answer.data.should.have.ownProperty('offmarket');
      answer.data.should.have.ownProperty('total');
      answer.status.should.be.a('number');
      answer.statusText.should.be.a('string');
    });
  });

  describe('#getPropertyById()', function(){
    var fakeResponse            = {
          id: propertyId
        },
        fakeResponseStringified = JSON.stringify(fakeResponse);

    beforeEach(function(){
      lpw = new LPW('etd4xUyDUMsa47sQBwNB', {debugEnabled: true});
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = function (xhr) {
        requests.push(xhr);
      };
    });

    afterEach(function(){
      xhr.restore();
    });

    it('should exist', function(){
      should.exist(lpw.getPropertyById);
    });

    it('should throw TypeError if id is not a number', function(){
      should.Throw(function(){lpw.getPropertyById('a', {}, function(){})}, TypeError);
    });

    it('should throw TypeError if callback is not a function', function(){
      should.Throw(function(){lpw.getPropertyById(propertyId, {}, {})}, TypeError);
    });

    it('should call userCallback with answer as first argument', function(){
      var callback = sinon.spy();
      lpw.getPropertyById(propertyId, {}, callback);
      requests[0].respond(
        200,
        {"Content-Type": "application/json"},
        fakeResponseStringified
      );
      callback.calledOnce.should.be.true;
      var answer = callback.args[0][0];
      answer.data.should.exist;
      answer.data.should.be.an('object');
      answer.data.should.have.ownProperty('id');
      answer.status.should.be.a('number');
      answer.statusText.should.be.a('string');
    });
  });

  describe('#getCurrencies()', function(){
    var fakeResponse            = {
          currencies: []
        },
        fakeResponseStringified = JSON.stringify(fakeResponse);

    beforeEach(function(){
      lpw = new LPW('etd4xUyDUMsa47sQBwNB');
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = function (xhr) {
        requests.push(xhr);
      };
    });

    afterEach(function(){
      xhr.restore();
    });

    it('should exist', function(){
      should.exist(lpw.getCurrencies);
    });

    it('should call userCallback with answer as first argument', function(){
      var callback = sinon.spy();
      lpw.getCurrencies(callback);
      requests[0].respond(
        200,
        {"Content-Type": "application/json"},
        fakeResponseStringified
      );
      callback.calledOnce.should.be.true;
      var answer = callback.args[0][0];
      answer.data.should.exist;
      answer.data.should.be.an('object');
      answer.data.should.have.ownProperty('currencies');
      answer.status.should.be.a('number');
      answer.statusText.should.be.a('string');
    });
  });

  describe('#setLocale()', function(){
    var lpw;

    beforeEach(function(){
      lpw = new LPW('etd4xUyDUMsa47sQBwNB');
    });

    it('should exist', function(){
      should.exist(lpw.setLocale);
    });

    it('should throw TypeError if locale is not string', function(){
      should.Throw(function(){lpw.setLocale()}, TypeError);
    });

    it('should set locale', function(){
      lpw.setLocale('ru');
      lpw.locale.should.be.equal('ru');
    });
  });

  describe('#getPDF()', function(){
    var fakeResponse            = {
          pdf_path: 'PDF_PATH'
        },
        fakeResponseStringified = JSON.stringify(fakeResponse);

    beforeEach(function(){
      lpw = new LPW('etd4xUyDUMsa47sQBwNB');
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = function (xhr) {
        requests.push(xhr);
      };
    });

    afterEach(function(){
      xhr.restore();
    });

    it('should exist', function(){
      should.exist(lpw.getPDF);
    });

    it('should call userCallback with answer as first argument', function(){
      var callback = sinon.spy();
      lpw.getPDF(propertyId, {}, callback);
      requests[0].respond(
        200,
        {"Content-Type": "application/json"},
        fakeResponseStringified
      );
      callback.calledOnce.should.be.true;
      var answer = callback.args[0][0];
      answer.data.should.exist;
      answer.data.should.be.an('object');
      answer.data.should.have.ownProperty('pdf_path');
      answer.status.should.be.equal(200);
      answer.statusText.should.be.equal('OK');
    });
  });

  describe('#getTotalCounters()', function(){
    var fakeResponse            = {
          global_counters: {
            for_sale: 3734,
            for_rent: 4,
            commercial: 32
          }
        },
        fakeResponseStringified = JSON.stringify(fakeResponse);

    beforeEach(function(){
      lpw = new LPW('etd4xUyDUMsa47sQBwNB');
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = function (xhr) {
        requests.push(xhr);
      };
    });

    afterEach(function(){
      xhr.restore();
    });

    it('should exist', function(){
      should.exist(lpw.getTotalCounters);
    });

    it('should throw TypeError if callback is not a function', function(){
      should.Throw(function(){lpw.getTotalCounters()}, TypeError);
    });

    it('should call userCallback with answer as first argument', function(){
      var callback = sinon.spy();
      lpw.getTotalCounters(callback);
      requests[0].respond(
        200,
        {"Content-Type": "application/json"},
        fakeResponseStringified
      );
      callback.calledOnce.should.be.true;
      var answer = callback.args[0][0];
      answer.data.should.exist;
      answer.data.should.be.an('object');
      answer.data.should.have.ownProperty('global_counters');
      answer.status.should.be.equal(200);
      answer.statusText.should.be.equal('OK');
    });
  });

  describe('#getGeoPoints()', function(){
    var fakeResponse            = {
          points: []
        },
        fakeResponseStringified = JSON.stringify(fakeResponse);

    beforeEach(function(){
      lpw = new LPW('etd4xUyDUMsa47sQBwNB');
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = function (xhr) {
        requests.push(xhr);
      };
    });

    afterEach(function(){
      xhr.restore();
    });

    it('should exist', function(){
      should.exist(lpw.getGeoPoints);
    });

    it('should throw TypeError if callback is not a function', function(){
      should.Throw(function(){lpw.getGeoPoints()}, TypeError);
    });

    it('should log warning if type is not in sale, rent or commercial', function(){
      lpw.logger.enabled = true;
      sinon.spy(console, 'log');
      lpw.getGeoPoints('foo', function(){});
      console.log.calledOnce.should.be.true;
      console.log.restore();
    });

    it('should fall back to sale if type not in sale, rent or commercial', function(){
      var callback = sinon.spy();
      lpw.getGeoPoints('foo', callback);
      requests[0].respond(
        200,
        {"Content-Type": "application/json"},
        fakeResponseStringified
      );
      /\/property_objects\/geo_points/.test(requests[0].url).should.be.true;
    });

    it('should call userCallback with answer as first argument', function(){
      var callback = sinon.spy();
      lpw.getGeoPoints('commercial', callback);
      requests[0].respond(
        200,
        {"Content-Type": "application/json"},
        fakeResponseStringified
      );
      callback.calledOnce.should.be.true;
      var answer = callback.args[0][0];
      answer.data.should.exist;
      answer.data.should.be.an('object');
      answer.data.should.have.ownProperty('points');
      answer.status.should.be.equal(200);
      answer.statusText.should.be.equal('OK');
    });
  });
});