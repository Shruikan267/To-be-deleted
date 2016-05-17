var http = require('http');
var mysql = require('./mysql');

var vSensor_id = 1;
var vSensor_host = "localhost";
var vSensor_port = 3002;

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
	
	var pollutants = {};
	
	if(vSensor.pollutants.ozone){
		pollutants.ozone = 1;
	}else{
		pollutants.ozone = 0;
	}
	
	if(vSensor.pollutants.ppm){
		pollutants.ppm = 1;
	}else{
		pollutants.ppm = 0;
	}
	
	if(vSensor.pollutants.so2){
		pollutants.so2 = 1;
	}else{
		pollutants.so2 = 0;
	}
	
	if(vSensor.pollutants.n2o){
		pollutants.n2o = 1;
	}else{
		pollutants.n2o = 0;
	}
	
	if(vSensor.pollutants.co){
		pollutants.co = 1;
	}else{
		pollutants.co = 0;
	}
	
	var sqlQuery = "insert into sensorcloud.virtual_sensors (" +
			"user_id," +
			" pSensor_id," +
			" hub_id," +
			" hub_host," +
			" hub_port," +
			" pollutant_ozone," +
			" pollutant_co," +
			" pollutant_so2," +
			" pollutant_n2o," +
			" pollutant_ppm," +
			" state" +
			") values ("+
			vSensor.user_id+","+
			pSensorDetails.pSensor_id+","+
			pSensorDetails.hub_id+","+
			"'"+pSensorDetails.hub_host+"',"+
			pSensorDetails.hub_port+","+
			pollutants.ozone+","+
			pollutants.co+","+
			pollutants.so2+","+
			pollutants.n2o+","+
			pollutants.ppm+","+
			"'"+vSensor.state+"'" +
			")";
	
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			res.send({result : "success"});
		}else{
			res.send({result : "failed"});
		}
	});
	
};


exports.resume_sensor= function(req, res){
	var vSensor_id = req.body.sensor_id;
	
	
	var sqlQuery = "select * from sensorcloud.virtual_sensors where sensor_id = " +vSensor_id;
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			var row;
			if(rows.length>0 && rows[0]){
				row = rows[0];
				console.log('rows is an array');
			}else{
				row=rows;
				console.log('rows is not an array');
			}
			
			var options = {
					host: row.hub_host,
					port: row.hub_port,
					path: '/resume',
					method: 'POST',
					headers: {
					      'Content-Type': 'application/json',
				  }
			};
			var data = {};
			data.sensor_id = row.sensor_id;
			
			var request = http.request(options, function(response){
			
				var str = '';
				response.on('data', function (chunk) {
				   str += chunk;
				});				
				
				response.on('end', function() {
					str = JSON.parse(str);
				    if(str && str.result ==="success"){
				    	var sqlQuery = "update sensorcloud.virtual_sensors set state='Running' where sensor_id = " +vSensor_id;
				    	mysql.executeQuery(sqlQuery, function(err, rows){
				    		if(!err){
				    			res.send({result : "success"});
				    		}else{
				    			res.send({result : "failed"});
				    		}
				    	});
					}else{
						res.send({result : "failed"});
					}
				});	
				
			});
			request.write(JSON.stringify(data));
			request.end();			
			
		}else{
			res.send({result : "failed"});
		}
	});
};


exports.suspend_sensor= function(req, res){
	var vSensor_id = req.body.sensor_id;
	
	
	var sqlQuery = "select * from sensorcloud.virtual_sensors where sensor_id = " +vSensor_id;
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			var row;
			if(rows.length>0 && rows[0]){
				row = rows[0];
				console.log('rows is an array');
			}else{
				row=rows;
				console.log('rows is not an array');
			}
			
			var options = {
					host: row.hub_host,
					port: row.hub_port,
					path: '/suspend',
					method: 'POST',
					headers: {
					      'Content-Type': 'application/json',
				  }
			};
			var data = {};
			data.sensor_id = row.sensor_id;
			
			var request = http.request(options, function(response){			
				var str = '';
				response.on('data', function (chunk) {
				   str += chunk;
				});				
				
				response.on('end', function() {
					str = JSON.parse(str);
				    if(str && str.result ==="success"){
				    	var sqlQuery = "update sensorcloud.virtual_sensors set state='Stopped' where sensor_id = " +vSensor_id;
				    	mysql.executeQuery(sqlQuery, function(err, rows){
				    		if(!err){
				    			res.send({result : "success"});
				    		}else{
				    			res.send({result : "failed"});
				    		}
				    	});
					}else{
						res.send({result : "failed"});
					}
				});	
				
			});
			request.write(JSON.stringify(data));
			request.end();			
			
		}else{
			res.send({result : "failed"});
		}
	});
};


exports.terminate_sensor= function(req, res){
	var vSensor_id = req.body.sensor_id;
	
	
	var sqlQuery = "select * from sensorcloud.virtual_sensors where sensor_id = " +vSensor_id;
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			var row;
			if(rows.length>0 && rows[0]){
				row = rows[0];
				console.log('rows is an array');
			}else{
				row=rows;
				console.log('rows is not an array');
			}
			
			var options = {
					host: row.hub_host,
					port: row.hub_port,
					path: '/terminate',
					method: 'POST',
					headers: {
					      'Content-Type': 'application/json',
				  }
			};
			var data = {};
			data.sensor_id = row.sensor_id;
			
			var request = http.request(options, function(response){			
				var str = '';
				response.on('data', function (chunk) {
				   str += chunk;
				});				
				
				response.on('end', function() {
					str = JSON.parse(str);
				    if(str && str.result ==="success"){
				    	var sqlQuery = "delete from sensorcloud.virtual_sensors where sensor_id = " +vSensor_id;
				    	mysql.executeQuery(sqlQuery, function(err, rows){
				    		if(!err){
				    			res.send({result : "success"});
				    		}else{
				    			res.send({result : "failed"});
				    		}
				    	});
					}else{
						res.send({result : "failed"});
					}
				});	
				
			});
			request.write(JSON.stringify(data));
			request.end();			
			
		}else{
			res.send({result : "failed"});
		}
	});
};