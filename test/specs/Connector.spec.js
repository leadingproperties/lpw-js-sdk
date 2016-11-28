describe('Connector class', function(){
  var propertyId = 70979;

  describe('#readPropertyById()', function(){
    var connector,
        xhr,
        requests,
        singlePropId = propertyId;

    var fakeResponseBody = {
      id  : singlePropId,
      code: 'US-70979',
      slug: 'us-70979-apartments-for-sale-in-fendi-chateau-residences-near-miami-beach'
    };

    beforeEach(function(){
      connector = new Connector('etd4xUyDUMsa47sQBwNB');
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = function(req){ requests.push(req); };
    });

    afterEach(function(){
      xhr.restore();
    });

    it('should exist', function(){
      should.exist(connector.readPropertyById);
    });

    it('should make GET request and call callback with XMLHttpRequest as first argument', function(){
      var callback = sinon.spy();
      connector.readPropertyById(singlePropId, 'en', callback);
      requests[0].respond(
        200,
        {"Content-Type": "application/json"},
        JSON.stringify(fakeResponseBody)
      );
      callback.calledOnce.should.be.true;
      callback.args.length.should.be.equal(1);
      callback.args[0][0].method.should.be.equal('GET');
      callback.args[0][0].responseText.should.be.eql(JSON.stringify(fakeResponseBody));
    });
  });

  describe('#readProperties()', function(){
    var connector,
        xhr,
        requests,
        options          = {},
        fakeResponseBody = {
          property_objects: [
            {
              id  : 100,
              code: 'US-70979',
              slug: 'us-70979-apartments-for-sale-in-fendi-chateau-residences-near-miami-beach'
            },
            {
              id  : 101,
              code: 'US-70979',
              slug: 'us-70979-apartments-for-sale-in-fendi-chateau-residences-near-miami-beach'
            }
          ]
        };


    beforeEach(function(){
      connector = new Connector('etd4xUyDUMsa47sQBwNB');
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = function(req){ requests.push(req); };
    });

    afterEach(function(){
      xhr.restore();
    });

    it('should exist', function(){
      should.exist(connector.readProperties);
    });

    it('should make GET request and call callback with XMLHttpRequest as first argument', function(){
      var callback = sinon.spy();
      connector.readProperties(options, callback);
      requests[0].respond(
        200,
        {"Content-Type": "application/json"},
        JSON.stringify(fakeResponseBody)
      );
      callback.calledOnce.should.be.true;
      callback.args.length.should.be.equal(1);
      callback.args[0][0].method.should.be.equal('GET');
      callback.args[0][0].responseText.should.be.eql(JSON.stringify(fakeResponseBody));
    });
  });

  describe('#readCurrencies()', function(){
    var connector,
        xhr,
        requests,
        fakeResponseBody = {
          currencies: []
        };


    beforeEach(function(){
      connector = new Connector('etd4xUyDUMsa47sQBwNB');
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = function(req){ requests.push(req); };
    });

    afterEach(function(){
      xhr.restore();
    });

    it('should exist', function(){
      should.exist(connector.readCurrencies);
    });

    it('should make GET request and call callback with XMLHttpRequest as first argument', function(){
      var callback = sinon.spy();
      connector.readCurrencies(callback);
      requests[0].respond(
        200,
        {"Content-Type": "application/json"},
        JSON.stringify(fakeResponseBody)
      );
      callback.calledOnce.should.be.true;
      callback.args.length.should.be.equal(1);
      callback.args[0][0].responseText.should.be.eql(JSON.stringify(fakeResponseBody));
      callback.args[0][0].method.should.be.equal('GET');
      callback.args[0][0].url.should.be.equal(connector.apiPath + '/currencies');
    });
  });

  describe('#readPDF()', function(){
    var connector,
        xhr,
        requests,
        fakeResponseBodySuccess = {
          pdf_path: 'PDF_PATH'
        },
        locale = 'en';


    beforeEach(function(){
      connector = new Connector('etd4xUyDUMsa47sQBwNB');
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = function(req){ requests.push(req); };
    });

    afterEach(function(){
      xhr.restore();
    });

    it('should exist', function(){
      should.exist(connector.readPDF);
    });

    it('should make GET request and call callback with XMLHttpRequest as first argument', function(){
      var callback = sinon.spy();
      connector.readPDF(propertyId, false, locale, callback);
      requests[0].respond(
        200,
        {"Content-Type": "application/json"},
        JSON.stringify(fakeResponseBodySuccess)
      );
      callback.calledOnce.should.be.true;
      callback.args.length.should.be.equal(1);
      callback.args[0][0].responseText.should.be.eql(JSON.stringify(fakeResponseBodySuccess));
      callback.args[0][0].method.should.be.equal('GET');
      callback.args[0][0].url.should.be.equal(connector.apiPath + '/' + locale +  '/pdf/' + propertyId);
    });

    it('should add `for_rent` query parameter if present', function(){
      var callback = sinon.spy();
      connector.readPDF(propertyId, true, locale, callback);
      requests[0].respond(
        200,
        {"Content-Type": "application/json"},
        JSON.stringify(fakeResponseBodySuccess)
      );
      callback.calledOnce.should.be.true;
      callback.args.length.should.be.equal(1);
      console.log(callback.args[0][0].url);
      /\?for_rent=true/.test(callback.args[0][0].url).should.be.true;
    });
  });
});