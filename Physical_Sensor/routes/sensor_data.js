var schedule = require('node-schedule');

var ozone = [115,110,108,107,102,101,104,101,96,96,100,104,102,99,101];
var ppm = [88,86,83,82,80,84,79,74,74,79,80,83,86,91,93];
var co= [42,43,46,47,49,50,53,48,43,42,42,43,45,50,51];
var so2 = [47,42,42,45,40,36,32,30,34,31,29,30,34,39,35];
var n2o = [73,70,65,60,63,68,70,72,69,71,74,75,73,69,64];

var ozone_base = [115,110,108,107,102,101,104,101,96,96,100,104,102,99,101];
var ppm_base = [88,86,83,82,80,84,79,74,74,79,80,83,86,91,93];
var co_base = [42,43,46,47,49,50,53,48,43,42,42,43,45,50,51];
var so2_base = [47,42,42,45,40,36,32,30,34,31,29,30,34,39,35];
var n2o_base = [73,70,65,60,63,68,70,72,69,71,74,75,73,69,64];

var counter=0;

/* Get data for sensor from the data set */
exports.get_pollutant_by_sensor_id = function(pollutant, id){
	if(pollutant==="ozone"){
		return(ozone[id]);
	}else if(pollutant==="ppm"){
		return(ppm[id]);
	}else if(pollutant==="co"){
		return(co[id]);
	}else if(pollutant==="so2"){
		return(so2[id]);
	}else if(pollutant==="n2o"){
		return(n2o[id]);
	}
};

exports.get_all_pollutants_by_sensor_id = function(id){
	var data = {};
	data.ozone = ozone[id];
	data.ppm = ppm[id];
	data.co = co[id];
	data.so2 = so2[id];
	data.n2o = n2o[id];
	return data;
};

var rule = new schedule.RecurrenceRule();
rule.second = [8,16,24,32,40,48,56];
 
var j = schedule.scheduleJob(rule, function(){
	var randomNo = Math.floor((Math.random() * 5) + 1);
	if(counter % 5 === 0){
		for(var i=0;i<15;i++){
			ozone[i] = ozone[i]-randomNo;
			ppm[i] = ppm[i]-randomNo;
			co[i] = co[i]-randomNo;
			so2[i] = so2[i]-randomNo;
			n2o[i] = n2o[i]-randomNo;
		}
	}else if(counter % 5 === 2){
		for(var i=0;i<15;i++){
			ozone[i] = ozone_base[i];
			ppm[i] = ppm_base[i];
			co[i] = co_base[i];
			so2[i] = so2_base[i];
			n2o[i] = n2o_base[i];
		}
	}else if(counter % 5 === 4){
		for(var i=0;i<15;i++){
			ozone[i] = ozone[i]+randomNo;
			ppm[i] = ppm[i]+randomNo;
			co[i] = co[i]+randomNo;
			so2[i] = so2[i]+randomNo;
			n2o[i] = n2o[i]+randomNo;
		}
	}
	counter++;
});


/* Change values in the data set. Replace by API calls to get value from the AirNow API */
//var task = cron.schedule('* */5 * * * *', function() {
//	console.log("Running data-set cron");
//	if(counter % 3 === 0){
//		for(var i=0;i<15;i++){
//			ozone[i] = ozone[i]-1;
//			ppm[i] = ppm[i]-1;
//			co[i] = co[i]-1;
//			so2[i] = so2[i]-1;
//			n2o[i] = n2o[i]-1;
//		}
//	}else if(counter % 3 === 1){
//		for(var i=0;i<15;i++){
//			ozone[i] = ozone[i]+2;
//			ppm[i] = ppm[i]+2;
//			co[i] = co[i]+2;
//			so2[i] = so2[i]+2;
//			n2o[i] = n2o[i]+2;
//		}
//	}else if(counter % 3 === 2){
//		for(var i=0;i<15;i++){
//			ozone[i] = ozone[i]-1;
//			ppm[i] = ppm[i]-1;
//			co[i] = co[i]-1;
//			so2[i] = so2[i]-1;
//			n2o[i] = n2o[i]-1;
//		}
//	}
//	counter++;
//}, false);