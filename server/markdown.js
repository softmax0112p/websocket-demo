var fs = require('fs');
var marked = require('marked');

module.exports = (app, connections, dirname) => {
  app.get('/data.html', (request, response) => {
    fs.readFile('data.txt', 'utf8', (error, data) => {
      if (error) {
	response.status(404).end();
      } else {
	marked(data, (error, content) => {
	  if (error) {
	    console.log(error);
	    response.status(500).send(error);
	  } else {
	    response.send(content);
	  }
	})
      }
    })
  });

  // watch for file system changes.  when data.txt changes, send converted
  // markdown output to all /html connections.
  fs.watch(dirname, {}, (event, filename) => {
    if (filename == 'data.txt') {
      fs.readFile(filename, 'utf8', (err, data) => {
	if (data && !err) {
	  marked(data, (err, content) => {
	    if (!err) {
	      for (connection of connections.html) {
		connection.sendUTF(content);
	      }
	    }
	  }) 
	}
      })
    }
  })
}
