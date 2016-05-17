var http = require('http');
var mongo = require('./mongo');
var myTimeout = 5000;
exports.collect_data = function(req, res){
	
	var vSensor_details = req.body.vSensor_details;
	
	var options = {
			host: vSensor_details.host,
			port: vSensor_details.port,
			path: '/get-data',
			method: 'POST',
			headers: {
			      'Content-Type': 'application/json',
		  }
	};
	
	var callback = function(response_data){
		if(response_data.status==="success"){
			var sensor_data = {};
			sensor_data.data = response_data.data;
			sensor_data.id = vSensor_details.id;
			sensor_data.user_id = vSensor_details.user_id;
			mongo.save_data(sensor_data, function(result){
				if(result.status === "success"){
					res.send({status : "success"});
				}else{
					res.send({status : "failed"});
				}
			});
			
		}else{
			res.send({status : "failed"});
		}
	};
	
	var data = {};
	data.sensor_id = vSensor_details.id;
	
	var request = http.request(options, function(response){
		
		var str = '';
		response.on('data', function (chunk) {
		   str += chunk;
		});				
		
		response.on('end', function() {			
		    if(str){
		    	str = JSON.parse(str);
				callback(str);
			}
		});
		
	});
	

	
	request.on('socket', function (socket) {
	    socket.setTimeout(myTimeout);  
	    socket.on('timeout', function() {		    	
	    	request.abort();
	        callback({status : "failed"});
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