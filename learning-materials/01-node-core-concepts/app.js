const http = require('http');
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'message.txt');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message </title> </head>');
    res.write(
      '<body><form action="/message" method="POST"> <input type="text" name="message"><button type="submit">Send</button> </form> </body>'
    );
    res.write('</html>');
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile(filePath, message, (err) => {
        res.writeHead(302, { Location: '/' });
        return res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title> My first Page </title> </head>');
  res.write('<body><h1> Hello from my node.js server </h1> </body>');
  res.write('</html>');
  res.end();
});

server.listen(3000);
