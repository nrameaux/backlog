'use strict';

angular.module('mean.stories').controller('TechnicalBacklogController', ['$scope', '$stateParams', 'Global', 'Stories', 'Iterations', 'StoryService', 'TechnicalStoryService', 'SearchService', 'ConfigService', 'Tools', '$http', 'dialogs', '$modal', '$state', '$log',
    function($scope, $stateParams, Global, Stories, Iterations, StoryService, TechnicalStoryService, SearchService, ConfigService, Tools, $http, dialogs ,$modal , $state, $log) {
        $scope.global = Global;
        $scope.package = {
            name: 'stories'
        };

        $scope.searchInputAnimation = function(){
            SearchService.inputFieldAnimation($scope.fullSearch);
        };

        $scope.initTechnicalView = function(){
            $scope.corbeilleScreen = $state.is('corbeille');
            $scope.backlogScreen = $state.is('backlog');
            $scope.stories = {};
            if($scope.backlogScreen) {
                $scope.stories = Stories.search({param: '{"corbeille":"false","domaine":{"$in": ["Backlog"]}}'});
            } else {
                $scope.stories = Stories.search({param: '{"corbeille":"false","domaine":{"$nin":["Fonctionnel", "Backlog"]}}'});
            }
            $scope.displayedCollection = $scope.stories;
            initStatistiques($scope.backlogScreen);
            ConfigService.initStatusColorMap().then(function(colorMap){
                $scope.statusColorMap = colorMap;
            });
        };

        $scope.open = function(story){
            StoryService.openStory(story);
        };

        $scope.tshirt = function (chiffrage) {
            return StoryService.getTShirtSize(chiffrage);
        };

        function initStatistiques(backlogScreen){
            TechnicalStoryService.getTechnicalStoriesDistrib('/technicalStoriesPrioDistrib',backlogScreen).then(function(result) {
                $scope.technicalStoriesPrioDistrib = {};
                $scope.technicalStoriesPrioDistrib.priorityLabels = result.labels;
                $scope.technicalStoriesPrioDistrib.priorityDistrib = result.distrib;
            });
            TechnicalStoryService.getTechnicalStoriesDistrib('/technicalStoriesPrioPcxDistrib',backlogScreen).then(function(result) {
                $scope.technicalStoriesPrioPcxDistrib = {};
                $scope.technicalStoriesPrioPcxDistrib.priorityLabels = result.labels;
                $scope.technicalStoriesPrioPcxDistrib.priorityDistrib = result.distrib;
            });
            TechnicalStoryService.getTechnicalStoriesDistrib('/technicalStoriesDomainDistrib',backlogScreen).then(function(result) {
                $scope.technicalStoriesDomainDistrib = {};
                $scope.technicalStoriesDomainDistrib.domainLabels = result.labels;
                $scope.technicalStoriesDomainDistrib.domainDistrib = result.distrib;
            });
        }

        $scope.toggleTrash = function (story) {
            if (story.corbeille === false){
                var del = dialogs.confirm('Suppression de Story', 'Etes-vous sûr de vouloir supprimer la story "' + story.titre + '" ?');
                del.result.then(function(){
                    trash(story);
                    initStatistiques();
                });
            } else {
                trash(story);
            }
        };

        var trash = function (story) {
            story.corbeille=!story.corbeille;
            StoryService.formatAndupdateStory(story);
            for (var i in $scope.stories) {
                if ($scope.stories[i] === story) {
                    $scope.stories.splice(i, 1);
                }
            }
        };

        $scope.chartSearchClick = function(categorie){
            $scope.fullSearch = categorie[0].label;
            SearchService.inputFieldAnimation($scope.fullSearch);
        };

        $scope.addStoryWithCriteria = function (equipe,iteration,version,storyId) {
            $state.go('create story with params', {version : version, team : equipe, iteration : iteration, storyId : storyId});
        };

    }
]);