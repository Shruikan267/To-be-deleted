var app = angular.module('devices', []);
app.controller("deviceController", deviceController);
deviceController.$inject = [ '$scope', '$http', '$window'];

function deviceController($scope, $http, $window) {
	$scope.visible_sensors = [];
	$scope.hubs = [];
	var hubArray = [];
	var sensorArray = [];
	
	$http({
		method : 'GET',
		url : '/get-user-hubs',
		data : {
		}
	}).success(function(response) {
		if (response.status === "success") {
			hubArray = response.data;
			for(var i=0; i<hubArray.length; i++){
				hubArray[i].sensors = [];
			}
			
			$http({
				method : 'GET',
				url : '/get-user-pSensors',
				data : {
				}
			}).success(function(response2) {
				
				sensorArray = response2.data;
				for(var i=0; i<hubArray.length; i++){
					for(var j=0; j<sensorArray.length; j++){
						if(sensorArray[j].hub_id === hubArray[i].hub_id){
							hubArray[i].sensors.push(sensorArray[j]);
						}
					}
				}
				$scope.hubs = hubArray;
				$scope.visible_sensors = $scope.hubs[0].sensors;
				document.getElementById("selectedHub").value = $scope.hubs[0].hub_id;
				document.getElementById("selectedHubIndex").value = 0;
			}).error(function(error2) {
				console.log(error2);
			});
			
		} else {
			console.log("error");
		}			
	}).error(function(error) {
		console.log(error);
	});
	
	$scope.view_sensor = function(index){
		console.log( $scope.hubs[index].sensors);
		document.getElementById("selectedHub").value = $scope.hubs[index].hub_id;
		document.getElementById("selectedHubIndex").value = index;
		$scope.visible_sensors = $scope.hubs[index].sensors; 
	};
	
	$scope.delete_hub = function(index){
		var hub_id = $scope.hubs[index].hub_id;
		$http({
			method : 'POST',
			url : '/delete-hub',
			data : {
				hub_id : hub_id
			}
		}).success(function(response) {
			
			window.location.href = "/devices";		
			
			
		}).error(function(error2) {
			console.log(error2);
		});
	};
	
	$scope.delete_sensor = function(index){
		var hub_id = $scope.visible_sensors[index].hub_id;
		var sensor_id = $scope.visible_sensors[index].sensor_id;

		$http({
			method : 'POST',
			url : '/delete-physical-sensor',
			data : {
				hub_id : hub_id,
				sensor_id : sensor_id
			}
		}).success(function(response) {
			
			window.location.href = "/devices";		
			
			
		}).error(function(error2) {
			console.log(error2);
		});
		
	};
}