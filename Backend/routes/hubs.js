var host = "localhost";
var port = 3005;
var http = require('http');
var myTimeout = 5000;

exports.create_hub = function(req, res){
	var hub_name = req.body.hub_name;
	var user_id = req.sensorcloud.user_id;
	
	var data = {
		hub_name : hub_name,
		user_id : user_id
	};
	
	var options = {
			host: host,
			port: port,
			path: '/create-hub',
			method: 'POST',
			headers: {
			      'Content-Type': 'application/json',
		  }
	};
	
	var request = http.request(options, function(response){
		
		var str = '';
		response.on('data', function (chunk) {
		   str += chunk;
		});				
		
		response.on('end', function() {
			str = JSON.parse(str);
		    if(str && str.status ==="success"){
		    	res.send({status : "success"});
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

exports.create_sensor = function(req, res){
	var sensor_name = req.body.sensor_name;
	var user_id = req.sensorcloud.user_id;
	var hub_id = req.body.hub_id;
	
	var data = {
			sensor_name : sensor_name,
			user_id : user_id,
			hub_id : hub_id
		};
		
		var options = {
				host: host,
				port: port,
				path: '/create-physical-sensor',
				method: 'POST',
				headers: {
				      'Content-Type': 'application/json',
			  }
		};
		
		var request = http.request(options, function(response){
			
			var str = '';
			response.on('data', function (chunk) {
			   str += chunk;
			});				
			
			response.on('end', function() {
				str = JSON.parse(str);
			    if(str && str.status ==="success"){
			    	res.send({status : "success"});
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




exports.delete_hub = function(req, res){
	var hub_id = req.body.hub_id;
	
	var data = {
			hub_id : hub_id
		};
		
		var options = {
				host: host,
				port: port,
				path: '/delete-hub',
				method: 'POST',
				headers: {
				      'Content-Type': 'application/json',
			  }
		};
		
		var request = http.request(options, function(response){
			
			var str = '';
			response.on('data', function (chunk) {
			   str += chunk;
			});				
			
			response.on('end', function() {
				str = JSON.parse(str);
			    if(str && str.status ==="success"){
			    	res.send({status : "success"});
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


exports.delete_sensor = function(req, res){

	var hub_id = req.body.hub_id;
	var sensor_id = req.body.sensor_id;
	
	var data = {
			hub_id : hub_id,
			sensor_id : sensor_id
		};
		
		var options = {
				host: host,
				port: port,
				path: '/delete-physical-sensor',
				method: 'POST',
				headers: {
				      'Content-Type': 'application/json',
			  }
		};
		
		var request = http.request(options, function(response){
			
			var str = '';
			response.on('data', function (chunk) {
			   str += chunk;
			});				
			
			response.on('end', function() {
				str = JSON.parse(str);
			    if(str && str.status ==="success"){
			    	res.send({status : "success"});
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