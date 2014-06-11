Template.autocompleteEntry.events(
{
	'click .autocomplete-entry-expand' : function(e) {
		var element = jQuery(e.target).parent();
		
	},
});

Template.autocompleteEntry.helpers(
{
	fields : function()
	{
		var fields = [];
		for (var f in this) {
			fields.push({
				name:f
			});
		}
		return fields;
	}
});