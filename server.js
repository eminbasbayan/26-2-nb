const http = require('node:http');
const fs = require('node:fs');

const server = http.createServer((request, response) => {
  const egitmen = {
    firstName: 'Emin',
    lastName: 'Başbayan',
  };

  response.writeHead(200, { 'content-type': 'text/html' });
  const htmlFile = fs.readFileSync('./index.html', 'utf-8');
  response.end(htmlFile);
});

server.listen(3000, () => {
  console.log('Server 3000 portunda çalışıyor');
});
