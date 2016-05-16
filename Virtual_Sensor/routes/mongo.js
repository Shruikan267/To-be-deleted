var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/sensorcloud';

var db;

// Initialize connection once
MongoClient.connect(url, function(err, database) {
  if(err){
	  throw err;
  }
  db = database;
});


exports.save_sensor = function(sensor, callback){
	db.collection('vSensors').insertOne({id : sensor.id, sensor : sensor}, function(err,r){
		if(!err){
			callback({status : "success"});
		}else{
			callback({status : "failed", error : err});
		}
	});
};

exports.delete_sensor = function(sensor_id, callback){
	db.collection('vSensors').deleteOne({id : sensor_id}, function(err,r){
		if(!err){
			callback({status : "success"});
		}else{
			callback({status : "failed", error : err});
		}
	});
};

exports.update_sensor = function(sensor, callback){
	console.log(sensor);
	db.collection('vSensors').updateOne({id : sensor.id}, {id : sensor.id, sensor : sensor}, function(err,r){
		if(!err){
			callback({status : "success"});
		}else{
			callback({status : "failed", error : err});
		}
	});
};

exports.read_sensor = function(sensor_id, callback){
	db.collection('vSensors').findOne({id : sensor_id}, function(err,sensor){
		if(!err){
			callback({status : "success", sensor : sensor});
		}else{
			callback({status : "failed", error : err});
		}
	});
};