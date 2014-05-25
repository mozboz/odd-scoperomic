Template.postSubmit.events({
    'click #validate-my-profile': function(e) {
        e.preventDefault();
        url = ($("input[name=myProfileUrl]").val());
        throwError('Checking profile URL: ' + url);
        Meteor.call("updateUserProfileUrl", url, function(error, result) {
            if (result == "OK") {
                Session.set('myProfileUrl', url);
                throwError('Success. Updated your profile URL to: ' + url);
            } else {
                throwError('Updating profile URL failed: ' + result);
            }
        });
    }
})

Template.postSubmit.helpers({
    myProfileUrl: function() {
        return Session.get('myProfileUrl');
    },
    subscribeProfileUrl: function() {
        return "blibble";
    }
});
