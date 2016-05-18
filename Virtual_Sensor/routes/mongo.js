var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://52.39.177.195:27017/sensorcloud';

var db;

// Initialize connection once
MongoClient.connect(url, function(err, database) {
  if(err){
	  throw err;
  }
  db = database;
});


exports.save_sensor = function(sensor, callback){
	db.collection('vSensors').insertOne({id : parseInt(sensor.id), sensor : sensor}, function(err,r){
		if(!err){
			callback({status : "success"});
		}else{
			callback({status : "failed", error : err});
		}
	});
};

exports.delete_sensor = function(sensor_id, callback){
	db.collection('vSensors').deleteOne({id : parseInt(sensor_id)}, function(err,r){
		if(!err){
			callback({status : "success"});
		}else{
			callback({status : "failed", error : err});
		}
	});
};

exports.update_sensor = function(sensor, callback){
	
	db.collection('vSensors').updateOne({id : parseInt(sensor.id)}, {id : parseInt(sensor.id), sensor : sensor}, function(err,r){
		if(!err){
			callback({status : "success"});
		}else{
			callback({status : "failed", error : err});
		}
	});
};

exports.read_sensor = function(sensor_id, callback){
	db.collection('vSensors').findOne({id : parseInt(sensor_id)}, function(err,sensor){
		if(!err){
			callback({status : "success", sensor : sensor});
		}else{
			callback({status : "failed", error : err});
		}
	});
};

exports.read_all_sensors = function(callback){
	db.collection('vSensors').find({}).toArray(function(err, docs){
		if(!err){
			var data = [];
			for(var i = 0, len = docs.length; i<len; i++){
				data.push(docs[i].sensor);
			}
			if(data.length>0){
				
				callback({status : "success", data : data});
			}else{
				callback({status : "no data"});
			}
			
		}else{
			console.log(err);
			callback({status : "failed"});
		}
	});
};