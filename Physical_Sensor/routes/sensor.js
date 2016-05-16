/**
 * http://usejsdoc.org/
 */

var sensor_list = [];
var sensor = {};
var counter=0;
var sensor_data = require("./sensor_data");

var schedule = require('node-schedule');

function create_sensor(sensor_params){
	
}

function destroy_sensor(sensor_id){
	for (var i=0, len = sensor_list.length; i<len; i++){
		if(sensor_list[i].id === sensor_id){
			sensor_list.splice(i,1);
			break;
		}
	}
}

//var task = cron.schedule('* */15 * * * *', function() {
//	for (var i=0, len = sensor_list.length; i<len; i++){
//		console.log('getting data');
//		sensor_list[i].data = sensor_data.get_all_pollutants_by_sensor_id(sensor_list[i].data_id);
//	}
//}, true);

exports.create_api = function(req, res){
	var sensor_params = req.body.sensor_params;	
	var sensor = {};
	sensor.id = sensor_params.sensor_id;
	sensor.name = sensor_params.name;
	sensor.hub_host = sensor_params.hub_host;
	sensor.hub_port = sensor_params.hub_port;
	sensor.sensor_host = sensor_params.sensor_host;
	sensor.sensor_port = sensor_params.sensor_port;
	sensor.state = "Running";

	sensor.data_id = counter%15;
	sensor.data = {};
	sensor.data = sensor_data.get_all_pollutants_by_sensor_id(sensor.data_id);
	counter++;
	
	sensor_list.push(sensor);
	
	
	res.send({result : "success", data : sensor.data});
};

exports.delete_api = function(req, res){
	
	var sensor_id = req.body.sensor_id;
	console.log(sensor_id);
	
	destroy_sensor(sensor_id);
	console.log("delete api called");
	res.send({result : "success"});
};

exports.get_data = function(req, res){
	var sensor_id = req.body.sensor_id;
	var sensor_data;
	for(var i=0, len=sensor_list.length;i<len; i++){
		if(sensor_list[i].id===sensor_id){
			sensor_data = sensor_list[i].data;
			break;
		}
	}
	res.send({result : "success", data : sensor_data});
};


exports.view_sensors = function(req, res){	
	/*
	 for(var j=0, sensor_list_len=sensor_list.length; j<sensor_list_len; j++){
		var sensor = sensor_list[j];
		console.log('\n');
		console.log('Id: '+sensor.id);
		console.log('Name: '+sensor.name);
		console.log('Host: '+sensor.sensor_host);
		console.log('State: '+sensor.state);
		console.log('\n');
	}
	*/
	
	res.send({sensors:sensor_list});
};

var rule = new schedule.RecurrenceRule();
rule.minute = [10,20,30,40,50,59];
 
var j = schedule.scheduleJob(rule, function(){
	for (var i=0, len = sensor_list.length; i<len; i++){
		sensor_list[i].data = sensor_data.get_all_pollutants_by_sensor_id(sensor_list[i].data_id);
	}
});