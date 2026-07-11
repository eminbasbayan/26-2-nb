const http = require('node:http');

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'content-type': 'text/plain' });
  response.end('Hello World!');
});

server.listen(3000, () => {
  console.log('Server 3000 portunda çalışıyor');
});
