/**
 * http://usejsdoc.org/
 */

var mongo=require('./mongo');
var http = require('http');
var schedule = require('node-schedule');
var myTimeout = 5000;
var hub_list = [];


setTimeout(function(){
	mongo.read_hubs(function(result){
		if(result.status==="success"){
			hub_list = result.data;
			
			for(var i=0, len=hub_list.length;i <len; i++){
				var hub = hub_list[i];
				for(var j=0, len2=hub.sensors.length; j<len2; j++){
					
					var sensor = hub.sensors[j];
					
					sensor.delete_sensor = function(callback){
						
						var options = {
								host: sensor.sensor_host,
								port: sensor.sensor_port,
								path: '/delete',
								method: 'POST',
								headers: {
								      'Content-Type': 'application/json',
							  }
						};
						var data = {};
						data.sensor_id = sensor.id;
						
						var request = http.request(options, function(response){
							
							var str = '';
							response.on('data', function (chunk) {
							   str += chunk;
							});				
							
							response.on('end', function() {
								str = JSON.parse(str);
							    if(str && str.status ==="success"){
							    	
									callback({status : "success"});
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
				}
			}
		}
	});	
}, 2000);

exports.create_hub = function(req, res){
	
	var hub_params = req.body.hub_params;
	var hub = {};
	hub.id = hub_params.id;
	hub.name = hub_params.name;
	hub.host = hub_params.host;
	hub.port = hub_params.port;
	hub.sensors = [];
	hub_list.push(hub);
	mongo.save_hub(hub);
	res.send({status : "success"});
};

/* function creates a sensor and adds to the hub*/
exports.add_sensor = function(req, res){
	var hub_id = req.body.hub_id;
	var sensor_params = req.body.sensor_params;
	
	var sensor = {};
	sensor.id = sensor_params.sensor_id;
	sensor.name = sensor_params.name;
	sensor.hub_host = sensor_params.hub_host;
	sensor.hub_port = sensor_params.hub_port;	
	sensor.sensor_host = sensor_params.sensor_host;
	sensor.sensor_port = sensor_params.sensor_port;
	sensor.state = "Running";
	
	sensor.delete_sensor = function(callback){
	
		var options = {
				host: sensor.sensor_host,
				port: sensor.sensor_port,
				path: '/delete',
				method: 'POST',
				headers: {
				      'Content-Type': 'application/json',
			  }
		};
		var data = {};
		data.sensor_id = sensor.id;
		
		var request = http.request(options, function(response){
			
			var str = '';
			response.on('data', function (chunk) {
			   str += chunk;
			});				
			
			response.on('end', function() {
				str = JSON.parse(str);
			    if(str && str.status ==="success"){
			    	
					callback({status : "success"});
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
	
	for(var i=0, len=hub_list.length; i<len; i++){
		if(parseInt(hub_list[i].id) === parseInt(hub_id)){
			
			var options = {
					host: sensor.sensor_host,
					port: sensor.sensor_port,
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
				    	sensor.data = str.data;
						hub_list[i].sensors.push(sensor);
						mongo.update_hub(hub_list[i]);
						res.send({status : "success"});
					}
				  });				
			});

			request.on('socket', function (socket) {
			    socket.setTimeout(myTimeout);  
			    socket.on('timeout', function() {		    	
			        req.abort();			        
			    });
			});

			request.on('error', function(err) {
			    if (err.code === "ECONNRESET") {
			        console.log("Timeout occurs");			        
			    }else{
			    	 console.log('problem with request: ' + err.message);
			    }
			    res.send({status : "failed"});
			});
			
			var data = {};
			data.sensor_params = sensor_params;
			request.write(JSON.stringify(data));
			request.end();
			break;
		}
	}
};

exports.delete_sensor = function(req, res){
	var hub_id = req.body.hub_id;
	var sensor_id = req.body.sensor_id;
	
	for(var i=0, len=hub_list.length; i<len; i++){
		if(parseInt(hub_list[i].id) === parseInt(hub_id)){
			for(var j=0, sensor_list_len=hub_list[i].sensors.length; j<sensor_list_len; j++){
				if(parseInt(hub_list[i].sensors[j].id) === parseInt(sensor_id)){
					
					var callback = function(reslt){
						if(reslt.status==="success"){
							hub_list[i].sensors.splice(j,1);
							mongo.update_hub(hub_list[i]);
							res.send({status : "success"});	
						}else{
							res.send({status : "failed"});	
						}
							
					};					
					hub_list[i].sensors[j].delete_sensor(callback);
					break;
				}				
			}
			break;
		}
	}
};

exports.delete_hub = function(req, res){
	var hub_id = req.body.hub_id;
	
	var deleted_count=0;
	for(var i=0, len=hub_list.length; i<len; i++){
		
		if(parseInt(hub_list[i].id) === parseInt(hub_id)){
			for(var j=0, sensor_list_len=hub_list[i].sensors.length; j<sensor_list_len; j++){
				
				var callback = function(reslt){
					
					if(reslt.status==="success"){
						deleted_count++;
						if(deleted_count===sensor_list_len){
							hub_list.splice(i,1);
							mongo.delete_hub(hub_id);
							res.send({status : "success"});
						}
					}else{
						res.send({status : "failed"});
					}
				};
				hub_list[i].sensors[j].delete_sensor(callback);
			}
			break;
		}
	}
};

exports.view_hubs = function(req, res){
	res.send( {hubs : hub_list});
};

exports.view_sensors = function(req, res){
	var hub_id = req.body.hub_id;
	for(var i=0, len=hub_list.length; i<len; i++){
		if(parseInt(hub_list[i].id) === parseInt(hub_id)){
			res.send( {sensors : hub_list[i].sensors});
			break;			
		}
	}	
};

exports.get_data = function(req, res){
	var sensor_id = req.body.sensor_id;
	var hub_id = req.body.hub_id;
	for(var i=0, len=hub_list.length; i<len; i++){
		var hub = hub_list[i];
		if(parseInt(hub.id) === parseInt(hub_id)){
			
			for(var j=0, sensor_list_len=hub.sensors.length; j<sensor_list_len; j++){
				var sensor = hub.sensors[j];
				if(parseInt(sensor.id) === parseInt(sensor_id)){					
					res.send({status:"success", data : sensor.data});
					break;
				}
			}
			break;
		}
	}
};


var rule = new schedule.RecurrenceRule();
rule.second = [10,20,30,40,50,59];
 
var j = schedule.scheduleJob(rule, function(){
	for(var i=0, len=hub_list.length; i<len; i++){
		var hub = hub_list[i];
		for(var j=0, sensor_list_len=hub.sensors.length; j<sensor_list_len; j++){
			var sensor = hub.sensors[j];
			
			var options = {
					host: sensor.sensor_host,
					port: sensor.sensor_port,
					path: '/get-data',
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
				    	sensor.data = str.data;						
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

			
			var data = {};
			data.sensor_id = sensor.id;
			request.write(JSON.stringify(data));
			request.end();
		}		
	}
});