'use strict';

var sampleApp = angular.module('NgSwitcherySample', ['NgSwitchery']);
sampleApp.config(function (NgSwitcheryProvider) {
	NgSwitcheryProvider.extendConfig({
		secondaryColor : '#DFDFDF',
		color : '#000'
	});
});
sampleApp.controller('SwitchController', ['$scope','$timeout', function SwitchController($scope, $timeout){
	$scope.switches = {
		basic: true,
		custom: false
	}
}]);