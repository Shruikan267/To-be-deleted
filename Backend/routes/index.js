
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.sendfile('login.html');
};

exports.sign_in = function(req, res){
	req.sensorcloud.user_id = 1;
	console.log("signed in");
	res.end();
};