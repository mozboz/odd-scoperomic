Template.autocompleteEntry.rendered = function() {
	jQuery(".autocomplete-entry-field").draggable({
		helper:"clone",
        appendTo: "body",
        start: function(e, ui) {
        	var oid = jQuery(jQuery(this).siblings("input").get(0)).val();
        	jQuery(this).attr("data-oid", oid);
//        	jQuery(this).attr("data-oid", oid);
        }
	});
};

Template.autocompleteEntry.events(
{
	'click .autocomplete-entry-expand' : function(e) {
		
		var element = jQuery(e.target).parent();		
		var container = jQuery(".autocomplete-fields-container", element);

		if (container.hasClass("collapsed")) {
			container.removeClass("collapsed");
			container.addClass("expanded");
			container.height("auto");
		} else {
			container.removeClass("expanded");
			container.addClass("collapsed");
			container.height("18px");
		}
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