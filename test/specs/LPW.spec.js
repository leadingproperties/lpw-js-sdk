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
    var lpw;

    beforeEach(function(){
      lpw = new LPW('etd4xUyDUMsa47sQBwNB');
    });

    it('should exist', function(){
      should.exist(lpw.getPropertyById);
    });

    // it('should return false for code 401', function(){
    //   helper.isSuccessHTTPStatus(401).should.equal(false);
    // });

  });
});