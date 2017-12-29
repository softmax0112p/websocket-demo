var ws = null;
var base = '';
var connections = [];

function openchannel(scope) {
  if (ws || !base) return;
  url = new URL('websocket', base.replace('http', 'ws'));
  ws = new WebSocket(url.href, 'sw-demo');

  ws.onopen = (event) => {
    console.log('web socket opened!');
  }

  ws.onmessage = (event) => {
console.log(event.data);
    for (connection of connections) {
      connection.postMessage(event.data)
    }
  }

  ws.onerror = (event) => {
    console.log('web socket error:');
    console.log(event);
    ws = null;
  }

  ws.onclose = (event) => {
    console.log('web socket closed');
    ws = null;
  }
}

setInterval(() => openchannel(), 15000);

onconnect = (event) => {
  let port = event.ports[0];
  connections.push(port);
  port.start();

  port.onmessage = (event) => {
    if (event.data.base) base = event.data.base;
    openchannel();
  }
}
