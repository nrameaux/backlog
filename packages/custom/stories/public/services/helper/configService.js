'use strict';

angular.module('mean.stories').factory('ConfigService',  ['$http', '$q', function($http, $q) {
    var ConfigService = {};

    /**
     * Vérification de l'initialisation d'une variable
     * @param field
     * @returns {boolean}
     */
    ConfigService.initStatusColorMap = function(){
        var deferred = $q.defer();
        $http.get('/status').then(function(result){
            var statusColorMap = {};
            var data = result.data;
            for(var i in data){
                statusColorMap[data[i].name] = data[i].color;
            }
            deferred.resolve(statusColorMap);
        });
        return deferred.promise;
    };

    return ConfigService;
}]);

