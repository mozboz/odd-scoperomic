Template.postSubmit.events({
    'click #validate-my-profile': function(e) {
        e.preventDefault();
        // Session.set('myProfileUrl', )
        url = ($("input[name=myProfileUrl]").val());
        throwError('Updating profile URL to ' + url);
        Meteor.call("updateUserProfileUrl", url, function(error, result) {
            throwError(result);
        });
    }
})