const { readFileSync } = require('fs');
const { App } = require('./app');
const { listTasks } = require('./taskList');
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

const recordBody = function(request, response, next) {
  let body = '';

  request.setEncoding('utf8');

  request.on('data', chunk => {
    body += chunk;
  });

  request.on('end', () => {
    request.body = body;
    next();
  });
};

const initiateApp = function() {
  const app = new App();

  app.use(recordBody);
  app.get('/taskList', serveTasksList);
  app.get('', serveStatic);
  app.get('', handleWhenNoResource);
  app.use(handleWrongMethod);

  return app;
};

const generateResponse = function(request, response) {
  const app = initiateApp();
  app.serve(request, response);
};

module.exports = { generateResponse };
