var http = require('http');
var mysql = require('./mysql');

exports.get_all_vSensors = function(req, res){
	var sqlQuery = "select * from sensorcloud.virtual_sensors";
	
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			res.send({status : "success", rows : rows});		
		}else{
			console.log(err);
			res.send({status : "failed"});
		}
	});
	
};

exports.get_all_pSensors = function(req, res){
	
	var sqlQuery = "select * from sensorcloud.physical_sensors;";
	
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			res.send({status : "success", rows : rows});
		}else{
			console.log(err);
			res.send({status : "failed"});
		}
	});
	
};

exports.get_all_hubs = function(req, res){
	
	var sqlQuery = "select * from sensorcloud.hubs";
	
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			res.send({status : "success", rows : rows});
		}else{
			console.log(err);
			res.send({status : "failed"});
		}
	});
	
};