Template.overview.rendered = function () {

	// make the entries draggable
	jQuery(".value-editor-key-container").each(function (idx, elm) {
		jQuery(elm).draggable({
			helper: "clone"
		});
	});

	jQuery("#object-composer-container").droppable({
		drop: function (event, ui) {
			alert(jQuery(ui.draggable.get(0)).html());
		}
	});

};


Template.overview.events(
{
	'click #add-attribute-to-object' : function(e)
	{
		e.preventDefault();

		var key = jQuery("#key").val().trim();
		var val = jQuery("#value").val().trim();

		addOrChangeProperty(this.obj.id + "#" + this.obj.rev, key, val);

		var displyObj = createDisplayObject(this.obj);

		Router.go("overview", {
			id: this.obj.id,
			rev: this.obj.rev + 1
		});
	},

	'keyup #key': function (e) {
		Session.set("overview_autoComplete", jQuery(e.target).val());
	},

	'keyup #value': function (e) {
		Session.set("overview_autoComplete", jQuery(e.target).val());
	},

	'blur .value-editor': function (e) {

		var newVal = jQuery(e.target).val();
		if (newVal == this.val)
			return;

		var id = jQuery("#id").val();
		var rev = jQuery("#rev").val();

		addOrChangeProperty(id + "#" + rev, this.key, newVal);

		Router.go("overview", {
			id: id,
			rev: parseInt(rev) + 1
		});
	}
});

Template.overview.helpers({

	type: function () {
		var displayObject = createDisplayObject(this.obj);
		return displayObject.type;
	},


	/**
	 * Supplies the autocomplete list with data.
	 */
	objects: function () {
		var lookup = Session.get("overview_autoComplete");

		if (typeof lookup != "undefined")
			return autoComplete(lookup, this);

		return [];
	},

	/**
	 * Takes a object and returns a view representation of it.
	 *
	 * @param obj
	 *            {object}
	 * @returns {object} where obj:object is the original object fixed:array are
	 *          the fixed values of the object variable:array are the user
	 *          changeable values
	 */
	detail: function () {
		var fixed = [];
		var variable = [];

		for (propertyName in this) {
			var propertyValue = this[propertyName];
			if (propertyName == "_id")
				continue;

			isSystemField(propertyName) ? fixed.push({
				key: propertyName,
				value: propertyValue
			}) : (function () {

				var keyOidParts = parseOid(propertyName);
				var keyObj = Objects.findOne({
					id: keyOidParts.id,
					rev: keyOidParts.rev
				});

				var valObj = {
					name: ""
				};

				if (propertyValue != null) {
					var valueOidParts = parseOid(propertyValue);
					var valObj = Objects.findOne({
						id: valueOidParts.id,
						rev: valueOidParts.rev
					});
				}

				variable.push({
					key: keyObj.name,
					value: valObj.name
				});
			})();
		}

		return ({
			obj: this,
			fixed: fixed,
			variable: variable
		});
	}
});
