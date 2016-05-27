'use strict';

angular.module('mean.stories').factory('TechnicalStoryService', function($http, $q) {
    var TechnicalStoryService = {};

    /**
     * Retourne la distribution des stories techniques.
     * @returns {HttpPromise}
     */
    TechnicalStoryService.getTechnicalStoriesDistrib = function (url, backlogScreen) {
        var technicalDistrib = {};
        var labels = [];
        var distribution = [];
        var deferred = $q.defer();
        $http.get(url, {params : {isBacklogScreen : backlogScreen}}).then(function(response){
            for(var i in response.data) {
                labels.push(response.data[i]._id);
                distribution.push(response.data[i].value);
            }
            technicalDistrib.labels = labels;
            technicalDistrib.distrib = distribution;
            deferred.resolve(technicalDistrib);
        });
        return deferred.promise;
    };

    return TechnicalStoryService;
});

