
addTypeCreator(
    'post', function(data) {
        var post;
        post = getNewContext();
        post.add({'content':data.content});
        post.add({'source':data.source});
        post.add({'context':data.context})
        return post;
    }
)
