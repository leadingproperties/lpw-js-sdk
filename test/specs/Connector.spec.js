describe('Connector class', function(){
  // var apiPath = 'https://lpw-public-api.herokuapp.com';
  var apiPath = 'https://staging-lpw-public-api.herokuapp.com';

  describe('#readPropertyById()', function(){
    var connector,
        // server,
        xhr,
        requests,
        singlePropId = 70979;

    var fakeResponseBody = {
      id  : singlePropId,
      code: 'US-70979',
      slug: 'us-70979-apartments-for-sale-in-fendi-chateau-residences-near-miami-beach'
    };

    beforeEach(function(){
      connector = new Connector('etd4xUyDUMsa47sQBwNB');
    });

    it('should exist', function(){
      should.exist(connector.readPropertyById);
    });

    describe('isolated', function(){
      beforeEach(function(){
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function(req){ requests.push(req); };
      });

      afterEach(function(){
        xhr.restore();
      });

      it('should make request and return XMLHttpRequest with response', function(){
        var callback = sinon.spy();
        connector.readPropertyById(singlePropId, 'en', callback);
        requests[0].respond(
          200,
          {"Content-Type": "application/json"},
          JSON.stringify(fakeResponseBody)
        );
        callback.calledOnce.should.be.true;
        callback.args.length.should.be.equal(1);
        callback.args[0][0].responseText.should.be.eql(JSON.stringify(fakeResponseBody));
      });
    });

    describe('live', function(){
      it('should make request and return XMLHttpRequest with response', function(done){
        var myCallback = function(request){
          var response = JSON.parse(request.response);
          request.should.exist;
          request.status.should.be.equal(200);
          response.should.have.ownProperty('id');
          response.should.have.ownProperty('code');
          response.id.should.be.equal(singlePropId);
          done();
        };
        connector.readPropertyById(singlePropId, 'en', myCallback);
      });
    });
  });

  describe('#readProperties()', function(){
    var connector,
        server,
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
    });

    it('should exist', function(){
      should.exist(connector.readProperties);
    });

    describe('isolated', function(){
      beforeEach(function(){
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function(req){ requests.push(req); };
      });

      afterEach(function(){
        xhr.restore();
      });

      it('should make request and return XMLHttpRequest with response', function(){
        var callback = sinon.spy();
        connector.readProperties(options, callback, function(){});
        requests[0].respond(
          200,
          {"Content-Type": "application/json"},
          JSON.stringify(fakeResponseBody)
        );
        callback.calledOnce.should.be.true;
        callback.args.length.should.be.equal(1);
        callback.args[0][0].responseText.should.be.eql(JSON.stringify(fakeResponseBody));
      });
    });

    describe('live', function(){
      it('should make request and return XMLHttpRequest with response', function(done){
        this.timeout(3000);
        var myCallback = function(request){
          var response = JSON.parse(request.response);
          request.should.exist;
          request.status.should.be.equal(200);
          response.should.have.ownProperty('property_objects');
          response.property_objects.length.should.be.above(1);
          done();
        };
        connector.readProperties(options, myCallback, function(){});
      });
    })
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
    });

    it('should exist', function(){
      should.exist(connector.readCurrencies);
    });

    describe('isolated', function(){
      beforeEach(function(){
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function(req){ requests.push(req); };
      });

      afterEach(function(){
        xhr.restore();
      });

      it('should make GET request to /currencies and return XMLHttpRequest with response', function(){
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
        callback.args[0][0].url.should.be.equal(apiPath + '/currencies');
      });
    });

    describe('live', function(){
      it('should make request and call userCallback with answer as first argument', function(done){
        this.timeout(3000);
        var myCallback = function(request){
          console.log(request);
          var response = JSON.parse(request.response);
          request.should.exist;
          request.status.should.be.equal(200);
          response.should.have.ownProperty('currencies');
          response.currencies.length.should.be.above(0);
          done();
        };
        connector.readCurrencies(myCallback);
      });
    })
  })
});