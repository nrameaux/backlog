'use strict';

var stories = require('../controllers/stories');
var lots = require('../controllers/lots');
var iterations = require('../controllers/iterations');
var config = require('../controllers/config');

// The Package is past automatically as first parameter
module.exports = function(Stories, app, auth, database) {

    app.get('/stories/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/stories/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/stories/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/stories/example/render', function(req, res, next) {
    Stories.render('index', {
          package: 'stories'
        }, function(err, html) {
          //Rendering a view from the Package server/views
          res.send(html);
        });
    });

    //**** Lots ****//
    app.route('/lots')
        .get(lots.all)
        .post(lots.create);
    app.route('/lots/:lotId')
        .get(lots.show)
        .put(lots.update);
    app.param('lotId', lots.lot);

    //**** Config ****//
    app.route('/teams').get(config.teams);
    app.route('/domaines').get(config.domaines);
    app.route('/status').get(config.status);
    app.route('/priorities').get(config.priorities);

    //**** Stories ****//
    app.route('/stories')
        .get(stories.all)
        .post(stories.create);
    app.route('/stories/updatePrio').post(stories.updatePrio);
    app.route('/stories/:storyId')
        .get(stories.show)
        .delete(stories.destroy)
        .put(stories.update);
    app.param('storyId', stories.story);
    app.route('/storiesIterations').get(stories.iteration);
    app.route('/velocites').get(stories.getVelociteDistrib);

    //**** Iterations ****//
    app.route('/iterations')
        .get(iterations.all)
        .post(iterations.create);
    app.route('/iterations/:iterationId')
        .get(iterations.show)
        .put(iterations.update);
    app.route('/versions').get(iterations.versions);
    app.param('iterationId', iterations.iteration);

    //**** Stats stories techniques ****//
    app.route('/technicalStoriesPrioDistrib').get(stories.getTechnicalPrioDistribution);
    app.route('/technicalStoriesPrioPcxDistrib').get(stories.getTechnicalPrioPcxDistribution);
    app.route('/technicalStoriesDomainDistrib').get(stories.getTechnicalStoriesDomainDistrib);
};
