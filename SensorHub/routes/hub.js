/**
 * http://usejsdoc.org/
 */
var http = require('http');

var hub_list = [];

exports.create_hub = function(req, res){
	
	var hub_params = req.body.hub_params;
	console.log(req.body);
	console.log(hub_params);
	var hub = {};
	hub.id = hub_params.id;
	hub.name = hub_params.name;
	hub.host = hub_params.host;
	hub.sensors = [];
	console.log(hub);
	hub_list.push(hub);
	
	res.send({result : "success"});
};

/* function creates a sensor and adds to the hub*/
exports.add_sensor = function(req, res){
	var hub_id = req.body.hub_id;
	var sensor_params = req.body.sensor_params;
	
	var sensor = {};
	sensor.id = sensor_params.sensor_id;
	sensor.name = sensor_params.name;
	sensor.hub_host = sensor_params.hub_host;
	sensor.sensor_host = sensor_params.sensor_host;
	sensor.state = "Running";
	sensor.delete_sensor = function(callback){
		var options = {
				host: sensor.sensor_host,
				path: '/delete',
				method: 'POST',
				sensor_id: sensor.id
		};
		
		var request = http.request(options, function(response){
			if(response.result && response.result ==="success"){
				callback({result : "success"});
			}
		});
		
		request.end();
		
	};
	
	for(var i=0, len=hub_list.length; i<len; i++){
		if(hub_list[i].id === hub_id){
			
			var options = {
					host: sensor.sensor_host,
					path: '/create',
					method: 'POST',
					data: sensor_params
			};
			
			var request = http.request(options, function(response){
				if(response.result && response.result ==="success"){
					hub_list[i].sensors.push(sensor);
					res.send({result : "success"});
				}
			});
			
			request.end();
			break;
		}
	}
};

exports.delete_sensor = function(req, res){
	var hub_id = req.body.hub_id;
	var sensor_id = req.body.sensor_id;
	
	var callback = function(hub_index, sensor_index){
			hub_list[hub_index].sensors.splice(sensor_index,1);
			res.send({result : "success"});		
	};
	
	for(var i=0, len=hub_list.length; i<len; i++){
		if(hub_list[i].id === hub_id){
			for(var j=0, sensor_list_len=hub_list[i].sensors.length; j<sensor_list_len; j++){
				if(hub_list[i].sensors[j].id === sensor_id){
					hub_list[i].sensors[j].delete_sensor(callback(i, j));
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
	
	var callback = function(index, length){
		deleted_count++;
		if(deleted_count===length){
			hub_list.splice(index,1);
			res.send({result : "success"});
		}
	};
	
	for(var i=0, len=hub_list.length; i<len; i++){
		if(hub_list[i].id === hub_id){
			for(var j=0, sensor_list_len=hub_list[i].sensors.length; j<sensor_list_len; j++){
				hub_list[i].sensors[j].delete_sensor(callback(i,sensor_list_len));
			}
			break;
		}
	}
};

exports.view_hubs = function(req, res){
	for(var i=0, len=hub_list.length; i<len; i++){
		console.log('\n');
		console.log('Id: '+hub_list[i].id);
		console.log('Name: '+hub_list[i].name);
		console.log('Host: '+hub_list[i].host);
		console.log('Sensors: '+hub_list[i].sensors);
		console.log('\n');
	}
	res.send( {hubs : hub_list});
};

exports.view_sensors = function(req, res){
	var hub_id = req.body.hub_id;
	console.log(hub_id);
	for(var i=0, len=hub_list.length; i<len; i++){
		if(hub_list[i].id === hub_id){
			for(var j=0, sensor_list_len=hub_list[i].sensors.length; j<sensor_list_len; j++){
				var sensor = hub_list[i].sensors[j];
				console.log('\n');
				console.log('Id: '+sensor.id);
				console.log('Name: '+sensor.name);
				console.log('Host: '+sensor.sensor_host);
				console.log('State: '+sensor.state);
				console.log('\n');
			}
			res.send( {sensors : hub_list[i].sensors});
			break;			
		}
	}	
};