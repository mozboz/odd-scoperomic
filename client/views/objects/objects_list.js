Template.objectsList.helpers({
    objects: function() {
        return Objects.find();
    }
});

Meteor.subscribe("objects");