var Page = require('./page')

var BacklogPage = Object.create(Page, {
    /**
     * define elements
     */
   
    /**
     * define or overwrite page methods
     */
    open: { value: function(path) {
        Page.open.call(this, path);
    } }
});

module.exports = BacklogPage;
