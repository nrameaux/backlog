'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    IterationMongo = mongoose.model('Iteration'),
    _ = require('lodash');


/**
 * List of itérations
 */
exports.all = function(req, res) {
    var my_params = req.query;
    if(req.query.param !== undefined) {
        my_params = JSON.parse(req.query.param);
    }
    var sortParam = {dateDebut: -1};
    if(req.query.sortParam !== undefined){
        sortParam = JSON.parse(req.query.sortParam);
    }
    IterationMongo.find(my_params).sort(sortParam).exec(function(err, iteration) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list iterations'
            });
        }
        res.json(iteration);
    });
};

exports.iteration = function(req, res, next, id) {
    IterationMongo.load(id, function(err, iteration) {
        if (err) return next(err);
        if (!iteration) return next(new Error('Failed to iteration id ' + id));
        req.iteration = iteration;
        next();
    });
};

exports.show = function(req, res) {
    res.json(req.iteration);
};


/**
 * Update une itération
 */
exports.update = function(req, res) {
    var iteration = req.iteration;

    iteration = _.extend(iteration, req.body);

    iteration.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot update the lot'
            });
        }
        res.json(iteration);
    });
};

exports.create = function(req, res) {
    var iteration = new IterationMongo(req.body);
    iteration.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Je peux pas sauvegarder cette itération'
            });
        }
        res.json(iteration);
    });
};

exports.versions = function(req, res) {
    IterationMongo.aggregate([
    {
        $group : {
            _id : '$version',
            dateDebut : {$min : '$dateDebut'},
            dateFin : {$max: '$dateFin'}
        }
    }, {
        $sort : { dateDebut : -1 }
    }], function(err, result){
        if (err) {
            return res.json(500, {
                error: 'Error search version'
            });
        }
        res.json(result);
    });
};