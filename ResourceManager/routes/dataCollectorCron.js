var http = require('http');
var mysql = require('./mysql');
var myTimeout = 5000;
var schedule = require('node-schedule');

var collector_host = "localhost";
var collector_port = 3005;

var rule = new schedule.RecurrenceRule();
rule.second = [12,24,36,48,59];
 
function getActiveSensors(callback){
	var sqlQuery = "SELECT * FROM sensorcloud.virtual_sensors where state = 'Running'";
	
	mysql.executeQuery(sqlQuery, function(err, rows){
		if(!err){
			callback(rows);
		}else{
			callback(null);
		}
	});
}

var j = schedule.scheduleJob(rule, function(){	
	getActiveSensors(function(sensor_list){
		if(sensor_list && sensor_list!==null){
			for(var i=0, len=sensor_list.length; i<len; i++){
				var vSensor_details = {};
				vSensor_details.id = sensor_list[i].sensor_id;
				vSensor_details.user_id = sensor_list[i].user_id;
				vSensor_details.id = sensor_list[i].sensor_id;
				vSensor_details.id = sensor_list[i].sensor_id;
				
				var data = {
					vSensor_details : vSensor_details
				};
				
				var options = {
						host: collector_host,
						port: collector_port,
						path: '/collect-data',
						method: 'POST',
						headers: {
						      'Content-Type': 'application/json',
					  }
				};
				
				var request = http.request(options, function(response){
					
					var str = '';
					response.on('data', function (chunk) {
					   str += chunk;
					});				
					
					response.on('end', function() {
						str = JSON.parse(str);
					    if(str && str.status ==="success"){
					    	//do nothing
						}
					});	
					
				});
				
				request.on('socket', function (socket) {
				    socket.setTimeout(myTimeout);  
				    socket.on('timeout', function() {		    	
				    	request.abort();
				    });
				});

				request.on('error', function(err) {
				    if (err.code === "ECONNRESET") {
				        console.log("Timeout occurs");
				        //specific error treatment
				    }		    
				});
				
				request.write(JSON.stringify(data));
				request.end();				
			}
		}
	});
});