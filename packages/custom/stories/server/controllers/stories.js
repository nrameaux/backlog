'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  StoryMongo = mongoose.model('Story'),
  IterationMongo = mongoose.model('Iteration'),
    _ = require('lodash');

/**
 * Save a story after update
 * @param res
 * @param story
 */
function saveStory(res, story){
    story.save(function (err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot update the story'
            });
        }
        res.json(story);
    });
}

/**
 * Update story priorite
 * @param oldStory
 * @param story
 * @returns {boolean}
 */
function needPriorityUpdate(oldStory, story){
    console.log('passage ds needPriorityUpdate');

    var isTeamChanged = oldStory.equipe !== story.equipe;
    var isIterationChanged = "" + oldStory.iteration !== "" + story.iteration;
    console.log('############oldStory.iteration='+ oldStory.iteration + ' &  story.iteration='+story.iteration);

    console.log('############isTeamChanged='+isTeamChanged);
    console.log('############isIterationChanged='+isIterationChanged);
    return isTeamChanged ||  isIterationChanged;
}

/**
 * Find story by id
 */
exports.story = function(req, res, next, id) {
    StoryMongo.load(id, function(err, story) {
    if (err) return next(err);
    if (!story) return next(new Error('Failed to load story ' + id));
    req.story = story;
    next();
  });
};

/**
 * Create a story
 */
exports.create = function(req, res) {
    var story = new StoryMongo(req.body);


    StoryMongo.aggregate([{
        $group : {
            _id : 'nextNumStory',
            value : {$max : '$numero'}
        }
    }], function(err, result){
        if (err) {
            return res.json(500, {
                error: 'Error counting technical stories'
            });
        }

        var prioTarget = 0;
        var numero = 0;
        StoryMongo.find().where({equipe: story.equipe, 'iteration': story.iteration}).sort('-priorite').exec(function(err, stories) {
            if (err) {
                return res.json(500, {
                    error: 'Cannot list the stories'
                });
            }
            if(stories[0] !== undefined) {
                prioTarget = stories[0].priorite;
            }
            story.priorite = prioTarget + 1;

            if(result[0] !== undefined){
                numero = result[0].value;
            }
            story.numero = numero + 1;
            saveStory(res, story);
        });
    });
};


/**
 * Update a story
 */
exports.update = function(req, res) {
    var story = req.story;
    console.log('story='+story);
    story = _.extend(story, req.body);
    console.log('story apres extend = '+story);
    StoryMongo.findOne().where({_id: story._id}).exec(function(err, oldStory) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the stories'
            });
        }
        console.log('oldStory = '+oldStory);
        if(needPriorityUpdate(oldStory, story)){
            var prioTarget = 0;

            StoryMongo.find().where({equipe: story.equipe, 'iteration': story.iteration}).sort('-priorite').exec(function (err, stories) {
                if (err) {
                    return res.json(500, {
                        error: 'Cannot list the stories'
                    });
                }
                if (stories[0] !== undefined) {
                    prioTarget = stories[0].priorite;
                }
                console.log('stories[0]='+stories[0]);

                story.priorite = prioTarget + 1;
                console.log('new prio='+story.priorite);

                saveStory(res, story);
            });
        } else {
            saveStory(res, story);
        }
    });
};

/**
 * Show a story
 */
exports.show = function(req, res) {
    StoryMongo.populate(req.story,'lot', function (err, user) {
        StoryMongo.populate(req.story,'iteration', function (err, user) {
            res.json(req.story);
        });
    });
};

/**
 * List of stories
 */
exports.all = function(req, res) {
    // Récupération des clauses where
    var story_Where = req.query;
    if(req.query.param !== undefined) {
        story_Where = JSON.parse(req.query.param);
    }
    var iterations_where = {};
    if(req.query.itParam !== undefined) {
        iterations_where = JSON.parse(req.query.itParam);
    }

    IterationMongo.find(iterations_where).distinct('_id').exec(function(err, iterationIds) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the stories'
            });
        }

        StoryMongo.find(story_Where).where({ iteration: { $in: iterationIds} }).populate('lot').populate('iteration').sort({priorite: 1}).exec(function (err, stories) {
            if (err) {
                return res.json(500, {
                    error: 'Cannot list the stories'
                });
            }
            res.json(stories);
        });
    });


};

exports.iteration = function(req,res){
    StoryMongo.find().distinct('iteration').exec(function(err,stories){
        if(err){
            return res.json(500, {
                error: 'Probleme distinct IT'
            });
        }
        res.json(stories);
    });
};

exports.version = function(req,res){
    StoryMongo.find().distinct('version').exec(function(err,stories){
        if(err){
            return res.json(500, {
                error: 'Probleme distinct version'
            });
        }
        res.json(stories);
    });
};

/*
List des IT dispo pour une équipe
 */
exports.teamIteration = function(req,res){
    StoryMongo.find().where('equipe',req.params.equipe).distinct('iteration').sort('-iteration').exec(function(err,iterations){
        if(err){
            return res.json(500, {
                error: 'Probleme distinct iteration'
            });
        }
        res.json(iterations);
    });
};

exports.destroy = function(req, res) {
    var story = req.story;

    story.remove(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot delete the story'
            });
        }
        res.json(story);

    });
};

exports.updatePrio = function(req, res){

    StoryMongo.findOne().where({_id: req.body.storyId}).exec(function(err,storySource){

        var nextPriority = storySource.priorite;
        var sorting = '';
        var direction = { $gt : storySource.priorite};
        var storyTarget;

        if(req.body.action === 'up'){
            direction = { $lt : storySource.priorite};
            sorting = '-';
        }

        StoryMongo.find().where({equipe: storySource.equipe, 'iteration': storySource.iteration, priorite : direction }).sort(sorting+'priorite').exec(function(err, stories) {
            if (err) {
                return res.json(500, {
                    error: 'Cannot list the stories'
                });
            }
            if(stories !== undefined){
                storyTarget = stories[0];
                nextPriority = storyTarget.priorite;

                storyTarget.priorite = storySource.priorite;
                storySource.priorite = nextPriority;
                storyTarget.save(function(err) {
                    if (err) {
                        return res.json(500, {
                            error: 'Erreur lors de l\'echange des priorites'
                        });
                    }
                });
                storySource.save(function(err) {
                    if (err) {
                        return res.json(500, {
                            error: 'Erreur lors de l\'echange des priorites'
                        });
                    }
                });
            }
        });


        res.json('ok');
    });
};

exports.getTechnicalPrioDistribution= function(req, res){

    var domaineWhere = req.query.isBacklogScreen === 'true' ? {$in:['Backlog']} : {$nin:['Fonctionnel', 'Backlog']};

    StoryMongo.aggregate([{
        $match : {
            domaine : domaineWhere, statut : {$ne : 'developpé'}, corbeille : false
        }
    }, {
        $group : {
            _id : '$prio_tech',
            value : {$sum : 1}
        }
    }, {
        $sort : { _id : 1 }
    }], function(err, result){
        if (err) {
            return res.json(500, {
                error: 'Error counting technical stories'
            });
        }
        res.json(result);
    });
};

exports.getTechnicalPrioPcxDistribution= function(req, res){
    var o = {};

    o.map = 'function () { emit(this.prio_tech, Number(this.chiffrage)); }';

    o.reduce = function (prioTech, chiffrages) {
        var i = 0;
        var result = 0;
        for (; i < chiffrages.length; i = i +1) {
             result = result+chiffrages[i];
        }
        return result;
    };

    var domaineWhere = req.query.isBacklogScreen === 'true' ? {$in:['Backlog']} : {$nin:['Fonctionnel', 'Backlog']};

    o.query = {domaine : domaineWhere, statut : {$ne : 'developpé'}, corbeille : false, chiffrage : { $ne : null}};

    StoryMongo.mapReduce(o, function(err, result){
        if (err) {
            return res.json(500, {
                error: 'Error counting technical stories'
            });
        }
        res.json(result);
    });
};

exports.getTechnicalStoriesDomainDistrib= function(req, res){

    var domaineWhere = req.query.isBacklogScreen === 'true' ? {$in:['Backlog']} : {$nin:['Fonctionnel', 'Backlog']};

    StoryMongo.aggregate([{
        $match : {
            domaine : domaineWhere, statut : {$ne : 'developpé'}, corbeille : false
        }
    }, {
        $group : {
            _id : '$domaine',
            value : {$sum : 1}
        }
    }, {
        $sort : { _id : 1 }
    }], function(err, result){
        if (err) {
            return res.json(500, {
                error: 'Error counting technical stories'
            });
        }
        res.json(result);
    });
};

exports.getVelociteDistrib = function(req, res){
    var now = new Date();
    now.setDate(now.getDate() + 70);

    IterationMongo.find({ dateFin : { $lt : now}}).sort({ dateFin : 1 }).limit(10).exec(function(err, iterations) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the 10 lasts iterations'
            });
        }

        var iterationsIds = [];
        for(var it in iterations){
            iterationsIds.push(iterations[it]._id);
        }

        StoryMongo.aggregate([{
            $match : {
                iteration : {$in : iterationsIds},
                chiffrage : {$exists : true, $ne : '' }
            }
        },{ $project :{
                iteration : '$iteration',
                equipe : '$equipe',
                toto : parseInt('$chiffrage')
            }
        }, ], function(err, result){
            if (err) {
                return res.json(500, {
                    error: 'Error aggregating velocities'
                });
            }
            res.json(result);
        });
    });

};
