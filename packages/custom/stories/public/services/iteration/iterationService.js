/**
 * Created by jacky on 18/03/15.
 */
'use strict';

angular.module('mean.stories').factory('Iterations', ['$resource',
    function($resource) {
        return $resource(
            '/iterations/:iterationId',
            {iterationId: '@_id'},
            {
                get:{method:'GET'},
                update:{method:'PUT'},
                search:{method:'GET', params : {filter :'@param'}, isArray:true}
            });
    }
])

.factory('IterationService', ['Iterations','Tools','$stateParams',function(Iterations, Tools, $stateParams) {
    var IterationsService = {};

    /**
     * Retourne les stories d'un lot
     * @param lotId
     * @returns {*} promise
     */
    /*IterationsService.getStoriesInLot = function (lotId) {
        return Stories.query({ lot : lotId });
    };*/

    /**
     * Initialisation d'un tableau d'iterations.
     * @param dateDebutVersion
     * @param version
     * @param nbIterations
     * @param nbJours
     * @returns {Array}
     */
    IterationsService.initIterations = function(dateDebutVersion, version , nbIterations, nbJours){
        var i =0;
        var iterations = [];
        var iteration;
        var dateDebutIteration = new Date(dateDebutVersion);
        var dateFinIteration = new Date(dateDebutVersion);
        dateFinIteration.setDate(dateFinIteration.getDate() + nbJours -1);
        for(;i < nbIterations; i= i+1){
            iteration = new Iterations();
            if( i !== 0){
                dateDebutIteration.setDate(dateDebutIteration.getDate() + nbJours);
                dateFinIteration.setDate(dateFinIteration.getDate() + nbJours );
            }
            iteration.dateDebut = new Date(dateDebutIteration);
            iteration.dateFin = new Date(dateFinIteration);
            iteration.version = version;
            iteration.numero = i +1;
            iteration.duree = nbJours;
            iterations.push(iteration);
        }
        return iterations;
    };

    /**
     * Recalcule les dates de début et de fin d'itération à partir des durées.
     * @param iterations
     */
    IterationsService.computeDates = function(iterations){
        var i =0;
        var currentIteration;
        var newDateDebutIteration = null;
        for(;i < iterations.length; i= i+1) {
            currentIteration = iterations[i];
            if(Tools.isEmpty(newDateDebutIteration)){
                newDateDebutIteration = new Date(currentIteration.dateDebut);
            }
            newDateDebutIteration.setDate(newDateDebutIteration.getDate());
            currentIteration.dateDebut = newDateDebutIteration;
            var newDateFinIteration = new Date(newDateDebutIteration);
            newDateFinIteration.setDate(newDateFinIteration.getDate() + currentIteration.duree -1);
            currentIteration.dateFin = newDateFinIteration;
            newDateDebutIteration = new Date(currentIteration.dateFin);
            newDateDebutIteration.setDate(newDateDebutIteration.getDate() + 1);
        }
    };

    /**
     * Retourne l'itération choisie pour initialisation.
     * @param iterations
     * @returns {*}
     */
    IterationsService.initIteration = function(iterations){
        var iter = null;
        if(Tools.isNotEmpty($stateParams.iteration)) {
            var stateIteration = parseInt($stateParams.iteration);
            var i = 0;
            for (; i < iterations.length; i = i + 1) {
                if(iterations[i].numero === stateIteration) {
                    iter = iterations[i];
                }
            }
        }else{
            if(iterations.length > 0){
                iter = iterations[0];
            }
        }
        return iter;
    };

    return IterationsService;
}]);