const request = require('supertest');
const { generateResponse } = require('../lib/handlers.js');

describe('serveStatic', function() {
  context('GET /', function() {
    it('responds with index.html', function(done) {
      request(generateResponse)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html')
        .expect('Content-Length', '627')
        .expect(/ToDo/)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });
  });

  context('GET /css/styleIndex.css', function() {
    it('should respond with the style sheet', function(done) {
      request(generateResponse)
        .get('/css/styleIndex.css')
        .expect(200)
        .expect('Content-Type', 'text/css')
        .expect('Content-Length', '585')
        .expect(/\.add-new-button/)
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });
  });

  context('GET js', function() {
    it.skip('should respond with js file', function(done) {
      request(generateResponse)
        .get('/js/')
        .expect(200)
        .expect('Content-Type', 'application/javascript')
        .end(err => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    });
  });
});

describe('handleWhenNoResponse', function() {
  it('should respond with file not found', function(done) {
    request(generateResponse)
      .get('/helloWorld')
      .expect(404)
      .expect('404 Not found')
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });

  it('should respond with fileNotFound when resource is directory', function(done) {
    request(generateResponse)
      .get('/../lib')
      .expect(404)
      .expect('404 Not found')
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});

describe('handleWrongMethod', function() {
  it('should respond with unprocessable entity', function(done) {
    request(generateResponse)
      .put('/helloWorld')
      .expect(422)
      .expect('Bad Request')
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});
