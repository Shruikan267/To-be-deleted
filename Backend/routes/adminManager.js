var host = "localhost";
var port = 3005;
var http = require('http');
var myTimeout = 5000;
var options = {		
	host: host,
	port: port,
	method: 'POST',
	headers: {
	      'Content-Type': 'application/json',
	}
};

exports.get_all_vSensors = function(req, res){
	options.path = '/get-all-vSensors';
	var data = {
	};
	
var request = http.request(options, function(response){
		
		var str = '';
		response.on('data', function (chunk) {
		   str += chunk;
		});				
		
		response.on('end', function() {
			str = JSON.parse(str);
		    if(str && str.status ==="success"){
		    	res.send({status : "success", data : str.rows});
			}else{
				res.send({status : "failed"});
			}
		});	
		
	});
	
	request.on('socket', function (socket) {
	    socket.setTimeout(myTimeout);  
	    socket.on('timeout', function() {
	    	res.send({status : "failed"});
	    	request.abort();
	    });
	});

	request.on('error', function(err) {
	    if (err.code === "ECONNRESET") {
	        console.log("Timeout occurs");
	        //specific error treatment
	    }		    
	});
	
	request.write(JSON.stringify(data));
	request.end();
	
};

exports.get_all_pSensors = function(req, res){
	options.path = '/get-all-pSensors';
	var data = {
	};
	
	
	
	var request = http.request(options, function(response){
		
		var str = '';
		response.on('data', function (chunk) {
		   str += chunk;
		});				
		
		response.on('end', function() {
			str = JSON.parse(str);
		    if(str && str.status ==="success"){		    	
		    	res.send({status : "success", data : str.rows});
			}else{
				res.send({status : "failed"});
			}
		});	
		
	});
	
	request.on('socket', function (socket) {
	    socket.setTimeout(myTimeout);  
	    socket.on('timeout', function() {
	    	res.send({status : "failed"});
	    	request.abort();
	    });
	});

	request.on('error', function(err) {
	    if (err.code === "ECONNRESET") {
	        console.log("Timeout occurs");
	        //specific error treatment
	    }		    
	});
	
	request.write(JSON.stringify(data));
	request.end();
};

exports.get_all_hubs = function(req, res){
	options.path = '/get-all-hubs';
	var data = {
	};
	
	
var request = http.request(options, function(response){
		
		var str = '';
		response.on('data', function (chunk) {
		   str += chunk;
		});				
		
		response.on('end', function() {
			str = JSON.parse(str);
		    if(str && str.status ==="success"){
		    	
		    	res.send({status : "success", data : str.rows});
			}else{
				res.send({status : "failed"});
			}
		});	
		
	});
	
	request.on('socket', function (socket) {
	    socket.setTimeout(myTimeout);  
	    socket.on('timeout', function() {
	    	res.send({status : "failed"});
	    	request.abort();
	    });
	});

	request.on('error', function(err) {
	    if (err.code === "ECONNRESET") {
	        console.log("Timeout occurs");
	        //specific error treatment
	    }		    
	});
	
	request.write(JSON.stringify(data));
	request.end();
};