
addTypeCreator(
    'post', function(data) {
        var post = createObject('defaultFields', {});
        addTruth(post, {'content':data.content});
        addTruth(post, {'source':data.source});
        return post;
    }
)
