describe('PDF class', function(){
  var token = 'etd4xUyDUMsa47sQBwNB',
      propertyId = 70979,
      xhr,
      server,
      requests,
      connector,
      pdf;

  describe('#requestPDF()', function(){
    beforeEach(function(){
      var connector = new Connector(token);
      pdf       = new PDF(connector);

      requests = [];
      xhr = sinon.useFakeXMLHttpRequest();
      xhr.onCreate = function(xhr){
        requests.push(xhr);
      };
    });

    afterEach(function(){
      xhr.restore();
    });

    it('should reset attempts and call doRequest method', function(){
      var callback = sinon.spy();
      sinon.spy(pdf, "doRequest");
      pdf.attempt = 10;
      pdf.requestPDF(propertyId, false, 'en', callback);
      pdf.attempt.should.be.equal(1);
      pdf.doRequest.calledOnce.should.be.true;
      pdf.doRequest.calledWith(propertyId, false, 'en', callback).should.be.true;
      pdf.doRequest.restore();
    });
  });

  describe('#doRequest()', function(){
    describe('attempt condition', function(){
      beforeEach(function(){
        connector = new Connector(token);
        pdf       = new PDF(connector);

        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];

        xhr.onCreate = function (xhr) {
          requests.push(xhr);
        };
      });

      afterEach(function(){
        xhr.restore();
      });

      it('should increment attempt and call connector.readPDF', function(){
        sinon.spy(connector, "readPDF");
        pdf.doRequest(propertyId, false, 'en', function(){});
        pdf.attempt.should.be.equal(1);
        connector.readPDF.calledOnce.should.be.true;
        connector.readPDF.calledWith(propertyId, false, 'en').should.be.true;
        connector.readPDF.restore();
      });

      it('should reset attempt, reset timeout and not call connector.readPDF', function(){
        sinon.spy(connector, "readPDF");
        sinon.spy(pdf, "resetTimeout");
        pdf.attempt = 20;
        pdf.doRequest(propertyId, false, 'en', function(){});
        pdf.attempt.should.be.equal(0);
        pdf.resetTimeout.calledOnce.should.be.true;
        connector.readPDF.callCount.should.be.equal(0);
        connector.readPDF.restore();
        pdf.resetTimeout.restore();
      });
    });

    describe('requests behavior', function(){
      beforeEach(function(){
        connector = new Connector(token);
        pdf       = new PDF(connector);

        requests = [];
        server = sinon.fakeServer.create({
                                           respondImmediately: true
                                         });
      });

      afterEach(function(){
        server.restore();
      });

      it('should call LPW callback with `false` after few attempts (async)', function(done){
        this.timeout(9000);
        sinon.spy(pdf, 'doRequest');
        pdf.attemptsMax = 3;
        pdf.attempt = 0;

        server.respondWith([200, { "Content-Type": "application/json" },
                            '{ "error": "In progress" }']);
        var myCallback = function(answer){
          pdf.doRequest.callCount.should.be.equal(4);
          pdf.attempt.should.be.equal(0);
          answer.should.be.false;
          pdf.doRequest.restore();
          done();
        };
        pdf.doRequest(propertyId, false, 'en', myCallback);
      });

      it('should call LPW callback with XMLHttpRequest (async)', function(done){
        this.timeout(9000);
        sinon.spy(pdf, 'doRequest');
        pdf.attemptsMax = 3;
        pdf.attempt = 0;
        server.respondWith([200, { "Content-Type": "application/json" },
                            '{ "pdf_path": "Some path" }']);
        var myCallback = function(answer){
          pdf.doRequest.callCount.should.be.equal(1);
          pdf.attempt.should.be.equal(0);
          answer.should.be.an.instanceof(XMLHttpRequest);
          pdf.doRequest.restore();
          done();
        };
        pdf.doRequest(propertyId, false, 'en', myCallback);
      });
    });
  });

  describe('#hasPath()', function(){
    beforeEach(function(){
      var connector = new Connector(token);
      pdf       = new PDF(connector);
    });

    it('should validate answer with pdf_path', function(){
      pdf.hasPath(true).should.be.not.ok;
      pdf.hasPath(null).should.be.not.ok;
      pdf.hasPath({foo: 'bar'}).should.be.not.ok;
      pdf.hasPath('answer').should.be.not.ok;
      pdf.hasPath({pdf_path: 'some_path'}).should.be.ok;
    });
  });
});