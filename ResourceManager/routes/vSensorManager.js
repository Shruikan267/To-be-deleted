var http = require('http');
var mysql = require('./mysql');
var myTimeout = 5000;
var vSensor_id = 1;
var vSensor_host = "localhost";
var vSensor_port = 3002;

function getSensorId(callback){
	var sqlQuery = "select max(sensor_id) as sensor_id from sensorcloud.virtual_sensors;";

	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			console.log(rows);
			var row;
			if(rows.length){
				if(rows.length>0){
					row = rows[0];
				}else{
					row = rows;
				}
			}else{
				row = rows;
			}
			
			if(!row.sensor_id || row.sensor_id === null){
				row.sensor_id = 0;
			}
			callback({status:"success", sensor_id : row.sensor_id});
		}else{
			callback({status:"failed"});
		}
	});
}

function getPhysicalSensorDetails(sensor_id, callback){
	var sqlQuery = "select * from sensorcloud.physical_sensors where sensor_id = "+sensor_id;
	console.log(sqlQuery);
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			console.log(rows);
			var row;
			if(rows.length){
				if(rows.length>0){
					row = rows[0];
				}else{
					row = rows;
				}
			}else{
				row = rows;
			}
			
			callback({status:"success", sensor_details : row});
		}else{
			callback({status:"failed"});
		}
	});
}

function createVirtualSensorInsertQuery(sensor_id,user_id,pSensor_id,hub_id,hub_host,hub_port,pollutants, callback){
	
	var pollutant_ozone=0, pollutant_co=0, pollutant_so2=0, pollutant_n2o=0, pollutant_ppm=0;	
	if(pollutants.ozone){
		pollutant_ozone = 1;
	}
	if(pollutants.co){
		pollutant_co = 1;
	}
	if(pollutants.so2){
		pollutant_so2 = 1;
	}
	if(pollutants.n2o){
		pollutant_n2o = 1;
	}
	if(pollutants.ppm){
		pollutant_ppm = 1;
	}	
	
	var sqlQuery = "insert into sensorcloud.virtual_sensors values ("+
	sensor_id+","+
	user_id+","+
	pSensor_id+","+
	hub_id+",'"+
	hub_host+"',"+
	hub_port+","+
	pollutant_ozone+","+
	pollutant_co+","+
	pollutant_so2+","+
	pollutant_n2o+","+
	pollutant_ppm+","+
	"'Running'"+
	");";
	
	console.log(sqlQuery);
	
	callback(sqlQuery);
}

function addVirtualSensorToDb(sensor_id,user_id,pSensor_id,hub_id,hub_host,hub_port,pollutants, callback){
	createVirtualSensorInsertQuery(sensor_id,user_id,pSensor_id,hub_id,hub_host,hub_port,pollutants,function(sqlQuery){
		mysql.executeQuery(sqlQuery, function(err, rows){
			if(!err){
				callback({status : "success"});
			}else{
				callback({status : "failed"});
			}
		});
	});
}

exports.create_sensor = function(req, res){	
	getSensorId(function(result){
		if(result.status === "success"){
			
			var user_id = req.body.user_id;
			var pSensor_id = req.body.pSensor_id;
			var sensor_name = req.body.sensor_name;
			var pollutants = req.body.pollutants;
			
			var vSensor_id = result.sensor_id+1;	
			
			getPhysicalSensorDetails(pSensor_id, function(result){
				if(result.status === "success"){
					
					var hub_id = result.sensor_details.hub_id;
					var hub_host = result.sensor_details.hub_host;
					var hub_port = result.sensor_details.hub_port;
//					var pSensor_host = result.sensor_details.sensor_host;
//					var pSensor_port = result.sensor_details.sensor_port;
					
					var data = {
						vSensor_params : {
							pSensor_id : pSensor_id,
							hub_id : hub_id,
							hub_host : hub_host,
							hub_port : hub_port,
							vSensor_details : {
								id : vSensor_id,
								user_id : user_id,
								pollutants : pollutants
							}
						}
					};
					
					var options = {
							host: vSensor_host,
							port: vSensor_port,
							path: '/create',
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
						    	addVirtualSensorToDb(vSensor_id,user_id,pSensor_id,hub_id,hub_host,hub_port,pollutants, function(result){
						    		if(result.status==="success"){
						    			res.send({status : "success"});
						    		}else{
						    			res.send({status : "failed"});
						    		}
						    	});
						    	
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
					
					
				}else{
					res.send({status : "failed"});
				}
			});
			
		}else{
			res.send({status : "failed"});
		}
	});
};

function virtualSensorDetails(sensor_id, callback){
	var sqlQuery = "select * from sensorcloud.virtual_sensors where sensor_id = " +sensor_id;
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			var row;
			if(rows.length>0 && rows[0]){
				row = rows[0];				
			}else{
				row=rows;				
			}
			callback({status:"success", sensor_details : row});
		}else{
			callback({status:"failed"});
			console.log(err);
		}
	});
}


function updateSensorState(vSensor_id, state, callback){
	var sqlQuery = "update sensorcloud.virtual_sensors set state='"+state+"' where sensor_id = " +vSensor_id;
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			callback({status : "success"});
		}else{
			callback({status : "failed"});
			console.log(err);
		}
	});
}


exports.resume_sensor= function(req, res){
	var vSensor_id = req.body.sensor_id;
	
	virtualSensorDetails(vSensor_id, function(result){
		if(result.status==="success"){
			var options = {
					host: vSensor_host,
					port:  vSensor_port,
					path: '/resume',
					method: 'POST',
					headers: {
					      'Content-Type': 'application/json',
				  }
			};
			
			var data = {};
			data.sensor_id = vSensor_id;
			
			var request = http.request(options, function(response){
				
				var str = '';
				response.on('data', function (chunk) {
				   str += chunk;
				});				
				
				response.on('end', function() {
					str = JSON.parse(str);
				    if(str && str.status ==="success"){
				    	updateSensorState(vSensor_id, "Running", function(result){
				    		if(result.status==="success"){
				    			res.send({status : "success"});
				    		}else{
				    			res.send({status : "failed"});
				    		}
				    	});
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
			
		}else{
			res.send({status:"failed"});
		}
	});
	
};


exports.suspend_sensor= function(req, res){
	
	var vSensor_id = req.body.sensor_id;
	
	virtualSensorDetails(vSensor_id, function(result){
		if(result.status==="success"){
			console.log(result.sensor_details);
			var options = {
					host: vSensor_host,
					port:  vSensor_port,
					path: '/suspend',
					method: 'POST',
					headers: {
					      'Content-Type': 'application/json',
				  }
			};
			
			var data = {};
			data.sensor_id = vSensor_id;
			
			var request = http.request(options, function(response){
				
				var str = '';
				response.on('data', function (chunk) {
				   str += chunk;
				});				
				
				response.on('end', function() {
					str = JSON.parse(str);
				    if(str && str.status ==="success"){
				    	updateSensorState(vSensor_id, "Suspended", function(result){
				    		if(result.status==="success"){
				    			res.send({status : "success"});
				    		}else{
				    			res.send({status : "failed"});
				    		}
				    	});
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
			
		}else{
			res.send({status:"failed"});
		}
	});
};


exports.terminate_sensor= function(req, res){
var vSensor_id = req.body.sensor_id;
	
	virtualSensorDetails(vSensor_id, function(result){
		if(result.status==="success"){
			var options = {
					host: vSensor_host,
					port:  vSensor_port,
					path: '/terminate',
					method: 'POST',
					headers: {
					      'Content-Type': 'application/json',
				  }
			};
			
			var data = {};
			data.sensor_id = vSensor_id;
			
			var request = http.request(options, function(response){
				
				var str = '';
				response.on('data', function (chunk) {
				   str += chunk;
				});				
				
				response.on('end', function() {
					str = JSON.parse(str);
				    if(str && str.status ==="success"){
				    	updateSensorState(vSensor_id, "Terminated", function(result){
				    		if(result.status==="success"){
				    			res.send({status : "success"});
				    		}else{
				    			res.send({status : "failed"});
				    		}
				    	});
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
			
		}else{
			res.send({status:"failed"});
		}
	});
};