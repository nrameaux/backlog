'use strict';

angular.module('mean.stories').controller('FunctionalBacklogController', ['$scope', '$stateParams', 'Global', 'Stories', 'Iterations', 'StoryService', 'TechnicalStoryService', 'SearchService', 'ConfigService', 'Tools', '$http', 'dialogs', '$modal', '$state', '$log',
  function($scope, $stateParams, Global, Stories, Iterations, StoryService, TechnicalStoryService, SearchService, ConfigService, Tools, $http, dialogs ,$modal , $state, $log) {
      $scope.global = Global;
      $scope.package = {
          name: 'stories'
      };
      $scope.search = {};

      $scope.teamFilter = function (expected, actual) {
          if (Tools.isEmpty(actual)) {
              return true;
          } else {
              var text = ('' + actual).toLowerCase();
              return ('' + expected).toLowerCase().indexOf(text) > -1;
          }
      };

      $scope.open = function(story){ StoryService.openStory(story); };

      $scope.isFonctionnal = function(story){ return StoryService.isFunctionnal(story); };

      $scope.isDefaultTeam = function(team){ return team === $scope.teams[0]; };

      $scope.initFullView = function(){
          $scope.corbeilleScreen = $state.is('corbeille');
          initTeams();
          $http.get('/versions').then(function(result){
              $scope.versions = [];
              var i = 0;
              var versionRes = result.data;
              for(;i<versionRes.length ; i =i +1){
                  $scope.versions.push(versionRes[i]._id);
              }
              $scope.version = $scope.versions[0];
              $scope.findIterationByVersion($scope.version);
              $scope.stories = Stories.search({param :'{"corbeille" : "'+$scope.corbeilleScreen+'", "domaine":{"$nin": ["Backlog"]}}', itParam : '{"version":"'+$scope.version+'"}'});

              $scope.velociteCurveIterationsLabels = [];
              $scope.velociteCurveSeries = ['Velocité'];
              var j = 0;
              $scope.iterations.$promise.then(function(iterations){
                  for(;j < iterations.length; j =j+1){
                      $scope.velociteCurveIterationsLabels.push(iterations[j].numero);
                  }
              });
              initVelocityCurveData();
          });
          ConfigService.initStatusColorMap().then(function(colorMap){
              $scope.statusColorMap = colorMap;
          });
      };

      function initVelocityCurveData(){
          $scope.velociteCurveData = [[]];
          var j = 0;
          for(;j <= $scope.velociteCurveIterationsLabels.length; j =j+1){
              $scope.velociteCurveData[0].push(parseInt(0));
          }
      }

      $scope.fillVelocityCurve = function(){
          initVelocityCurveData();
          for(var j in $scope.stories){
            if($scope.stories[j].equipe === $scope.search.equipe && Tools.isNotEmpty($scope.stories[j].chiffrage)){
                $scope.velociteCurveData[0][$scope.stories[j].iteration.numero - 1] += parseInt($scope.stories[j].chiffrage);
            }
          }
      };

      function initTeams(){
          StoryService.getTeamsName().then(
              function(teams) {
                  $scope.teams = teams;
                  //Vérification que la l'équipe dans l'url est connue
                  if($scope.teams.indexOf($stateParams.team) !== -1){
                      if (Tools.isNotEmpty($stateParams.team)) {
                          $scope.search.equipe = $stateParams.team;
                      }
                  }
              }
          );
      }

      $scope.findIterationByVersion = function(newVersion){
          if(Tools.isNotEmpty(newVersion)){
              $scope.iterations =  Iterations.search({param : '{"version":"'+newVersion+'"}', sortParam : '{ "dateDebut" : "1"}'});//
          }
      };

      $scope.refreshIterations = function(newVersion){
          if(Tools.isNotEmpty(newVersion)){
              $scope.iterations =  Iterations.search({param : '{"version":"'+newVersion+'"}', sortParam : '{ "dateDebut" : "1"}'});
              $scope.iterations.$promise.then(function (iterations) {
                  $scope.story.iteration = Iterations.initIteration(iterations);
              });
          }
      };

      $scope.addStoryWithCriteria = function (equipe,iteration,version,storyId) {
          $state.go('create story with params', {version : version, team : equipe, iteration : iteration, storyId : storyId});
      };

      $scope.toggleTrash = function (story) {
          if (story.corbeille === false){
              var del = dialogs.confirm('Suppression de Story', 'Etes-vous sûr de vouloir supprimer la story "' + story.titre + '" ?');
              del.result.then(function(){
                  trash(story);
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

      $scope.find = function() {
          Stories.query(function(stories) {
              $scope.stories = stories;
          });
      };

      $scope.remove = function(story) {
          if (story) {
              story.$remove();
              for (var i in $scope.stories) {
                  if ($scope.stories[i] === story) {
                      $scope.stories.splice(i, 1);
                  }
              }
          } else {
              $scope.story.$remove(function(response) {
                  $state.go('story by id');
              });
          }
      };

      $scope.findByVersion = function(version){
          $scope.stories = Stories.search({param :'{"corbeille" : "'+$scope.corbeilleScreen+'"}', itParam : '{"version":"'+$scope.version+'"}'});
          $scope.iterations =  Iterations.query({ version : $scope.version });
          $scope.search.iteration = null;
      };

      $scope.searchInputAnimation = function(){
          SearchService.inputFieldAnimation($scope.fullSearch);
      };

      $scope.allowNullValue = function (expected, actual) {
          if (actual === null) {
              return true;
          } else {
              // angular's default (non-strict) internal comparator
              var text = ('' + actual).toLowerCase();
              return ('' + expected).toLowerCase().indexOf(text) > -1;
          }
      };

      $scope.upPrio = function(story){
          $http.post('stories/updatePrio',{storyId:story._id, action:'up'}).success(function(){
              $scope.stories = Stories.search({param :'{"corbeille" : "'+$scope.corbeilleScreen+'"}', itParam : '{"version":"'+$scope.version+'"}'});
          }).error(function(){
              $log('Erreur de la repriorisation montante.');
          });

      };

      $scope.downPrio = function(story){
          $http.post('stories/updatePrio',{storyId:story._id, action:'down'}).success(function(){
              $scope.stories = Stories.search({param :'{"corbeille" : "'+$scope.corbeilleScreen+'"}', itParam : '{"version":"'+$scope.version+'"}'});
          }).error(function(){
              $log('Erreur de la repriorisation descendante.');
          });
      };

      $scope.emptyTeamCriteria = function (selectedTeam){
         return Tools.isEmpty(selectedTeam) || selectedTeam === $scope.teams[0];
      };

      $scope.emptyIterationCriteria = function(selectedIteration){
          return Tools.isEmpty(selectedIteration);
      };
  }
]);