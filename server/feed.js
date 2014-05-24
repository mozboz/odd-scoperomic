
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

// Active profile interface abstracted here
function getProfileAddUrl(url) {
    return url + "/add.php";
}

Meteor.methods({

    // Logic that happens when user enters/changes their personal profile URL
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
    },

    // When new status submitted
    postToProfile: function (profileUrl, message) {
        result = Meteor.http.call("POST", getProfileAddUrl(profileUrl), {params: {profileitem: message}});
        if (result.statusCode == 200) {
            return "OK";
        } else {
            return "FAIL";
        }
    }
});