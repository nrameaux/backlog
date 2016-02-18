'use strict';

angular.module('mean.stories').controller('LotsController',
            ['$scope', '$stateParams', 'Global', 'Lots', 'Stories', 'StoryService', 'LotService', '$http', '$state',
    function($scope, $stateParams, Global, Lots, Stories, StoryService, LotService, $http, $state) {
        $scope.global = Global;
        $scope.package = {
            name: 'lots'
        };

        $scope.initLotView = function(){
            $scope.lots = Lots.query();
        };

        function resetScopeLot(){
            $scope.name = '';
            $scope.description = '';
        }

        $scope.initCreate = function(){
            $http.get('/lots').success(function(data) {
                $scope.lots = data;
            });
        };


        $scope.create = function (isValid) {
            if (isValid) {
                var lot = new Lots({
                    name: $scope.name,
                    description : $scope.description});
                lot.$save(function(response) {
                    $state.go('lot by id', { lotId : response._id});
                });
                resetScopeLot();
            } else {
                $scope.submitted = true;
            }

        };

        $scope.findLot = function(){
            Lots.get({
                lotId: $stateParams.lotId
            }, function(lot) {
                $scope.lot = lot;
            });

            LotService.getStoriesInLot($stateParams.lotId).$promise.then(function(response){
                $scope.stories = response;
                $scope.cost = StoryService.getCost($scope.stories);
            });

            $http.get('/status').success(function(data,status,headers,config){
                $scope.statusColorMap = {};
                for(var i in data){
                    $scope.statusColorMap[data[i].name] = data[i].color;
                }
            });
        };

        $scope.update = function(isValid) {
            if (isValid) {
                $scope.lot.$update(function() {
                    $state.go('lot by id', { lotId : $scope.lot._id });
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.open = function(lot){
            $state.go('lot by id', {lotId: lot._id});
        };

        $scope.openStory = function(story){
            $state.go('story by id', {storyId: story._id});
        };

        $scope.removeLot=function(lot){

        };
    }
]);
