var StoryPage = require('../pageobjects/story.create.page');

var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();

var mockgoose = require('mockgoose');


describe('Create a story', function() {

    beforeEach(function(done) {
        mockgoose(mongoose).then(function() {
            mongoose.connect(config.db, function(err) {
                done(err);
            });
        });
    });


    it('should create a technical story', function() {
        StoryPage.open();
        StoryPage.title.setValue('story2');
        StoryPage.submit();
    });


});