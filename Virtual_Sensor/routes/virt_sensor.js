var http = require('http');
var schedule = require('node-schedule');

var vSensor_list = {};
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
		    	
		    	res.send({result : "success"});
			}
		});	
		
	});
	request.write(JSON.stringify(data));
	request.end();
	
	
	res.send({result:"success"});
	
};