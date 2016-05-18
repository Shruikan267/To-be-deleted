var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://52.39.177.195:27017/sensorcloud';

var db;

// Initialize connection once
MongoClient.connect(url, function(err, database) {
  if(err){
	  console.log(err);
	  throw err;
  }
  db = database;
});


exports.save_sensor = function(sensor){
	db.collection('pSensors').insertOne({id : parseInt(sensor.id), sensor : sensor}, function(err,r){
		if(!err){
			//callback({status : "success"});
		}else{
			//callback({status : "failed", error : err});
		}
	});
};

exports.delete_sensor = function(sensor_id){
	db.collection('pSensors').deleteOne({id : parseInt(sensor_id)}, function(err,r){
		if(!err){
			//callback({status : "success"});
		}else{
			//callback({status : "failed", error : err});
		}
	});
};


exports.read_sensors = function(callback){
	db.collection('pSensors').find({}).toArray(function(err, docs){
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