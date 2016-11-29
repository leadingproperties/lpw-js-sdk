describe('Build test: LPW', function(){
  var lpw,
      propertyId = 70979,
      propertyCodeRegExp = new RegExp('-' + propertyId);

  beforeEach(function(){
    lpw = new LPW('etd4xUyDUMsa47sQBwNB');
  });

  describe('#getProperties()', function(){
    it('should exist', function(){
      lpw.getProperties.should.exist;
    });

    it('should call user\'s callback with structured answer', function(done){
      lpw.getProperties({}, function(answer){
        answer.should.be.an('object');
        answer.should.have.property('data');
        answer.should.have.property('status');
        answer.should.have.property('statusText');
        answer.should.have.deep.property('data.property_objects');
        answer.data.property_objects.length.should.be.above(0);
        done();
      });
    });
  });

  describe('#getPropertyById()', function(){
    it('should exist', function(){
      should.exist(lpw.getPropertyById);
    });

    it('should call user\'s callback with structured answer', function(done){
      lpw.getPropertyById(propertyId, null, function(answer){
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

    it('should call user\'s callback with structured answer', function(done){
      lpw.getCurrencies(function(answer){
        answer.data.should.exist;
        answer.status.should.exist;
        answer.statusText.should.exist;
        answer.data.currencies.should.exist;
        answer.data.currencies.length.should.be.above(0);
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

  describe('#getPDF()', function(){
    it('should exist', function(){
      should.exist(lpw.getPDF);
    });

    it('should call user\'s callback with structured answer', function(done){
      lpw.getPDF(propertyId, {}, function(answer){
        answer.data.should.be.an('object');
        answer.data.should.have.ownProperty('pdf_path');
        answer.data.pdf_path.should.be.a('string');
        /\.pdf/.test(answer.data.pdf_path).should.be.true;
        propertyCodeRegExp.test(answer.data.pdf_path).should.be.true;
        done();
      })
    });
  });

  describe('#getTotalCounters()', function(){
    it('should exist', function(){
      should.exist(lpw.getTotalCounters);
    });

    it('should call user\'s callback with structured answer', function(done){
      lpw.getTotalCounters(function(answer){
        answer.data.should.be.an('object');
        answer.data.should.have.ownProperty('global_counters');
        answer.data.global_counters.should.have.ownProperty('for_sale');
        answer.data.global_counters.should.have.ownProperty('for_rent');
        answer.data.global_counters.should.have.ownProperty('commercial');
        done();
      })
    });
  });

  describe('#getGeoPoints()', function(){
    it('should exist', function(){
      should.exist(lpw.getGeoPoints);
    });

    it('should call user\'s callback with structured answer', function(done){
      lpw.getGeoPoints('sale', function(answer){
        answer.data.should.be.an('object');
        answer.data.should.have.ownProperty('points');
        answer.data.points.should.be.an('array');
        done();
      })
    });
  })
});