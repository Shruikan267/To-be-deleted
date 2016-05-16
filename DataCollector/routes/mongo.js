var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/sensorcloud';

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
	var data = sensor_data.data;
	
	var obj = {
		time : time,
		data : data
	};
	
	
	db.collection('sensor_data').updateOne({id : sensor_data.sensor_id}, {$push : { data : obj }}, {upsert : true}, function(err,r){
		if(!err){
			callback({status : "success"});
		}else{
			callback({status : "failed", error : err});
		}
	});
};