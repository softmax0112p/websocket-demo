const fs = require('fs');

function stats(dirname, prefix) {
  prefix = prefix || '';
  results = [];
  if (prefix == 'node_modules/') return results;

  fs.readdirSync(dirname).
    sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase())).
    map (name => {
      var fsstats = fs.lstatSync(dirname + "/" + name);
      if (fsstats.isDirectory()) {
        results = results.concat(stats(dirname+"/"+name, prefix+name+"/"));
      } else {
        results.push({
          name: prefix+name, 
          size: fsstats.size, 
          mtime: fsstats.mtime
        });
      }
    });

  return results;
};

module.exports = (app, connections, dirname) => {
  app.get('/vue.min.js', (request, response) => {
    response.sendFile(dirname + "/node_modules/vue/dist/vue.min.js");
  });

  app.get('/dir.json', (request, response) => {
    response.json(stats(dirname));
  });

  fs.watch(dirname, {recursive: true}, (event, filename) => {
    var data = JSON.stringify(stats(dirname));
    for (connection of connections.json) {
      connection.sendUTF(data)
    }
  })
};
