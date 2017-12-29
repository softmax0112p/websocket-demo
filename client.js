var textarea = document.querySelector('textarea');

fetch("/data.txt").then((response) => {
  response.text().then((body) => {
    textarea.value = body;
  })
});

textarea.addEventListener('input', (event) => {
  fetch("/data.txt", {method: 'POST', body: textarea.value});
});

var ws = null;

function openchannel() {
  if (ws) return;
  var url = new URL('websocket', window.location.href.replace('http', 'ws'));
  ws = new WebSocket(url.href, 'sw-demo');

  ws.onopen = (event) => {
    console.log('web socket opened');
  }

  ws.onmessage = (event) => {
    console.log(event);
    textarea.value = event.data
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

openchannel();
setInterval(() => openchannel(), 15000);
