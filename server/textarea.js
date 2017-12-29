var fs = require('fs');

module.exports = (app, connections, dirname) => {
  // Return the current contents of data.txt
  app.get('/data.txt', (request, response) => {
   response.sendFile(dirname + '/data.txt');
  });

  // Update contents of data.txt
  app.post('/data.txt', (request, response) => {
   var fd = fs.openSync(dirname + '/data.txt', 'w');
   request.on('data', (data) => fs.writeSync(fd, data));
   request.on('end', () => {
     fs.closeSync(fd);
     response.sendFile(dirname + '/data.txt');
   })
  })

  // watch for file system changes.  when data.txt changes, send new raw
  // contents to all /text connections.
  fs.watch(dirname, {}, (event, filename) => {
    if (filename == 'data.txt') {
      fs.readFile(filename, 'utf8', (err, data) => {
	if (data && !err) {
	  for (connection of connections.text) {
	    connection.sendUTF(data)
	  };
	}
      })
    }
  })
}
