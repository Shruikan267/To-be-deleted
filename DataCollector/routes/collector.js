var mongo = require('./mongo');

exports.collect_data = function(req, res){
	
	var vSensor_details = req.body.vSensor_details;
	
	var options = {
			host: vSensor_details.host,
			port: vSensor_details.port,
			path: '/get-data',
			method: 'POST',
			headers: {
			      'Content-Type': 'application/json',
		  }
	};
	
	var callback = function(response_data){
		console.log(response_data);
	}
	
	var data = {};
	data.sensor_id = vSensor_details.id;
	
	var request = http.request(options, function(response){
		
		var str = '';
		response.on('data', function (chunk) {
		   str += chunk;
		});				
		
		response.on('end', function() {
			str = JSON.parse(str);
		    if(str && str.result ==="success"){
		    	console.log(str.data);
				callback(str.data);
			}
		});	
		
	});
	request.write(JSON.stringify(data));
	request.end();
	
	
};