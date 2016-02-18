'use strict';

angular.module('mean.stories').factory('Stories', ['$resource',
  function($resource) {
    return $resource(
        '/stories/:storyId',
        {storyId: '@_id'},
        {
            get:{method:'GET'},
            update:{method:'PUT'},
            search:{method:'GET', params : {filter :'@param'}, isArray:true}});
  }
])

.factory('StoryService', ['Stories','$http', '$q', '$state', 'Tools', function(Stories, $http, $q, $state, Tools) {
    var StoryService = {};

    /**
     * Retourne l'ensemble des lots.
     * @returns {HttpPromise}
     */
    StoryService.getLots = function () {
        return $http.get('/lots');
    };

    /**
     * Retourne l'ensemble des priorities.
     * @returns {HttpPromise}
     */
    StoryService.getPriorities = function (){
        return extractName('/priorities');
    };


    /**
     * Retourne un tableau contenant les noms de teams.
     * @returns {*} promise
     */
    StoryService.getTeamsName = function (){
        return extractName('/teams');
    };

    function extractName(url){
        var elements = [];
        var deferred = $q.defer();
        $http.get(url).then(function(response){
            for(var i in response.data) {
                elements.push(response.data[i].name);
            }
            deferred.resolve(elements);
        });
        return deferred.promise;
    }

    /**
     * Initialise la story en paramètre à partir de la story (storyId)
     * @param storyId
     * @param story
     */
    StoryService.initializeFromOtherStory = function(storyId, story) {
        if (Tools.isNotEmpty(storyId)) {
            Stories.get({
                storyId: storyId
            }, function (storySource) {
                story.po = storySource.po;
                story.referent_etudiant = storySource.referent_etudiant;
                story.referent_dev = storySource.referent_dev;
                story.lot = storySource.lot;
                story.domaine = storySource.domaine;
                story.apporteur = storySource.apporteur;
                story.prio_tech = storySource.prio_tech;
                story.gain = storySource.gain;
                story.description = storySource.description;
                story.critereAcceptation = storySource.critereAcceptation;
                story.fitness = storySource.fitness;
            });
        }
    };

    /**
     * Retourne un tableau contenant les noms des domaines.
     * @returns {*} promise
     */
    StoryService.getDomainesName = function (){
        var domaines = [];
        var deferred = $q.defer();
        $http.get('/domaines').then(function(response){
            for(var i in response.data) {
                domaines.push(response.data[i].name);
            }
            deferred.resolve(domaines);
        });
        return deferred.promise;
    };

    /**
     * Retourne l'ensemble des status.
     * @returns {HttpPromise}
     */
    StoryService.getStatuses = function (){
        return $http.get('/status');
    };

    /**
     * Calcule le coût des stories.
     * @param stories
     * @returns {{chiffrage: number, macroChiffrage: number}}
     */
    StoryService.getCost = function(stories){
        var cost = { 'chiffrage' : 0, 'macroChiffrage' : 0};
        if(stories !== undefined) {
            for (var i = 0; i < stories.length; i = i + 1) {
                if (stories[i].chiffrage) {
                    cost.chiffrage += parseInt(stories[i].chiffrage);
                }
                if (stories[i].macro_chiffrage) {
                    cost.macroChiffrage += parseInt(stories[i].macro_chiffrage);
                }
            }
        }
        return cost;
    };

    /**
     * Converti une compléxité numérique en taille de t-shirt
      * @param chiffrage
     * @returns {string}
     */
    StoryService.getTShirtSize = function(chiffrage){
        var size = '-';
        var chiffrageInt = parseInt(chiffrage);
        if(!isNaN(chiffrageInt) && chiffrageInt > 0) {
            if (chiffrageInt < 8) {
                size = 'S';
            } else if (chiffrageInt < 21) {
                size = 'M';
            } else if (chiffrageInt < 55) {
                size = 'L';
            } else if (chiffrageInt >= 55) {
                size = 'XL';
            }
        }
        return size;
    };

    /**
     * Ouvre la vue d'une story.
     * @param story
     */
    StoryService.openStory = function(story){
        $state.go('story by id', {storyId: story._id});
    };

    StoryService.isFunctionnal = function(story){
        if(story !== undefined && story.domaine !== undefined) {
            return story.domaine === 'Fonctionnel';
        }
        return true;
    };

    StoryService.formatStory = function(story) {
        if (Tools.isNotEmpty(story.lot)) {
            story.lot = story.lot._id;
        }
        if (Tools.isNotEmpty(story.iteration)) {
            story.iteration = story.iteration._id;
        }
        if (Tools.isEmpty(story.version)) {
            story.version = 'GXRX';
        }
    };

    /**
     * Mise à jour d'une story avec formatage
     * @param story
     */
    StoryService.formatAndupdateStory = function (story) {
        StoryService.formatStory(story);
        story.$update();
    };

    /**
     * Mise à jour d'une story avec formatage et redirection
     * @param story
     */
    StoryService.formatAndUpdateStoryWithRedirect = function (story) {
        StoryService.formatStory(story);
        story.$update(function () {
            $state.go('story by id', {storyId : story._id});
        });
    };

    return StoryService;

}]);

