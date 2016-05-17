var http = require('http');
var mysql = require('./mysql');

var pSensor_host = "localhost";
var pSensor_port = 3000;
var myTimeout= 5000;
var hub_host = "localhost";
var hub_port = 3001;

function getHubId(callback){
	var sqlQuery = "select max(hub_id) as hub_id from sensorcloud.hubs;";
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){			
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
			
			if(!row.hub_id || row.hub_id === null){
				row.hub_id = 0;
			}
			callback({status:"success", hub_id : row.hub_id});
		}else{
			callback({status:"failed"});
		}
	});
}

function getPhysicalSensorId(callback){
	var sqlQuery = "select max(sensor_id) as sensor_id from sensorcloud.physical_sensors;";
	
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
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
			console.log(row);
			if(!row.sensor_id || row.sensor_id === null){
				row.sensor_id = 0;
			}
			callback({status:"success", sensor_id : row.sensor_id});
		}else{
			callback({status:"failed"});
		}
	});
}

function createHubQueryBuilder(id, name, user_id , host, port, callback){
	var sqlQuery = "insert into sensorcloud.hubs (hub_id, hub_name, hub_user_id, hub_host, hub_port) values ("+
	id+",'"+
	name+"',"+
	user_id+",'"+
	host+"',"+
	port+");";
	console.log("Query : "+sqlQuery);
	callback(sqlQuery);
}

exports.createHub = function(req, res){
	getHubId(function(result){
		if(result.status === "success"){
			var hub_name = req.body.hub_name;
			var user_id = req.body.user_id;
			var hub_id = result.hub_id+1;
			var host = hub_host;
			var port = hub_port;
			
			var data = {
					hub_params : {
						id : hub_id,
						name : hub_name,
						host : host,
						port : port
					}
			};
			
			var options = {
					host: host,
					port: port,
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
				    	createHubQueryBuilder(hub_id, hub_name, user_id, host, port, function(sqlQuery){
					    	mysql.executeQuery(sqlQuery, function(err, rows){
					    		if(!err){
					    			res.send({status : "success"});
					    		}else{
					    			res.send({status : "failed"});
					    		}
					    	});
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
};


function createSensorQueryBuilder(id, name, hub_id, host, port, hub_host, hub_port, user_id, callback){
	var sqlQuery = "insert into sensorcloud.physical_sensors values ("+
	id+",'"+
	name+"',"+
	hub_id+",'"+
	host+"',"+
	port+",'"+
	hub_host+"',"+
	hub_port+","+
	"'Running',"+
	user_id+""+
	");";
	console.log("Query : "+sqlQuery);
	callback(sqlQuery);
}

exports.createSensor = function(req, res){
	getPhysicalSensorId(function(result){
		if(result.status === "success"){
			var sensor_name = req.body.sensor_name;
			var user_id = req.body.user_id;
			var hub_id = req.body.hub_id;
			var sensor_id = result.sensor_id+1;
			var sensor_host = pSensor_host;
			var sensor_port = pSensor_port;
			
			var data = {
					hub_id : hub_id,
					sensor_params : {
						sensor_id : sensor_id,
						name : sensor_name,
						hub_host : hub_host,
						hub_port : hub_port,
						sensor_host : sensor_host,
						sensor_port : sensor_port
					}
			};
			
			var options = {
					host: hub_host,
					port: hub_port,
					path: '/add-sensor',
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
				    	createSensorQueryBuilder(sensor_id, sensor_name, hub_id, sensor_host, sensor_port, hub_host, hub_port, user_id, function(sqlQuery){
				    		mysql.executeQuery(sqlQuery, function(err, rows){
					    		if(!err){
					    			res.send({status : "success"});
					    		}else{
					    			res.send({status : "failed"});
					    		}
					    	});
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
};

function getHubParameters(hub_id, callback){
	var sqlQuery = "select * from sensorcloud.hubs where hub_id = "+hub_id;
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			callback({status : "success", hub_params : rows[0]});
		}else{
			callback({status : "failed"});
		}
	});
}

function deleteHubFromPhysicalSensors(hub_id, callback){
	var sqlQuery = "delete from sensorcloud.physical_sensors where hub_id = "+hub_id;
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			callback({status : "success"});
		}else{
			callback({status : "failed"});
		}
	});
}

function deleteHubFromVirtualSensors(hub_id, callback){
	var sqlQuery = "update sensorcloud.virtual_sensors set state = 'Crashed' where hub_id = "+hub_id;
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			callback({status : "success"});
		}else{
			callback({status : "failed"});
		}
	});
}

function deleteHubAndSensors(hub_id, callback){
	deleteHubFromVirtualSensors(hub_id, function(result){
		if(result.status === "success"){
			deleteHubFromPhysicalSensors(hub_id, function(result){
				if(result.status === "success"){
					var sqlQuery = "delete from sensorcloud.hubs where hub_id = "+hub_id;
					mysql.executeQuery(sqlQuery, function(err, rows){
						if(!err){
							callback({status : "success"});
						}else{
							callback({status : "failed"});
						}
					});
				}else{
					callback({status : "failed"});
				}
			});
		}else{
			callback({status : "failed"});
		}
	});
}

exports.deleteHub = function(req, res){
	var hub_id = req.body.hub_id;
	
	getHubParameters(hub_id, function(result){		
		
		if(result.status==="success"){
			var hub_host = result.hub_params.hub_host;
			var hub_port = result.hub_params.hub_port;
			
			var data = {};
			data.hub_id = hub_id;
			
			var options = {
					host: hub_host,
					port: hub_port,
					path: '/delete',
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
				    	deleteHubAndSensors(hub_id, function(result){
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
	
};

function getSensorParameters(sensor_id, callback){
	var sqlQuery = "select * from sensorcloud.physical_sensors where sensor_id = "+sensor_id;
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			callback({status : "success", sensor_params : rows[0]});
		}else{
			callback({status : "failed"});
		}
	});
}

function deletePhysicalSensorFromVirtualSensors(sensor_id, callback){
	var sqlQuery = "update sensorcloud.virtual_sensors set state = 'Crashed' where pSensor_id = "+sensor_id;
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			callback({status : "success"});
		}else{
			callback({status : "failed"});
		}
	});
}

function deleteSensorsFromDb(sensor_id, callback){
	deletePhysicalSensorFromVirtualSensors(sensor_id, function(result){
		if(result.status === "success"){
			var sqlQuery = "delete from sensorcloud.physical_sensors where sensor_id = "+sensor_id;
			mysql.executeQuery(sqlQuery, function(err, rows){
				if(!err){
					callback({status : "success"});
				}else{
					callback({status : "failed"});
				}
			});
		}else{
			callback({status : "failed"});
		}
	});
}

exports.deleteSensor = function(req, res){
	var hub_id = req.body.hub_id;
	var sensor_id = req.body.sensor_id;
	getSensorParameters(sensor_id, function(result){
		if(result.status==="success"){
			if(result.sensor_params && result.sensor_params){
				var hub_host = result.sensor_params.hub_host;
				var hub_port = result.sensor_params.hub_port;
				
				var data = {};
				data.hub_id = hub_id;
				data.sensor_id = sensor_id;
				
				var options = {
						host: hub_host,
						port: hub_port,
						path: '/delete-sensor',
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
					    	deleteSensorsFromDb(sensor_id, function(result){
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
			
		}else{
			res.send({status : "failed"});
		}
	});
};
