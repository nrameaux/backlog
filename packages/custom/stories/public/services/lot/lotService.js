/**
 * Created by jacky on 18/03/15.
 */
'use strict';

angular.module('mean.stories').factory('Lots', ['$resource',
    function($resource) {
        return $resource(
            '/lots/:lotId',
            {lotId: '@_id'},
            {get:{method:'GET'}, update:{method:'PUT'}});
    }
])

.factory('LotService', ['Stories', function(Stories) {
    var LotService = {};

    /**
     * Retourne les stories d'un lot
     * @param lotId
     * @returns {*} promise
     */
    LotService.getStoriesInLot = function (lotId) {
        return Stories.query({ lot : lotId });
    };

    return LotService;
}]);