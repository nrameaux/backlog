/*It contain general selectors or methods all page objects will inherit from. 
Apart from all other page objects this one is created using the prototype model:*/
function Page () {
    this.title = 'My Page';
}

Page.prototype.open = function (path) {
    browser.url('http://localhost:3000/#!/' + path)
}

module.exports = new Page()