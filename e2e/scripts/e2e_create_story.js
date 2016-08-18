var StoryTechPage = require('../pageobjects/story.create.page');

describe('Create a story', function() {

    it('should create a technical story', function() {
        StoryTechPage.open();
        StoryTechPage.title.setValue('story2');
        StoryTechPage.submit();
    });


});