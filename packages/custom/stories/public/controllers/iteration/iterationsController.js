'use strict';

angular.module('mean.stories').controller('IterationsController',
    ['$scope', 'Global', 'Iterations', 'IterationService', 'Tools', '$state', '$http',
    function($scope, Global, Iterations, IterationService, Tools, $state, $http) {
        $scope.global = Global;
        $scope.package = {
            name: 'iterations'
        };

        $scope.initIterationView = function(){
            $http.get('/versions').then(function(result){
                    $scope.versions = result.data;
                }
            );
        };

        function resetScopeIteration(){
            $scope.nbIterations=12;
            $scope.dureeIt=14;
            $scope.version='GXRX';
            $scope.dateDebutVersion = new Date();
        }

        $scope.initCreate = function(){
            resetScopeIteration();
            $scope.initIterations();
        };

        $scope.initIterations = function() {
            if (Tools.isNotEmpty($scope.version) &&
                Tools.isNotEmpty($scope.dateDebutVersion) &&
                Tools.isNotEmpty($scope.nbIterations) &&
                Tools.isNotEmpty($scope.dureeIt)) {
                $scope.iterations = IterationService.initIterations($scope.dateDebutVersion, $scope.version, $scope.nbIterations, $scope.dureeIt);
            }
        };

        $scope.changeDuration = function(iteration, day){
            iteration.duree = iteration.duree + day;
            IterationService.computeDates($scope.iterations);
        };

        $scope.create = function (isValid) {
            console.log(isValid);
            if (isValid) {
                var i = 0;
                console.log('create');
                console.log($scope.iterations);
                for(;i < $scope.iterations.length; i= i+1) {
                    $scope.iterations[i].$save();
                }
                $state.go('view iteration');
            } else {
                $scope.submitted = true;
            }
        };

    }
]);
