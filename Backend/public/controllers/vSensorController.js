var app = angular.module('vSensors', ['angularUtils.directives.dirPagination']);
app.controller("vSensorController", vSensorController);
vSensorController.$inject = [ '$scope', '$http', '$window'];

function vSensorController($scope, $http, $window) {
	
	$scope.sensors = [];
	$scope.physical_sensors = [];
	$scope.sensor_data = [];
	$scope.display_data = [];
	
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
	
	$scope.getPhysicalSensorList = function(){
		$http({
			method : 'GET',
			url : '/get-all-pSensors',
			data : {
				
			}
		}).success(function(response) {
			$scope.physical_sensors = response.data;
			
			
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
	
	
	$scope.getVirtualSensorData = function(){
		var tempList = [];
		$http({
			method : 'POST',
			url : '/get-all-sensor-data'			
		}).success(function(response) {
			var flag;
			var temp;
			var tempData;
			for(var i=0, len = response.data.length; i<len; i++){
				if(tempList.length>0){
					flag = -1;
					for(var j =0, len2 = tempList.length; j<len2; j++){
						if(tempList[j].id === response.data[i].id){
							flag = j;
							break;
						}
					}
					if(flag!==-1){
						tempData = {};
						tempData.data = response.data[i].data;
						tempData.time = response.data[i].time;
						tempList[j].data.push(tempData);
						
					}else{
						temp = {};
						temp.id = response.data[i].id;
						tempData = {};
						tempData.data = response.data[i].data;
						tempData.time = response.data[i].time;
						temp.data = [tempData];						
						tempList.push(temp);
					}					
				}else{
					temp = {};
					temp.id = response.data[i].id;
					tempData = {};
					tempData.data = response.data[i].data;
					tempData.time = response.data[i].time;
					temp.data = [tempData];						
					tempList.push(temp);
				}
			}
			$scope.sensor_data = tempList;
		}).error(function(error) {
			console.log(error);
		});
	};
	
	$scope.getPhysicalSensorList();
	
	$scope.getVirtualSensorData();
	
	$scope.showSensorData = function(index){
		var j;
		for(var i = 0, len = $scope.sensor_data.length; i<len; i++){
			if($scope.sensors[index].sensor_id === $scope.sensor_data[i].id ){
				j = i;
				break;
			}
		}
		$scope.display_data = $scope.sensor_data[j].data;
	};
}

