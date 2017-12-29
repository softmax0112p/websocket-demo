const http = require('http');
const express = require('express');

const Websocket = require('./server/websocket');
const Textarea = require('./server/textarea');
const Markdown = require('./server/markdown');
const Filelist = require('./server/filelist');

// create web server, and watch for web socket connections
var app = express();
var httpServer = http.createServer(app);
var connections = Websocket(httpServer);

// serve content from client directory
app.use(express.static(__dirname + '/client'));

// initialize three mini-applications
Textarea(app, connections, __dirname);
Markdown(app, connections, __dirname);
Filelist(app, connections, __dirname);

// start listening for connections
const port = 8080;
httpServer.listen(port, () => {
  console.log((new Date()) + ' Server is listening on port ' + port);
})
