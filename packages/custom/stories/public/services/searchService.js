'use strict';

angular.module('mean.stories').factory('SearchService', ['Tools', function(Tools) {
    var SearchService = {};

    var fullSearchCssSelector =  '#fullSearch';

    /**
     * Visibilité et focus du champ de recherche.
     */
    SearchService.inputFieldAnimation = function(val){
        var elem = angular.element(fullSearchCssSelector);
        if(elem.is(':visible') && Tools.isEmpty(val)) {
            //console.log('HIDE');
            hideElement(elem);
        } else {
            //console.log('SHOW');
            showElement(elem, val);
        }
    };

    function showElement(elem, val) {
        elem.fadeIn();
        if (Tools.isEmpty(val)) {
            elem.focus();
        }
    }

    function hideElement(elem){
        elem.fadeOut();
    }


    return SearchService;
}]);

