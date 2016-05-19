var http = require('http'),
    httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

// To modify the proxy connection before data is sent, you can listen
// for the 'proxyReq' event. When the event is fired, you will receive
// the following arguments:
// (http.ClientRequest proxyReq, http.IncomingMessage req,
//  http.ServerResponse res, Object options). This mechanism is useful when
// you need to modify the proxy request before the proxy connection
// is made to the target.
//
proxy.on('proxyReq', function(proxyReq, req, res, options) {
	
  proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});

var servers = ['http://127.0.0.1:4001', 'http://127.0.0.1:4002'];	

var server = http.createServer(function(req, res) {
	
   var target = servers.shift();
	console.log("proxying to "+ target);
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  proxy.web(req, res, {
    target: target
  });
  servers.push(target);
});

console.log("listening on port 3003");
server.listen(3003);