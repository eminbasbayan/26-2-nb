const http = require('node:http');

const server = http.createServer((request, response) => {
  const egitmen = {
    firstName: 'Emin',
    lastName: 'Başbayan',
  };

  response.writeHead(200, { 'content-type': 'application/json' });
  response.end(JSON.stringify(egitmen));
});

server.listen(3000, () => {
  console.log('Server 3000 portunda çalışıyor');
});
