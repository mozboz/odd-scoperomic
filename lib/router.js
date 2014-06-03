Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return Meteor.subscribe('posts'); }
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('objectsList', {path: '/objects'});
  
  this.route('setup', {path: '/setup'});

    this.route('objectPage', {
    path: '/objects/:_id',
    data: function() {
    	var obj = Objects.findOne(this.params._id);
    	var arr = [];
    	for (variable in obj) {
    		if (variable == "_id")
    			continue;
    		arr.push({
    			key: variable,
    			value: obj[variable]
    		});
    	}
    	return {
            obj : obj,
            properties:arr
        };

    }
  });
  
  this.route('postPage', {
    path: '/posts/:_id',
    data: function() { return Posts.findOne(this.params._id); }
  });
});

Router.onBeforeAction('loading');
