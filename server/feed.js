
var feedPollingHandle;
var pollingInterval = 2500; // ms. How often to poll for changes on a remote API
var feedCheckTimeout = 10000; // ms. How long to wait for a response when validating a profile URL

var urls = [];  // store all urls to poll

function startPolling(interval) {
    return Meteor.setInterval(
        function() {
            for (var urlIndex=0; urlIndex < urls.length; urlIndex++) {
                var url = urls[urlIndex];
                jsonData = Meteor.http.call("GET", url, {headers: {Accept: 'application/vnd.odd-profile.v1+json'}});

                // console.log(jsonData.content);
                var json = JSON.parse(jsonData.content);

                for (var i in json.posts) {
                    // console.log('json: ' + json.posts[i]);

                    var newPostText = "EMPTY POST TEXT";
                    var newPostUrl = "EMPTY URL";
                    try {
                        var post = JSON.parse(json.posts[i]);
                            // console.log(post);

                            if (typeof post.title != 'undefined') {
                                newPostText = post.title;
                            }

                            if (typeof post.url != 'undefined') {
                                newPostUrl = post.url;
                            }


                    } catch (e) {
                        // if exception parsing JSON, then post the whole string as a message
                        newPostText = json.posts[i];
                    }

                    if (Posts.find({title: newPostText, postUrl: newPostUrl, source: url}).count() == 0) {
                        Posts.insert({title: newPostText, postUrl: newPostUrl, source: url});
                    }
                }
                console.log("polled " + url);
            }
        },
        interval);
}

// Check that profile URL is valid
// For now just make sure that it returns 200.
function validateProfileUrl(url) {
    var Future = Npm.require("fibers/future");
    var fut = new Future();
    try {
        Meteor.http.call("GET", url, {timeout: feedCheckTimeout, headers: {Accept: 'application/vnd.odd-profile.v1+json'}}, function(error, result) {
            if (result && result.statusCode == 200) {
                fut.return(true);
            } else {
                console.log("Call to " + url + " failed");
                console.log(result);
                console.log(error);
                fut.return(false);
            }
        });
    } catch (e) {
        console.log("Exception from http call");
        fut.return(false);
    }
    return fut.wait();
}

function addPollingUrl(url) {
    if (!validateProfileUrl(url)) {
        return "INVALID";
    } else {
        if (!feedPollingHandle) {
            feedPollingHandle = startPolling(pollingInterval);
        }
        Posts.remove({});
        urls.push(url);
        console.log("added " + url + " to polling urls");
        console.log("now polling " + urls.length + " items");
        return "OK";
    }
}

Meteor.methods({

    // Logic that happens when user enters/changes their personal profile URL

    // @todo profile URL handling will eventually include other functionality

    // This is where authentication step should be added
    updateUserProfileUrl: function (url) {
        // console.log("your user id is " + Meteor.userId());
        return addPollingUrl(url);
    },

    subscribeToContext: function (url) {
        return addPollingUrl(url);
    },

    // When new status submitted
    postToProfile: function (profileUrl, message) {

        var tries = 0;
        do {
            var result = Meteor.http.call("POST", profileUrl,
                { params: {category: "posts", content: message},
                    headers: {Accept: 'application/vnd.odd-profile.v1+json'}});

            // Annoyingly might get a valid redirect here
            // If so, update the URL and try one more time.

            if(getRedirectUrl(result)) {
                profileUrl = getRedirectUrl(result);
            }

        } while(++tries < 2);

        if (result.statusCode == 200) {
            return "OK";
        } else {
            console.log(result);
            return "FAIL";
        }
    }
});

function getRedirectUrl(httpResult) {
    if (httpResult.statusCode == 301 || httpResult.statusCode == 302) {
        return httpResult.headers.location;
    } else {
        return false;
    }
}
