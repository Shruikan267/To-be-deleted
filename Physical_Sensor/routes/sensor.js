/**
 * http://usejsdoc.org/
 */

var sensor_list = [];
var sensor = {};
var counter=0;
var sensor_data = require("./sensor_data");
var cron = require('node-cron');

function create_sensor(sensor_params){
	var sensor = {};
	sensor.id = sensor_params.sensor_id;
	sensor.pollutant = sensor_params.pollutant;
	sensor.hub_host = sensor_params.hub_host;
	sensor.sensor_host = sensor_params.sensor_host;
	sensor.state = "Running";

	sensor.data_id = counter%15;
	sensor.data = sensor_data.get_all_pollutants_by_sensor_id(sensor.data_id);
	counter++;
	
	sensor_list.push(sensor);
}

function destroy_sensor(sensor_id){
	for (var i=0, len = sensor_list.length; i<len; i++){
		if(sensor_list[i].id === sensor_id){
			sensor_list.splice(i,1);
		}
	}
}

var task = cron.schedule('* */15 * * * *', function() {
	for (var i=0, len = sensor_list.length; i<len; i++){
		sensor_list[i].data = sensor_data.get_all_pollutants_by_sensor_id(sensor_list[i].data_id);
	}
}, true);

exports.create_api = function(req, res){
	var sensor_params = req.body.sensor_params;
	create_sensor(sensor_params);
	res.send({result : "success"});
};

exports.delete_api = function(req, res){
	var sensor_id = req.body.sensor_id;
	destroy_sensor(sensor_id);
	res.send({result : "success"});
};

exports.get_data = function(req, res){
	var sensor_id = req.body.sensor_id;
	var sensor_data;
	for(var i=0, len=sensor_list.length;i<len; i++){
		if(sensor_list[i].id===sensor_id){
			sensor_data = sensor_list[i].data;
		}
	}
	res.send({result : "success", data : sensor_data});
};