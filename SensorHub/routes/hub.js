/**
 * http://usejsdoc.org/
 */
var http = require('http');

var hub_list = [];

function create_hub(hub_params){
	var hub = {};
	hub.id = hub_params.id;
	hub.host = hub_params.host;
	hub.sensors = [];
	hub_list.push(hub);
}

/* function creates a sensor and adds to the hub*/
exports.add_sensor = function(req, res){
	var hub_id = req.body.hub_id;
	var sensor_params = req.body.sensor_params;
	
	var sensor = {};
	sensor.id = sensor_params.sensor_id;
	sensor.pollutant = sensor_params.pollutant;
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
		
		var req = http.request(options, function(response){
			if(response.result && response.result ==="success"){
				callback({result : "success"});
			}
		});
		
		req.end();
		
	};
	
	for(var i=0, len=hub_list.length; i<len; i++){
		if(hub_list[i].id === hub_id){
			
			var options = {
					host: sensor.sensor_host,
					path: '/create',
					method: 'POST',
					data: sensor_params
			};
			
			var req = http.request(options, function(response){
				if(response.result && response.result ==="success"){
					hub_list[i].sensors.push(sensor);
					res.send({result : "success"});
				}
			});
			
			req.end();
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