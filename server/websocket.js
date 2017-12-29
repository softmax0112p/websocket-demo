var websocket = require('websocket');

// maintain three sets of websocket connections: one for raw text data, one for
// mmarkdown HTML output, and one for directory data in JSON format. 

module.exports = function(httpServer) {
  // attach to web server
  var wsServer = new websocket.server({httpServer: httpServer});

  // three sets of connections
  var connections = {
    text: new Set(),
    html: new Set(),
    json: new Set()
  };

  // when a request comes in for one of these streams, add the websocket to the
  // appropriate set, and upon receipt of close events, remove the websocket
  // from that set.
  wsServer.on('request', (request) => {
    var url = request.httpRequest.url.slice(1);

    if (!connections[url]) {
      // reject request if not for one of the pre-identified paths
      request.reject();
      console.log((new Date()) + ' ' + url + ' connection rejected.');
      return;
    };

    // accept request and add to the connection set based on the request url
    var connection = request.accept('ws-demo', request.origin);
    console.log((new Date()) + ' ' + url + ' connection accepted.');
    connections[url].add(connection);

    // whenever the connection closes, remove connection from the relevant set
    connection.on('close', (reasonCode, description) => {
      console.log((new Date()) + ' ' + url + ' connection disconnected.');
      connections[url].delete(connection)
    })
  });

  return connections;
}
