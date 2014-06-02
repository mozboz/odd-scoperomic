var objectsData = [{
    oid: '1#0',
    creator: 'http://samuel.liv.io',
    name: 'Samuel'
}];

Template.objectsList.helpers({
    objects: function() {
        return Objects.find();
    }
});
