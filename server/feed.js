
var feedPollingHandle;
myProfileUrl = "asd";

// "http://localhost/profile/index.php"

function startPolling(url, interval) {
    feedPollingHandle = Meteor.setInterval(
        function() {
            allPosts = Meteor.http.call("GET", url);
            posts = allPosts.content.split("\n");
            for (i in posts) {
                if (Posts.find({title: posts[i]}).count() == 0) {
                    Posts.insert({title: posts[i]});
                }
            }
        },
        interval);
}

// Check that profile URL is valid
// For now just make sure that it returns 200
function validateProfileUrl(url) {
    try {
        httpResult = Meteor.http.call("GET", url, {timeout: 500});
        return httpResult.statusCode == 200;
    } catch (e) {
        return false;
    }
}

// Logic that happens when user enters/changes their personal profile URL
Meteor.methods({
    updateUserProfileUrl: function (url) {
        if (!validateProfileUrl(url)) {
            return "INVALID";
        } else {
            if (feedPollingHandle) {
                Meteor.clearInterval(feedPollingHandle);
            }
            myProfileUrl = url;
            Posts.remove({});
            feedPollingHandle = startPolling(myProfileUrl, 1000);
            return "OK";
        }
    }
});