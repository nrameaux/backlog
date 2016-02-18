'use strict';

/**
 * Module dependencies.
 *
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Iteration = new Schema({
    version: {
        type: String,
        required: true,
        trim: true
    },
    numero: {
        type: Number,
        required: false,
        trim: true
    },
    dateDebut: {
        type : Date,
        required: false
    },
    dateFin : {
        type : Date,
        required: false
    },
    duree : {
        type : Number,
        required : false
    }
});

var Lot = new Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    dateMep: {
        type : Date
    }
});

/**
 * Story Schema
 */
var Story = new Schema({
    equipe : {
        type: String,
        trim: false
    },
    numero: {
        type: Number
    },
    iteration: {
        type: Schema.ObjectId,
        ref: 'Iteration'
    },
    statut: {
        type: String,
        trim: true
    },
    priorite: {
        type: Number,
        trim: false
    },
    domaine : {
        type : String,
        required : true,
        trim : true
    },
    apporteur: {
        type: String,
        trim: true
    },
    prio_tech: {
        type: String,
        trim: true
    },
    gain: {
        type: String,
        trim: true
    },
    lot : {
        type: Schema.ObjectId,
        ref: 'Lot'
    },
    titre: {
        type: String,
        required : true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    critereAcceptation: {
        type: String,
        trim: true
    },
    fitness: {
        type: String,
        trim: true
    },
    po: {
        type: String,
        trim: true
    },
    referent_etudiant: {
        type: String,
        trim: true
    },
    referent_dev: {
        type: String,
        trim: true
    },
    macro_chiffrage: {
        type: String,
        trim: true
    },
    chiffrage: {
        type: String,
        trim: true
    },
    dateMep: {
        type : Date
    },
    corbeille: {
        type:Boolean,
        default:false
    }
});


/**
 * Validations
 */
Story.path('equipe').validate(function(equipe) {
    return !!equipe;
}, 'Equipe cannot be blank');

/**
 * Statics
 */

Story.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

Lot.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Iteration', Iteration);
mongoose.model('Lot', Lot);
mongoose.model('Story', Story);
