const { readFileSync } = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const {
  listTasks,
  appendTaskToList,
  appendItemToList,
  deleteTaskFromList,
  deleteItemFromList,
  markItemOnList
} = require('./taskList');
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
    const content = readFileSync(filePath);
    response.setHeader('Content-type', CONTENT_TYPES[extension]);
    response.end(content);
  } catch (error) {
    next();
  }
};

const serveTasksList = function(request, response) {
  const taskList = listTasks();
  response.setHeader('Content-Type', CONTENT_TYPES['json']);
  response.end(taskList);
};

const markItem = function(request, response, next) {
  markItemOnList(request.body);
  next();
};

const deleteItem = function(request, response, next) {
  deleteItemFromList(request.body);
  next();
};

const deleteTask = function(request, response, next) {
  deleteTaskFromList(request.body);
  next();
};

const addNewItem = function(request, response, next) {
  appendItemToList(request.body);
  next();
};

const addNewTask = function(request, response, next) {
  appendTaskToList(request.body);
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
  app.delete('/deleteTask$', deleteTask);
  app.delete('/deleteTask$', serveTasksList);
  app.delete('/deleteItem$', deleteItem);
  app.delete('/deleteItem$', serveTasksList);
};

const attachPostHandlers = function(app) {
  app.post('/taskListAddNew$', addNewTask);
  app.post('/taskListAddNew$', serveTasksList);
  app.post('/addNewItem$', addNewItem);
  app.post('/addNewItem$', serveTasksList);
  app.post('/markItem', markItem);
  app.post('/markItem', serveTasksList);
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
