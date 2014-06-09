Router.configure(
{
	layoutTemplate : 'layout',
	loadingTemplate : 'loading',
	waitOn : function()
	{
		return Meteor.subscribe('posts');
	}
});

Router.map(function()
{
	this.route('home',
	{
		path : '/'
	});
	this.route('objectsList',
	{
		path : '/objects'
	});

	this.route('setup',
	{
		path : '/setup'
	});

    this.route('overview',
	{
		path : '/:id/:rev/overview',
        data : function()
		{
			return loadObject(this.params.id, this.params.rev);
		}
	});

    this.route('history',
	{
		path : '/:id/:rev/history',
        data : function()
		{
			return loadObject(this.params.id, this.params.rev);
		}
	});

      this.route('graph',
	{
		path : '/:id/:rev/graph',
        data : function()
		{
			return loadObject(this.params.id, this.params.rev);
		}
	});

	this.route('objectPage',
	{
		path : '/objects/:id/:rev',
		data : function()
		{
			return loadObject(this.params.id, this.params.rev);
		}
	});


	this.route('postPage',
	{
		path : '/posts/:_id',
		data : function()
		{
			return Posts.findOne(this.params._id);
		}
	});
});

Router.onBeforeAction('loading');
