const http = require('node:http');
const fs = require('node:fs');

const server = http.createServer((request, response) => {
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
});

server.listen(3000, () => {
  console.log('Server 3000 portunda çalışıyor');
});
