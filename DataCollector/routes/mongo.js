var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://52.39.177.195:27017/sensorcloud';

var db;
MongoClient.connect(url, function(err, database) {
  if(err){
	  throw err;
  }
  db = database;
});

exports.save_data = function(sensor_data, callback){
	console.log(sensor_data);
	var time = new Date();
	var id = sensor_data.id;
	var user_id = sensor_data.user_id;
	var data = sensor_data.data;	
	
	db.collection('sensor_data').insertOne({id : id, user_id : user_id, data : data, time : time}, function(err,r){
		if(!err){
			callback({status : "success"});
		}else{
			console.log(err);
			callback({status : "failed", error : err});
		}
	});
};