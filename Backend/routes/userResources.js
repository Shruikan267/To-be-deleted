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

exports.get_vSensors = function(req, res){
	options.path = '/get-user-vSensors';
	var user_id = req.sensorcloud.user_id;
	var data = {
		user_id : user_id
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

exports.get_pSensors = function(req, res){
	options.path = '/get-user-pSensors';
	var user_id = req.sensorcloud.user_id;
	var data = {
		user_id : user_id
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

exports.get_Hubs = function(req, res){
	options.path = '/get-user-hubs';
	var user_id = req.sensorcloud.user_id;
	var data = {
		user_id : user_id
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