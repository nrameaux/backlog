// spec.js
describe('Create a story', function() {



    beforeEach(function(done) {
        browser.url('http://localhost:3000');
    });

    it('should create a technical story', function() {
       browser.getText('=Backlog technique').click()
        browser.elementIdClick('createStoryButton');    

    });


});