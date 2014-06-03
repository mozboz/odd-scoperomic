Template.objectPage.events({
    'click #add-attribute-to-object': function(e) {

    }
});

Template.objectPage.helpers({
    objects: function() {
        return Objects.find();
    }
});
