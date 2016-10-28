describe('Connector class', function(){
  describe('#readPropertyById()', function(){
    var connector,
        // server,
        xhr,
        requests,
        singlePropId = 70979;

    var fakeResponseBody = {
      property_objects: [
        {
          id  : singlePropId,
          code: 'US-70979',
          slug: 'us-70979-apartments-for-sale-in-fendi-chateau-residences-near-miami-beach'
        }
      ]
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
        connector.readPropertyById(singlePropId, callback, function(){});
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
          response.should.have.ownProperty('property_objects');
          response.property_objects.length.should.be.equal(1);
          response.property_objects[0].id.should.be.equal(singlePropId);
          done();
        };
        connector.readPropertyById(singlePropId, myCallback, function(){});
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
  })
});