var app = angular.module('vSensors', []);
app.controller("vSensorController", vSensorController);
vSensorController.$inject = [ '$scope', '$http', '$window'];

function vSensorController($scope, $http, $window) {
	
	$scope.sensors = [];
	

	$scope.getSensorList = function(){
		$http({
			method : 'GET',
			url : '/get-user-vSensors',
			data : {
				
			}
		}).success(function(response) {

			$scope.sensors = response.data;
			for(var i=0, len=$scope.sensors.length;i<len;i++){
				if($scope.sensors[i].state ==="Running"){
					$scope.sensors[i].actn = "Suspend";
					
				}else if($scope.sensors[i].state ==="Suspended"){
					$scope.sensors[i].actn = "Resume";
				}else{
					$scope.sensors[i].actn = "Crashed";
				}
			}
			
		}).error(function(error) {
			console.log(error);
		});
	};
	
	$scope.getSensorList();
	
	$scope.resume_suspend = function(index){
		var id;
		if($scope.sensors[index].state ==="Suspended"){
			id = 2;
		}else if($scope.sensors[index].state ==="Running"){
			id = 1;
		}
		
		$scope.modifySensor($scope.sensors[index].sensor_id, id);
	};
	
	$scope.terminate = function(index){		
		$scope.modifySensor($scope.sensors[index].sensor_id, 3);
	};
	
	$scope.modifySensor = function(sensor_id, action_id){
		var url;
		if(action_id === 1){
			url = "/suspend-virtual-sensor"; 
		}else if(action_id === 2){
			url = "/resume-virtual-sensor";
		}else if(action_id === 3){
			url = "/terminate-virtual-sensor";
		}
		
		$http({
			method : 'POST',
			url : url,
			data : {
				sensor_id : sensor_id
			}
		}).success(function(response) {
			$scope.getSensorList();
		}).error(function(error) {
			console.log(error);
		});	
		
	};
}

