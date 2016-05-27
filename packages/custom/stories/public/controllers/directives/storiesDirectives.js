'use strict';

angular.module('mean.stories').directive('notExistingLot', function(){
    return {
        require : 'ngModel',
        link : function (scope, elm, attrs, ctrl){
            ctrl.$validators.notExistingLot = function(modelValue, viewValue){
                if(!ctrl.$isEmpty(modelValue)) {
                    for (var i = 0; i < scope.lots.length; i = i + 1) {
                        var name = scope.lots[i].name;
                        var comparedName = modelValue;
                        if (name === comparedName) {
                            return false;
                        }
                    }

                }
                return true;
            };
        }
    };
})

.filter('itPcxCalculator', ['StoryService', function(StoryService){
    return function(stories, iteration){
        iteration.cost = StoryService.getCost(stories);
        return stories;
    };
}]);
