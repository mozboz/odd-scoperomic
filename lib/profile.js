if (Meteor.isClient) {

    profileAdd = function(type, content, onSuccess, onFail) {

        if (!SessionAmplify.get(PROFILE_KEY)) {
            throwError('Please connect to your profile first');

        } else {

            Meteor.call("postToProfile", SessionAmplify.get(PROFILE_KEY), type, content, function(error, result) {
                if (result == "OK") {
                    throwError("Successfully posted " + type + ":" + content + " to " + SessionAmplify.get(PROFILE_KEY)) ;
                    if (typeof onSuccess == "function") {
                        onSuccess();
                    }
                } else {
                    throwError("Failed to post " + type + ":" + content + " to " + SessionAmplify.get(PROFILE_KEY)) ;
                    if (typeof onFail == "function") {
                        onFail();
                    }
                }
            });

        }
    };
}
