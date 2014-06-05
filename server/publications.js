Meteor.publish('posts', function()
{
	return Posts.find();
});

Meteor.publish('objects', function()
{
	return Objects.find(
	{
		isCurrent : true
	});
});