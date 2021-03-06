var http = require("http");

var gpio = require('gpio');
var gate = null;

http.createServer(function(request, response) {

  if (request.url == "/check") {
    response.write("The server is running.");
  }
  else if (request.url == "/run") {
    if (request.method != "POST") {
      response.statusCode = 405;
      response.write("POST is required.");
    }
    else {
      if (!gate) {
        gate = gpio.export(4, {
          direction: 'out',
          interval: 200,
          ready: function() {
            setTimeout( function() {
              gate.set(1);
            }, 300);
          }
        });
      }

      gate.set(0, function() {
        setTimeout( function() {
          gate.set(1);
        }, 300);
      });
    }
  }
  else {
    response.statusCode = 404;
    response.write("Page not found.");
  }

  response.end();

}).listen(8888);
