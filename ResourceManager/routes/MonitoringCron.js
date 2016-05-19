var http = require('http');
var schedule = require('node-schedule');

var myTimeout = 5000;

var collector_host = "localhost";
var collector_port = 3003;
var collector_state = "Running";

var AccessMgr_host = "localhost";
var AccessMgr_port = 3004;
var AccessMgr_state = "Running";

var vSensorServer_host = "localhost";
var vSensorServer_port = 3002;
var vSensorServer_state = "Running";

var rule = new schedule.RecurrenceRule();
rule.second = [0,10,20,30,40,50];

var j = schedule.scheduleJob(rule, function(){
	
	var options = {
			host: collector_host,
			port: collector_port,
			path: '/ping',
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
			collector_state = "Running";
		});	
		
	});
	
	request.on('socket', function (socket) {
	    socket.setTimeout(myTimeout);  
	    socket.on('timeout', function() {
	    	collector_state = "Crashed";
	    	request.abort();
	    });
	});

	request.on('error', function(err) {
	    if (err.code === "ECONNRESET") {
	        console.log("Collector Monitor Timeout Occured");
	        //specific error treatment
	    }		    
	});
	
	request.write();
	request.end();
	
	
	var options2 = {
			host: AccessMgr_host,
			port: AccessMgr_port,
			path: '/ping',
			method: 'POST',
			headers: {
			      'Content-Type': 'application/json',
		  }
	};	
	
	
	var request2 = http.request(options2, function(response){
		
		var str = '';
		response.on('data', function (chunk) {
		   str += chunk;
		});				
		
		response.on('end', function() {
			collector_state = "Running";
		});	
		
	});
	
	request2.on('socket', function (socket) {
	    socket.setTimeout(myTimeout);  
	    socket.on('timeout', function() {
	    	AccessMgr_state = "Crashed";
	    	request.abort();
	    });
	});

	request2.on('error', function(err) {
	    if (err.code === "ECONNRESET") {
	        console.log("Collector Monitor Timeout Occured");
	        //specific error treatment
	    }		    
	});
	
	request2.write();
	request2.end();
	
	
	var options3 = {
			host: vSensorServer_host,
			port: vSensorServer_port,
			path: '/ping',
			method: 'POST',
			headers: {
			      'Content-Type': 'application/json',
		  }
	};	
	
	
	var request3 = http.request(options3, function(response){
		
		var str = '';
		response.on('data', function (chunk) {
		   str += chunk;
		});				
		
		response.on('end', function() {
			collector_state = "Running";
		});	
		
	});
	
	request3.on('socket', function (socket) {
	    socket.setTimeout(myTimeout);  
	    socket.on('timeout', function() {
	    	vSensorServer_state = "Crashed";
	    	request.abort();
	    });
	});

	request3.on('error', function(err) {
	    if (err.code === "ECONNRESET") {
	        console.log("Collector Monitor Timeout Occured");
	        //specific error treatment
	    }		    
	});
	
	request3.write();
	request3.end();
	
});
