
Template.postItem.rendered = function() {

    // this to come from the object
    var templateName = 'postType';

    // data fields contained in this.data
    // passing this to UI.render passes data fields
    var fragment = UI.render(Template[templateName], this);
    UI.insert(fragment, this.find('.content'));
}
