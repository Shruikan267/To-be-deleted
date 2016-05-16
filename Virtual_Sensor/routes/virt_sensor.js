var http = require('http');
var mongo = require('./mongo');
var schedule = require('node-schedule');

var vSensor_list = [];
var counter = 0;

exports.create_sensor = function(req, res){
	var vSensor_params = req.body.vSensor_params;
	var vSensor_details = vSensor_params.vSensor_details;
	
	var pSensorDetails = {};
	pSensorDetails.pSensor_id = vSensor_params.pSensor_id;
	pSensorDetails.hub_id = vSensor_params.hub_id;
	pSensorDetails.hub_host = vSensor_params.hub_host;
	pSensorDetails.hub_port = vSensor_params.hub_port;
	
	var vSensor = {};
	vSensor.id = vSensor_details.id;
	vSensor.user_id = vSensor_details.user_id;
	vSensor.pollutants = vSensor_details.pollutants;
	vSensor.state = "Running";
	vSensor.pSensorDetails = pSensorDetails;
	vSensor.data = {};
	
	var options = {
			host: pSensorDetails.hub_host,
			port: pSensorDetails.hub_port,
			path: '/get-data',
			method: 'POST',
			headers: {
			      'Content-Type': 'application/json',
		  }
	};
	var data = {};
	data.sensor_id = pSensorDetails.pSensor_id;
	data.hub_id = pSensorDetails.hub_id;
	
	var request = http.request(options, function(response){
		
		var str = '';
		response.on('data', function (chunk) {
		   str += chunk;
		});				
		
		response.on('end', function() {
			str = JSON.parse(str);
		    if(str && str.result ==="success"){
		    	var sensor_data = {};
		    	if(vSensor.pollutants.ozone){
		    		sensor_data.ozone = str.data.ozone;
		    	}
		    	if(vSensor.pollutants.co){
		    		sensor_data.co = str.data.co;
		    	}
		    	if(vSensor.pollutants.so2){
		    		sensor_data.so2 = str.data.so2;
		    	}
		    	if(vSensor.pollutants.ppm){
		    		sensor_data.ppm = str.data.ppm;
		    	}
		    	if(vSensor.pollutants.n2o){
		    		sensor_data.n2o = str.data.n2o;
		    	}
		    	vSensor.data = sensor_data;
		    	
		    	mongo.save_sensor(vSensor, function(result){
		    		if(result.status==="success"){
		    			vSensor_list.push(vSensor);
		    			res.send({result : "success"});
		    		}else{
		    			res.send({result : "failed"});
		    			console.log(result.error);
		    		}
		    	});
		    	
		    	
			}
		});	
		
	});
	request.write(JSON.stringify(data));
	request.end();	
	res.send({result:"success"});
	
};

exports.suspend_sensor = function(req, res){
	var vSensor_id = req.body.sensor_id;
	for(var i=0, len=vSensor_list.length; i<len; i++){
		if(vSensor_list[i].id === vSensor_id){
			var sensor = vSensor_list[i];
			sensor.state = "Suspended";
			
			mongo.update_sensor(sensor, function(update_result){
				if(update_result.status==="success"){
					vSensor_list.splice(i,1);
					res.send({result : "success"});
				}else{
					res.send({result : "failed"});
					console.log(update_result.error);
				}
			});			
			
			break;
		}
	}
};


exports.terminate_sensor = function(req, res){
	var vSensor_id = req.body.sensor_id;
	for(var i=0, len=vSensor_list.length; i<len; i++){
		if(vSensor_list[i].id === vSensor_id){			
			mongo.delete_sensor(vSensor_list[i].id, function(result){
				if(result.status==="success"){
					vSensor_list.splice(i,1);
	    			res.send({result : "success"});
	    		}else{
	    			res.send({result : "failed"});
	    			console.log(result.error);
	    		}
			});
			break;
		}
	}
};

exports.start_sensor = function(req, res){
	var vSensor_id = req.body.sensor_id;
	
	mongo.read_sensor(vSensor_id, function(result){
		if(result.status==="success"){
			var sensor = result.sensor.sensor;
			sensor.state = "Running";
			
			mongo.update_sensor(sensor, function(update_result){
				if(update_result.status==="success"){
					vSensor_list.push(sensor);
					res.send({result : "success"});
				}else{
					res.send({result : "failed"});
					console.log(update_result.error);
				}
			});
		}else{
			res.send({result : "failed"});
			console.log(result.error);
		}
	});

};

exports.get_data = function(req,res){
	var vSensor_id = req.body.sensor_id;
	for(var i=0, len=vSensor_list.length; i<len; i++){
		if(vSensor_list[i].id === vSensor_id){
			res.send({result : "success", data : vSensor_list[i].data});
			break;
		}
	}
};

exports.get_sensors = function(req,res){
	res.send({sensors : vSensor_list});
};