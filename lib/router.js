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

    	var fixed = [];
    	var variable = [];

    	for (propertyName in obj) {

    		var propertyValue = obj[propertyName];

    		if (propertyName == "_id")
    			continue;

    		jQuery.inArray(propertyName, ["oid", "name", "creator"]) >= 0
    		? fixed.push({key: propertyName, value: propertyValue})
    		: variable.push({key: propertyName, value: propertyValue});

    	}

    	return {
    		obj: obj,
    		fixed : fixed,
    		variable : variable
    	}
    }
  });
  
  this.route('postPage', {
    path: '/posts/:_id',
    data: function() { return Posts.findOne(this.params._id); }
  });
});

Router.onBeforeAction('loading');
