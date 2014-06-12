Template.autocompleteEntry.rendered = function() {
	jQuery(".autocomplete-entry-field").draggable({
		helper:"clone",
        appendTo: "body"
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
	
	'click .use-autocomplete-entry' : function(e) {
		var clickedLink = jQuery(e.currentTarget);
		
		var id = clickedLink.attr("data-entry-id");
		var rev = clickedLink.attr("data-entry-rev");
		
		Session.set("use-autocomplete-entry", id + "#" + rev);
	}
});

Template.autocompleteEntry.helpers(
{
	fields : function()
	{
		var fields = [];
		
		for (var f in this) {
			
			if (isSystemField(f))
				continue;
			
			var oidParts = parseOid(f);
			var fieldObj = loadObject(oidParts.id, oidParts.rev);
			
			fields.push({
				name:fieldObj.name,
				sourceObjId : this.id,
				sourceObjRev: this.rev,
				fieldId : fieldObj.id,
				fieldRev : fieldObj.rev
			});
		}
		
		return fields;
	}
});