const fs = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const { List } = require('./list');
const { readDataStore, writeToDataStore } = require('./dataStoreAccessor');
const CONTENT_TYPES = require('./mimeTypes');
const { wrongMethod, notFound } = require('./statusCode.json');

const handleWrongMethod = function(request, response) {
  response.writeHead(wrongMethod);
  response.end('Bad Request');
};

const handleWhenNoResource = function(request, response) {
  response.writeHead(notFound);
  response.end('404 Not found');
};

const parseUrl = function(url) {
  const fileName = url === '/' ? '/index.html' : url;
  const ext = fileName.match(/.*\.(.*)$/);
  const [, extension] = ext ? ext : [];
  return { fileName, extension };
};

const serveStatic = function(request, response, next) {
  const { fileName, extension } = parseUrl(request.url);
  const filePath = `./public${fileName}`;

  try {
    const content = fs.readFileSync(filePath);
    response.setHeader('Content-type', CONTENT_TYPES[extension]);
    response.end(content);
  } catch (error) {
    next();
  }
};

const serveTasksList = function(request, response) {
  const taskList = JSON.stringify(readDataStore());
  response.setHeader('Content-Type', CONTENT_TYPES['json']);
  response.end(taskList);
};

const markItem = function(request, response, next) {
  const list = List.load(readDataStore());
  list.markItem(request.body.toMark);
  list.write(writeToDataStore);
  next();
};

const editTodo = function(request, response) {
  const list = List.load(readDataStore());
  const { id, title } = request.body;
  list.editTodo(id, title);
  list.write(writeToDataStore);
  response.end();
};

const editItem = function(request, response) {
  const list = List.load(readDataStore());
  const { id, title } = request.body;
  list.editItem(id, title);
  list.write(writeToDataStore);
  response.end();
};

const deleteItem = function(request, response, next) {
  const list = List.load(readDataStore());
  list.deleteItem(request.body.toDelete);
  list.write(writeToDataStore);
  next();
};

const deleteTodo = function(request, response, next) {
  const list = List.load(readDataStore());
  list.deleteTodo(request.body.toDelete);
  list.write(writeToDataStore);
  next();
};

const addNewItem = function(request, response, next) {
  const list = List.load(readDataStore());
  const { title, to } = request.body;
  list.addItem(to, title);
  list.write(writeToDataStore);
  next();
};

const addNewTodo = function(request, response, next) {
  const list = List.load(readDataStore());
  list.addTodo(request.body.title);
  list.write(writeToDataStore);
  next();
};

const recordBody = function(request, response, next) {
  let body = '';

  request.setEncoding('utf8');

  request.on('data', chunk => {
    body += chunk;
  });

  request.on('end', () => {
    request.body = querystring.parse(body);
    next();
  });
};

const attachGetHandlers = function(app) {
  app.get('/taskList$', serveTasksList);
  app.get('', serveStatic);
  app.get('', handleWhenNoResource);
};

const attachDeleteHandlers = function(app) {
  app.delete('/deleteTodo$', deleteTodo);
  app.delete('/deleteItem$', deleteItem);
  app.delete('', serveTasksList);
};

const attachPostHandlers = function(app) {
  app.post('/editTodo$', editTodo);
  app.post('/editItem$', editItem);
  app.post('/addNewTodo$', addNewTodo);
  app.post('/addNewItem$', addNewItem);
  app.post('/markItem', markItem);
  app.post('', serveTasksList);
};

const initiateApp = function() {
  const app = new App();

  app.use(recordBody);
  attachPostHandlers(app);
  attachDeleteHandlers(app);
  attachGetHandlers(app);
  app.use(handleWrongMethod);

  return app;
};

const generateResponse = function(request, response) {
  const app = initiateApp();
  app.serve(request, response);
};

module.exports = { generateResponse };
