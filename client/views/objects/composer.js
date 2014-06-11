Template.composer.events(
{
	'keyup #search' : function(e) {
		Session.set("composer_autoComplete", jQuery(e.target).val());
	}
});

Template.composer.helpers(
{
	autocompleteEntries : function()
	{
		return autoComplete(Session.get("composer_autoComplete"), this.obj);
	}
});