var http = require('http');
var mysql = require('./mysql');

function get_user_vSensors(user_id, callback){
	var sqlQuery = "select * from sensorcloud.virtual_sensors where user_id = "+user_id;
	
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			console.log(rows);
			callback({status : "success", rows : rows});
		}else{
			console.log(err);
			callback({status : "failed"});
		}
	});
	
}

exports.get_vSensors = function(req, res){
	get_user_vSensors(req.body.user_id, function(result){
		if(result.status === "success"){
			res.send({status : "success", rows : result.rows});			
		}else{
			res.send({status : "failed"});
		}
	});
	
};

exports.get_pSensors = function(req, res){
	
	var sqlQuery = "select * from sensorcloud.physical_sensors where user_id = " + req.body.user_id;
	
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			res.send({status : "success", rows : rows});
		}else{
			console.log(err);
			res.send({status : "failed"});
		}
	});
	
};

exports.get_Hubs = function(req, res){
	
	var sqlQuery = "select * from sensorcloud.hubs where hub_user_id = " + req.body.user_id;
	
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			res.send({status : "success", rows : rows});
		}else{
			console.log(err);
			res.send({status : "failed"});
		}
	});
	
};
