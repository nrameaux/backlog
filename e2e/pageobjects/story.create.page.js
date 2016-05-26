var Page = require('./page')

var StoryPage = Object.create(Page, {
    /**
     * define elements
     */
    title: { get: function () { return browser.element('#titre'); } },
    form:  { get: function () { return browser.element('#storyForm'); } },

    /**
     * define or overwrite page methods
     */
    open: { value: function() {
        Page.open.call(this, 'stories/create////');
    } },

    submit: { value: function() {
        this.form.submitForm();
    } }
});

module.exports = StoryPage;
