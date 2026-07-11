const http = require('node:http');
const fs = require('node:fs');

const server = http.createServer((request, response) => {
  console.log(request.method);

  if (request.url === '/') {
    const egitmen = {
      firstName: 'Emre',
      lastName: 'Demir',
    };
    response.writeHead(200, { 'content-type': 'text/html' });
    let htmlFile = fs.readFileSync('./index.html', 'utf-8');
    htmlFile = htmlFile.replace(
      '{{fullName}}',
      `${egitmen.firstName} ${egitmen.lastName}`,
    );
    response.end(htmlFile);
  } else if (request.url === '/about') {
    response.writeHead(200, { 'content-type': 'text/plain' });
    response.end('About Page');
  } else if (request.url === '/contact') {
    response.writeHead(200, { 'content-type': 'text/plain' });
    response.end('Contact Page');
  } else {
    response.writeHead(404);
    response.end('Page not found!');
  }
});

server.listen(3000, () => {
  console.log('Server 3000 portunda çalışıyor');
});
