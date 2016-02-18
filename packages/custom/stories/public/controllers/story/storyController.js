'use strict';

angular.module('mean.stories').controller('StoryController', ['$scope', '$stateParams', 'Global', 'Stories', 'Iterations', 'StoryService', 'TechnicalStoryService', 'IterationService', 'EditorHelper', 'Tools', '$http', 'dialogs', '$modal', '$state', '$log',
    function($scope, $stateParams, Global, Stories, Iterations, StoryService, TechnicalStoryService, IterationService, EditorHelper, Tools, $http, dialogs ,$modal , $state, $log) {
        $scope.global = Global;
        $scope.package = {
            name: 'stories'
        };

        $scope.editorOptions = EditorHelper.editorOptions();
        $scope.editorOptionsFitness = EditorHelper.editorOptionsFitness();

        $scope.isFonctionnal = function(story){ return StoryService.isFunctionnal(story);};

        $scope.tshirt = function(story){ return StoryService.getTShirtSize(story);};

        $scope.initCreate = function() {
            $scope.story = new Stories();
            $http.get('/versions').then(function(result){
                $scope.versions = [];
                var i = 0;
                var versionRes = result.data;
                var selectedVersionIndex = 0;
                for(;i<versionRes.length ; i =i +1){
                    $scope.versions.push(versionRes[i]._id);
                    if(Tools.isNotEmpty($stateParams.version) && versionRes[i]._id === $stateParams.version){
                        selectedVersionIndex = i;
                    }
                }
                $scope.version = $scope.versions[selectedVersionIndex];
                $scope.findIterationByVersion($scope.version);
                $scope.iterations.$promise.then(function (iterations) {
                    $scope.story.iteration = IterationService.initIteration(iterations);
                });

                StoryService.initializeFromOtherStory($stateParams.storyId, $scope.story);
            });
            $scope.inCreation = true;
            initStoryForm($scope.inCreation);
        };

        $scope.findOne = function() {
            initStoryForm();
            $http.get('/status').success(function(data){
                $scope.statuses = [];
                $scope.statusColorMap = {};
                for(var i in data){
                    $scope.statuses.push(data[i].name);
                    $scope.statusColorMap[data[i].name] = data[i].color;
                }
            });

            $http.get('/versions').then(function(result){
                $scope.versions = [];
                var i = 0;
                var versionRes = result.data;
                for(;i<versionRes.length ; i =i +1){
                    $scope.versions.push(versionRes[i]._id);
                }
                Stories.get({
                    storyId: $stateParams.storyId
                }, function(story) {
                    $scope.version = story.iteration.version;
                    $scope.findIterationByVersion($scope.version);
                    $scope.story = story;
                    console.log(story);
                });
            });
            $scope.inCreation = false;
        };

        $scope.create = function (isValid) {
            if (isValid) {
                var statuses;
                StoryService.getStatuses().then(function (response) {
                    statuses = response.data;

                    var story = $scope.story;
                    story.statut = statuses[0].name;

                    StoryService.formatStory(story);
                    story.$save(function (response) {
                        $state.go('story by id', {storyId: response._id});
                    });

                    resetScopeStory();
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.refreshIterations = function(newVersion){
            if(Tools.isNotEmpty(newVersion)){
                $scope.iterations =  Iterations.search({param : '{"version":"'+newVersion+'"}', sortParam : '{ "dateDebut" : "1"}'});
                $scope.iterations.$promise.then(function (iterations) {
                    $scope.story.iteration = IterationService.initIteration(iterations);
                });
            }
        };

        function initStoryForm(creationMode){
            initTeams(creationMode);
            initDomaines(creationMode);
            initLots();
            initPriorities(creationMode);
        }

        $scope.findIterationByVersion = function(newVersion){
            if(Tools.isNotEmpty(newVersion)){
                $scope.iterations =  Iterations.search({param : '{"version":"'+newVersion+'"}', sortParam : '{ "dateDebut" : "1"}'});//
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                StoryService.formatAndUpdateStoryWithRedirect($scope.story);
            } else {
                $scope.submitted = true;
            }
        };

        function initTeams(creationMode){
            StoryService.getTeamsName().then(
                function(teams){
                    $scope.teams = teams;
                    initStoryTeam(creationMode);
                });
        }

        function initDomaines(creationMode){
            StoryService.getDomainesName().then(function(domaines){
                $scope.domaines = domaines;
                initStoryDomain(creationMode);
            });
        }

        function initStoryDomain(creationMode){
            if($scope.story !== undefined && creationMode) {
                $scope.story.domaine = $scope.domaines[0];
            }
        }

        function initLots(){
            StoryService.getLots().then(function(response){
                $scope.lots = response.data;
            });
        }

        function initPriorities(creationMode){
            StoryService.getPriorities().then(function(priorities){
                $scope.priorities = priorities;
                initStoryPriority(creationMode);
            });
        }

        function initStoryPriority(creationMode) {
            if($scope.story !== undefined && creationMode) {
                $scope.story.prio_tech = $scope.priorities[0];
            }
        }

        function initStoryTeam(creationMode){
            if($scope.story !== undefined) {
                if (Tools.isNotEmpty($stateParams.team)) {
                    $scope.story.equipe = $stateParams.team;
                } else if (creationMode){
                    $scope.story.equipe = $scope.teams[0];
                }
            }
        }

        function resetScopeStory() {
            $scope.story = new Stories();
        }
    }
]);