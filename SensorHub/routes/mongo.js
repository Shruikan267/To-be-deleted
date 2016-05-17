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


exports.save_hub = function(hub){
	db.collection('hubs').insertOne({id : hub.id, hub : hub}, function(err,r){
		if(!err){
			//callback({status : "success"});
		}else{
			//callback({status : "failed", error : err});
		}
	});
};

exports.delete_hub = function(hub_id){
	db.collection('hubs').deleteOne({id : hub_id}, function(err,r){
		if(!err){
			//callback({status : "success"});
		}else{
			//callback({status : "failed", error : err});
		}
	});
};


exports.read_hubs = function(callback){
	db.collection('hubs').find({}).toArray(function(err, docs){
		if(!err){
			var data = [];
			for(var i = 0, len = docs.length; i<len; i++){
				data.push(docs[i].hub);
			}
			if(data.length>0){
				console.log(data);
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

exports.update_hub = function(hub){
	db.collection('hubs').updateOne({id : hub.id}, {id : hub.id, hub : hub}, function(err,r){
		if(!err){
			//callback({status : "success"});
		}else{
			//callback({status : "failed", error : err});
		}
	});
};