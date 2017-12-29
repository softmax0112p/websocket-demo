function subscribe(path, callback) {
  var ws = null;
  var base = window.top.location.href

  function openchannel() {
    if (ws) return;
    var url = new URL(path, base.replace('http', 'ws'));
    ws = new WebSocket(url.href, 'ws-demo');

    ws.onopen = (event) => {
      console.log(path + ' web socket opened!');
    };

    ws.onmessage = (event) => {
      callback(event.data);
    };

    ws.onerror = (event) => {
      console.log(path + ' web socket error:');
      console.log(event);
      ws = null;
    };

    ws.onclose = (event) => {
      console.log(path + ' web socket closed');
      ws = null;
    }
  }

  // open (and keep open) the channel
  openchannel();
  setInterval(() => openchannel(), 2000);
}
