describe('Helper class', function(){
  describe('#isSuccessHTTPStatus()', function(){
    var helper;

    beforeEach(function(){
      helper = new Helper();
    });

    it('should return true for code 200', function(){
      helper.isSuccessHTTPStatus(200).should.equal(true);
    });

    it('should return false for code 401', function(){
      helper.isSuccessHTTPStatus(401).should.equal(false);
    });

  });

  describe('#getTransformedResponse()', function(){
    var helper;

    beforeEach(function(){
      helper = new Helper();
    });

    it('should always return stable hash', function(){
      var response = helper.getTransformedResponse();
      response.should.be.an('object');
      response.should.have.property('data');
      response.should.have.property('status');
      response.should.have.property('statusText');
    });
  });

  describe('#isArray()', function(){
    var helper;

    beforeEach(function(){
      helper = new Helper();
    });

    it('should return false', function(){
      helper.isArray('foo').should.be.equal(false);
      helper.isArray(1).should.be.equal(false);
      helper.isArray(undefined).should.be.equal(false);
      helper.isArray(null).should.be.equal(false);
      helper.isArray({}).should.be.equal(false);
    });

    it('should return true', function(){
      helper.isArray([]).should.be.equal(true);
      helper.isArray(new Array('1')).should.be.equal(true);
    });
  });

  describe('#isObject()', function(){
    var helper;

    beforeEach(function(){
      helper = new Helper();
    });

    it('should return false', function(){
      helper.isObject('foo').should.be.equal(false);
      helper.isObject(1).should.be.equal(false);
      helper.isObject(undefined).should.be.equal(false);
      helper.isObject(null).should.be.equal(false);
      helper.isObject([]).should.be.equal(false);
      helper.isObject(new Array('1')).should.be.equal(false);
    });

    it('should return true', function(){
      helper.isObject({}).should.be.equal(true);
    });
  });
});