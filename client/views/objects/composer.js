Template.composer.rendered = function () {
	jQuery("#object-composer-container").droppable({
		drop: function (event, ui) {

			var objId = jQuery(ui.helper).attr("data-source-objId");
			var objRev = jQuery(ui.helper).attr("data-source-objRev");
			var fieldId = jQuery(ui.helper).attr("data-source-fieldId");
			var fieldRev = jQuery(ui.helper).attr("data-source-fieldRev");
			var fieldName = jQuery(ui.helper).attr("data-source-name");

			jQuery("#object-composer-container").append("<span>" + objId + "#" + objRev + " - " + fieldName + "(" + fieldId + "#" + fieldRev + ")" + "</span>");
		}
	});
};

Template.composer.events({
	'keyup #search': function (e) {
		Session.set("composer_autoComplete", jQuery(e.target).val());
	}
});

Template.composer.helpers({
	autocompleteEntries: function () {
		var lookup = Session.get("composer_autoComplete");

		if (typeof lookup != "undefined")
			return autoComplete(lookup, this);

		return [];
	}
});
