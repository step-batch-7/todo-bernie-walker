const fs = require('fs');
const request = require('supertest');
const sandbox = require('sinon').createSandbox();
const { generateResponse } = require('../lib/handlers.js');

describe('POST /addNewTodo', function() {
  before(function() {
    let FAKE_DATA = [
      {
        listId: '123',
        title: 'helloWorld',
        items: [
          {
            itemId: '0',
            task: 'create main page',
            done: 'true'
          }
        ]
      }
    ];

    const writeToFake = (path, toWrite) => {
      FAKE_DATA = JSON.parse(toWrite);
    };
    sandbox.replace(fs, 'writeFileSync', writeToFake);
    const fakeReader = () => {
      return JSON.stringify(FAKE_DATA);
    };
    sandbox.replace(fs, 'readFileSync', fakeReader);
  });

  after(function() {
    sandbox.restore();
  });

  it('respond with updated task list', function(done) {
    request(generateResponse)
      .post('/addNewTodo')
      .send('title=sampleText')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect('Content-Length', '153')
      .expect(/"title":"sampleText"/)
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});

describe('POST /addNewItem', function() {
  before(function() {
    let FAKE_DATA = [
      {
        listId: '123',
        title: 'helloWorld',
        items: []
      }
    ];
    const writeToFake = (path, toWrite) => {
      FAKE_DATA = JSON.parse(toWrite);
    };
    sandbox.replace(fs, 'writeFileSync', writeToFake);
    const fakeReader = () => JSON.stringify(FAKE_DATA);
    sandbox.replace(fs, 'readFileSync', fakeReader);
  });

  after(function() {
    sandbox.restore();
  });

  it('respond with updated task list', function(done) {
    request(generateResponse)
      .post('/addNewItem')
      .send('title=sampleText&to=123')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect('Content-Length', '101')
      .expect(/"task":"sampleText"/)
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});

describe('DELETE /deleteTodo', function() {
  before(function() {
    let FAKE_DATA = [
      {
        listId: '123',
        title: 'helloWorld',
        items: [
          {
            itemId: '0',
            task: 'create main page',
            done: 'true'
          }
        ]
      }
    ];
    const writeToFake = (path, toWrite) => {
      FAKE_DATA = JSON.parse(toWrite);
    };
    sandbox.replace(fs, 'writeFileSync', writeToFake);
    const fakeReader = () => JSON.stringify(FAKE_DATA);
    sandbox.replace(fs, 'readFileSync', fakeReader);
  });

  after(function() {
    sandbox.restore();
  });

  it('should respond with the updated task list', function(done) {
    request(generateResponse)
      .delete('/deleteTodo')
      .send('toDelete=123')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect('Content-Length', '2')
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});

describe('DELETE /deleteItem', function() {
  before(function() {
    let FAKE_DATA = [
      {
        listId: '123',
        title: 'helloWorld',
        items: [
          {
            itemId: '123_0',
            task: 'create main page',
            done: 'true'
          },
          {
            itemId: '123_1',
            task: 'style main page',
            done: 'false'
          }
        ]
      }
    ];
    const writeToFake = (path, toWrite) => {
      FAKE_DATA = JSON.parse(toWrite);
    };
    sandbox.replace(fs, 'writeFileSync', writeToFake);
    const fakeReader = () => JSON.stringify(FAKE_DATA);
    sandbox.replace(fs, 'readFileSync', fakeReader);
  });

  after(function() {
    sandbox.restore();
  });

  it('should respond with the updated task list', function(done) {
    request(generateResponse)
      .delete('/deleteItem')
      .send('toDelete=123_0')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect('Content-Length', '108')
      .expect(/123_1.*style main/)
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});

describe('POST /markItem', function() {
  before(function() {
    let FAKE_DATA = [
      {
        listId: '123',
        title: 'helloWorld',
        items: [
          {
            itemId: '123_0',
            task: 'create main page',
            done: false
          }
        ]
      }
    ];
    const writeToFake = (path, toWrite) => {
      FAKE_DATA = JSON.parse(toWrite);
    };
    sandbox.replace(fs, 'writeFileSync', writeToFake);
    const fakeReader = () => JSON.stringify(FAKE_DATA);
    sandbox.replace(fs, 'readFileSync', fakeReader);
  });

  after(function() {
    sandbox.restore();
  });

  it('should respond with the updated task list', function(done) {
    request(generateResponse)
      .post('/markItem')
      .send('toMark=123_0')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect('Content-Length', '106')
      .expect(/"done":true/)
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});

describe('POST /editTodo', function() {
  before(function() {
    let FAKE_DATA = [
      {
        listId: '123',
        title: 'helloWorld',
        items: []
      }
    ];
    const writeToFake = (path, toWrite) => {
      FAKE_DATA = JSON.parse(toWrite);
    };
    sandbox.replace(fs, 'writeFileSync', writeToFake);
    const fakeReader = () => JSON.stringify(FAKE_DATA);
    sandbox.replace(fs, 'readFileSync', fakeReader);
  });

  after(function() {
    sandbox.restore();
  });

  it('should respond with the updated task list', function(done) {
    request(generateResponse)
      .post('/editTodo')
      .send('title=changedText&id=123')
      .expect(200)
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});

describe('GET /taskList', function() {
  before(function() {
    const FAKE_DATA = [
      {
        listId: 123,
        title: 'helloWorld',
        items: [
          {
            itemId: '123_0',
            task: 'create main page',
            done: 'true'
          }
        ]
      }
    ];
    const fakeFileReader = sandbox.stub(fs, 'readFileSync');
    fakeFileReader.returns(JSON.stringify(FAKE_DATA));
  });

  after(function() {
    sandbox.restore();
  });

  it('should respond with taskList json', function(done) {
    request(generateResponse)
      .get('/taskList')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect('Content-Length', '106')
      .expect(/helloWorld/)
      .expect(/"itemId":"123_0"/)
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});

describe('serveStatic', function() {
  context('GET /', function() {
    it('responds with index.html', function(done) {
      request(generateResponse)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html')
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

  context('GET index.js', function() {
    it('should respond with js file', function(done) {
      request(generateResponse)
        .get('/js/index.js')
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
      .head('/helloWorld')
      .expect(422)
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});
