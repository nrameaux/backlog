// spec.js
describe('Create a story', function() {

    beforeEach(function() {
        browser.get('http://localhost:3000/');
    });

    it('should create a technical story', function() {
        element(by.linkText('Backlog technique')).click();
        element(by.id('createStoryButton')).click();
        element(by.id('titre')).sendKeys('story 1');
        element(by.buttonText('Enregistrer')).submit();

        expect(element(by.id('story_name')).getText()).toEqual('story 1');
    });
});