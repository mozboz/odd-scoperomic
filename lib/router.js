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

	this.route('setup',
	{
		path : '/setup'
	});

    this.route('people',
	{
		path : '/people'
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

});

Router.onBeforeAction('loading');
