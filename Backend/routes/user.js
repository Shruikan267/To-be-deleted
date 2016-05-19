var mysql = require('./mysql');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.sign_in = function(req, res){
	console.log(req.param('email'));
	var sqlQuery = "SELECT * FROM sensorcloud.user where email = '" + req.body.email +"' and password = '"+req.body.password+"';";
	
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(err){
			res.send({status : "failed"});
		}else{
			if(rows[0]){
				if(rows[0].user_id){				
					req.sensorcloud.user_id = rows[0].user_id;
					res.send({status: "success"});
				}else{
					res.send({status: "invalid creds"});
				}
			}else{
				res.send({status: "invalid creds"});
			}			
		}
	});
};

exports.sign_up = function(req, res){
	var sqlQuery = "insert into sensorcloud.user (username,firstname,lastname,password,email) values ('"+req.body.username +"','"+ req.body.firstname +"','"+ req.body.lastname +"','"+ req.body.password +"','"+ req.body.email+"')";
	
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(err){
			res.send({status : "failed"});
		}else{
			var sqlQuery2 = "select max(user_id) as user_id from sensorcloud.user;";
			mysql.executeQuery(sqlQuery2, function(err, rows){
				if(err){
					console.log(err);
				}else{
					console.log(rows[0].user_id);
					req.sensorcloud.user_id = rows[0].user_id;
					res.send({status: "success"});
				}
			});
		}
	});
	
	
};