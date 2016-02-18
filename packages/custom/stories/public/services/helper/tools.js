'use strict';

angular.module('mean.stories').factory('Tools', function($http, $q) {
    var Tools = {};

    /**
     * Vérification de l'initialisation d'une variable
     * @param field
     * @returns {boolean}
     */
    Tools.isEmpty = function(field){
        return field === undefined || field === null || field === '';
    };


    Tools.isNotEmpty = function(field){
        return !Tools.isEmpty(field);
    };

    return Tools;
});

