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

	this.route('objectPage',
	{
		path : '/objects/:oid',
		data : function()
		{
			return loadObject(parseOid(this.params.oid).id);
			//return Objects.findOne(this.params._id);
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
