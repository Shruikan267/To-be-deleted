var MongoClient = require('mongodb').MongoClient;
//var url = 'mongodb://52.39.177.195:27017/sensorcloud';
var url = 'mongodb://52.39.177.195:27017/sensorcloud';

var db;
MongoClient.connect(url, function(err, database) {
  if(err){
	  throw err;
  }
  db = database;
});

exports.get_data = function(req, res){
	var user_id = req.body.user_id;
	var data = [];
//	db.collection('sensor_data').find({}).sort({time : -1}).each(function(err, dt){
//		if(!err){
//			if(dt!==null){
//				console.log(dt);
//				
//				var obj = {};
//				obj.id = dt.id;
//				obj.data = dt.data;
//				obj.time = dt.time;
//				data.push(obj);
//				
//				
//			}			
//		}else{
//			console.log(err);
//			res.send({result : "failed"});
//		}
//	});
	db.collection('sensor_data').find({user_id : user_id}).sort({time : -1}).toArray(function(err, docs){
		if(!err){
			var data = [];
			for(var i = 0, len = docs.length; i<len; i++){
				var tempObj = {};
				tempObj.id = docs[i].id;
				tempObj.data = docs[i].data;
				tempObj.time = docs[i].time;
				data.push(tempObj);
			}
			if(data.length>0){
				res.send({status : "success", data : data});
			}else{
				res.send({status : "no data"});
			}
			
		}else{
			console.log(err);
			res.send({status : "failed"});
		}
	});
	
};