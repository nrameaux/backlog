'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');

exports.teams=function(req,res){
    fs.readFile(__dirname + '/../config/teams.json', function (err, data) {
        if (err) throw err;
        res.send(data);
    });
};

exports.domaines=function(req,res){
    fs.readFile(__dirname + '/../config/domaines.json', function (err, data) {
        if (err) throw err;
        res.send(data);
    });
};

exports.lots=function(req,res){
    fs.readFile(__dirname + '/../config/teams.json', function (err, data) {
        if (err) throw err;
        res.send(data);
    });
};

exports.status=function(req,res){
    fs.readFile(__dirname + '/../config/statuses.json', function (err, data) {
        if (err) throw err;
        res.send(data);
    });
};

exports.priorities=function(req,res){
    fs.readFile(__dirname + '/../config/priorities.json', function (err, data) {
        if (err) throw err;
        res.send(data);
    });
};






