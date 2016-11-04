describe('LPW class', function(){
  describe('#getProperties()', function(){
    var lpw;

    beforeEach(function(){
      lpw = new LPW('etd4xUyDUMsa47sQBwNB', true);
    });

    it('should exist', function(){
      lpw.getProperties.should.exist;
    });

    it('should return undefined and log a message once if no callback specified', function(){
      should.not.exist(lpw.getProperties());
    });

    it('should return undefined if callback is not a function', function(){
      should.not.exist(lpw.getProperties({}));
    });

    it('should log a message once if callback is not a function', function(){
      var myLog = sinon.spy(console, 'log');
      lpw.getProperties();
      myLog.should.be.called;
      myLog.callCount.should.be.equal(1);
      console.log.restore();
    });

    it('should return object as callback argument', function(done){
      lpw.getProperties({}, function(answer){
        answer.should.be.an('object');
        done();
      });
    });

    it('should return object with necessary data', function(done){
      lpw.getProperties({}, function(answer){
        answer.should.be.an('object');
        answer.should.have.property('data');
        answer.should.have.property('status');
        answer.should.have.property('statusText');
        answer.should.have.deep.property('data.property_objects');
        done();
      });
    });
  });

  describe('#getPropertyById()', function(){
    var lpw,
        propertyId = 70979;

    beforeEach(function(){
      lpw = new LPW('etd4xUyDUMsa47sQBwNB');
    });

    it('should exist', function(){
      should.exist(lpw.getPropertyById);
    });

    it('should accept id and callback and call it with structured data', function(done){
      lpw.getPropertyById(70979, function(answer){
        answer.data.should.exist;
        answer.status.should.exist;
        answer.statusText.should.exist;
        answer.data.property_objects.length.should.be.equal(1);
        answer.data.property_objects[0].id.should.be.equal(propertyId);
        done();
      });
    });
  });

  describe('#getCurrencies()', function(){
    var lpw;

    beforeEach(function(){
      lpw = new LPW('etd4xUyDUMsa47sQBwNB');
    });

    it('should exist', function(){
      should.exist(lpw.getCurrencies);
    });

    it('should accept callback and call it with structured data', function(done){
      lpw.getCurrencies(function(answer){
        answer.data.should.exist;
        answer.status.should.exist;
        answer.statusText.should.exist;
        answer.data.currencies.should.exist;
        done();
      });
    });
  })
});