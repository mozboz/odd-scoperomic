Router.configure(
{
	loadingTemplate : 'loading',
	waitOn : function()
	{
		return Meteor.subscribe('posts');
		return Meteor.subscribe('objects');
	}
});

Router.map(function()
{
	/*this.route('timeline',
	{
		path : '/',
		layoutTemplate : 'layout'
	});*/

	this.route('login',
	{
		path : '/login'
	});

	this.route('me',
	{
		path : '/me'
	});

	this.route('objects',
	{
		path : '/',
		layoutTemplate : 'layout'
	});

	this.route('setup',
	{
		path : '/setup',
		layoutTemplate : 'layout'
	});

	this.route('start',
	{
		path : '/start',
		layoutTemplate : 'layout'
	});

    this.route('people',
	{
		path : '/people',
		layoutTemplate : 'layout'
	});

    this.route('overview',
	{
		path : '/:id/:rev/overview',
		layoutTemplate : 'layout',
        data : function()
		{
			return loadObject(this.params.id, this.params.rev);
		}
	});

	this.route('coEdit',
	{
		path : '/:id/:rev/coEdit',
        data : function()
		{
			return loadObject(this.params.id, this.params.rev);
		}
	});

    this.route('history',
	{
		path : '/:id/:rev/history',
		layoutTemplate : 'layout',
        data : function()
		{
			return loadObject(this.params.id, this.params.rev);
		}
	});

    this.route('graph',
	{
		path : '/:id/:rev/graph',
		layoutTemplate : 'layout',
        data : function()
		{
			return loadObject(this.params.id, this.params.rev);
		}
	});

    this.route('composer',
	{
		path : '/:id/:rev/composer',
		layoutTemplate : 'layout',
	    data : function()
		{
	    	return loadObject(this.params.id, this.params.rev);
		}
	});

});

Router.onBeforeAction('loading');
