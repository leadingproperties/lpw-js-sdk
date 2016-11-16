describe('Build test', function(){
  var lpw;
  beforeEach(function(){
    lpw = new LPW('etd4xUyDUMsa47sQBwNB');
  });

  describe('#getProperties()', function(){
    it('should exist', function(){
      lpw.getProperties.should.exist;
    });

    it('should accept callback and call it with structured data', function(done){
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
    var propertyId = 70979;

    it('should exist', function(){
      should.exist(lpw.getPropertyById);
    });

    it('should accept callback and call it with structured data', function(done){
      lpw.getPropertyById(70979, null, function(answer){
        answer.data.should.exist;
        answer.status.should.exist;
        answer.statusText.should.exist;
        answer.should.be.an('object');
        answer.data.id.should.be.equal(propertyId);
        done();
      });
    });
  });

  describe('#getCurrencies()', function(){
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
  });

  describe('#setLocale()', function(){
    it('should exist', function(){
      should.exist(lpw.setLocale);
    });

    it('should set locale', function(){
      lpw.setLocale('ru');
      lpw.locale.should.be.equal('ru');
    });
  });
});