var host = "localhost";
var port = 3005;
var http = require('http');
var myTimeout = 5000;

exports.create_sensor = function(req, res){
	
	var user_id = req.body.user_id;
	var pSensor_id = req.body.pSensor_id;
	var sensor_name = req.body.sensor_name;
	var pollutants = req.body.pollutants;
	
	var data = {
		user_id : user_id,
		pSensor_id : pSensor_id,
		sensor_name : sensor_name,
		pollutants : pollutants
	};
	
	var options = {
			host: host,
			port: port,
			path: '/create-virtual-sensor',
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

exports.suspend_sensor = function(req, res){
	
	var sensor_id = req.body.sensor_id;
	
	var data = {
		sensor_id : sensor_id
	};
	
	var options = {
			host: host,
			port: port,
			path: '/suspend-virtual-sensor',
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


exports.resume_sensor = function(req, res){
	
	var sensor_id = req.body.sensor_id;
	
	var data = {
		sensor_id : sensor_id
	};
	
	var options = {
			host: host,
			port: port,
			path: '/resume-virtual-sensor',
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


exports.terminate_sensor = function(req, res){
	
	var sensor_id = req.body.sensor_id;
	
	var data = {
		sensor_id : sensor_id
	};
	
	var options = {
			host: host,
			port: port,
			path: '/terminate-virtual-sensor',
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