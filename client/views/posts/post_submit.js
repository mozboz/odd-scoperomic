Template.postSubmit.events({
    'click #validate-my-profile': function(e) {
        e.preventDefault();
        var url = ($("input[name=myProfileUrl]").val());
        var oldUrl = SessionAmplify.get('myProfileUrl');
        throwError('Setting profile URL: ' + url);
        Meteor.call("updateUserProfileUrl", url, function(error, result) {
            if (result == "OK") {
                SessionAmplify.set('myProfileUrl', url);
                throwError('Success. Updated your profile URL to: ' + url);
            } else {
                $("input[name=myProfileUrl]").val(oldUrl);
                throwError('Updating profile URL failed, reverting: ' + result);
            }
        });
    }
})

Template.postSubmit.helpers({
    myProfileUrl: function() {
        return SessionAmplify.get('myProfileUrl');
    },
    subscribeProfileUrl: function() {
        return ;
    }
});