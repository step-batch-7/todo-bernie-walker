const { Server } = require('http');
const { generateResponse } = require('./lib/handlers.js');
const { stdout, argv } = process;
const [, , portNumber] = argv;

const main = function() {
  const server = new Server((request, response) => {
    const { socket } = request;
    stdout.write(
      `connected to ${socket.remoteAddress} at ${socket.remotePort}\n`
    );

    request.on('close', () => {
      stdout.write('REQUEST ENDED\n');
    });
    generateResponse(request, response);
  });

  server.listen(portNumber, () => {
    stdout.write(`Server started at port ${server.address().port}\n`);
  });
};

main();
