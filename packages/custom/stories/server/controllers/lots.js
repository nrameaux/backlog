'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    LotMongo = mongoose.model('Lot'),
    _ = require('lodash');


/**
 * List of lots
 */
exports.all = function(req, res) {

    LotMongo.find(req.query).sort({name: -1}).exec(function(err, lots) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the lots'
            });
        }
        res.json(lots);
    });
};

exports.lot = function(req, res, next, id) {
    LotMongo.load(id, function(err, lot) {
        if (err) return next(err);
        if (!lot) return next(new Error('Failed to load lot ' + id));
        req.lot = lot;
        next();
    });
};

exports.show = function(req, res) {
    res.json(req.lot);
};


/**
 * Update un lot
 */
exports.update = function(req, res) {
    var lot = req.lot;

    lot = _.extend(lot, req.body);

    lot.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot update the lot'
            });
        }
        res.json(lot);

    });
};

exports.create = function(req, res) {
    var lot = new LotMongo(req.body);
    lot.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Je peux pas sauvegarder ce lot'
            });
        }
        res.json(lot);
    });
};