Template.overview.rendered = function() {

	// make the entries dragable
	jQuery(".value-editor-key-container").each (function(idx, elm) {
		jQuery(elm).draggable({
			helper:"clone"
		});
	});

	jQuery("#object-composer-container").droppable({
		drop: function(event,ui) {
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


		if (typeof this.obj[key] != "undefined") {
			alert("You can not change the keys of an object. Instead, add new ones.");
			return;
		}

		// Create the predicate object
		var predicateObj = storeObject({
			name:key
		});

		// Create the value object
		var valueObj = storeObject({
			name:val
		});

		this.obj[predicateObj.id + "#" + predicateObj.rev] = valueObj.id + "#" + valueObj.rev;

		storeObject(this.obj);

		Router.go("overview", {
				id: this.obj.id,
				rev: this.obj.rev
			});
	},

	'keyup #key' : function(e) {
		var searchFor = jQuery(e.target).val();

		searchFor = searchFor.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
		var searchResult = Objects.find({
			name: {$regex: '^' + searchFor + '.*'}
		});

		jQuery("#completionList").html("");

		searchResult.forEach(function(element) {
			jQuery("#completionList").html(jQuery("#completionList").html() + element.name + "<br/>");
		});
	},

	'keyup #value' : function(e) {
		var searchFor = jQuery(e.target).val();

		searchFor = searchFor.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
		var searchResult = Objects.find({
			name: {$regex: '^' + searchFor + '.*'}
		});

		jQuery("#completionList").html("");

		searchResult.forEach(function(element) {
			jQuery("#completionList").html(jQuery("#completionList").html() + element.name + "<br/>");
		});
	},

	'blur .value-editor' : function(e) {

        var editorId = jQuery(e.currentTarget).attr("id");
        var key = editorId.split("_")[0];
        var value = jQuery(e.currentTarget).val().trim();

        var prevValue = "";

        if (typeof jQuery(e.currentTarget).attr("data-previous") != "undefined")
        	prevValue = jQuery(e.currentTarget).attr("data-previous").trim();

        if (value == prevValue)
        	return;

		var objToUpdate = loadObject(jQuery("#id").val(), parseInt(jQuery("#rev").val()));
		objToUpdate[key] = value;

		storeObject(objToUpdate);

		Router.go("overview", {
				id: objToUpdate.id,
				rev: objToUpdate.rev
			});
	}
});

Template.overview.helpers(
{
	/**
	 * Supplies the autocomplete list with data.
	 */
	objects : function()
	{
		return Objects.find();
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
	detail : function()
	{
		var fixed = [];
		var variable = [];

		for (propertyName in this)
		{
			var propertyValue = this[propertyName];
			if (propertyName == "_id")
				continue;

			isSystemField(propertyName)
			? fixed.push({ key : propertyName, value : propertyValue })
			: (function() {

					var keyOidParts = parseOid(propertyName);
					var keyObj = Objects.findOne({
						id:keyOidParts.id,
						rev:keyOidParts.rev
					});

					var valObj = {
							name:""
					};

					if (propertyValue != null) {
						var valueOidParts = parseOid(propertyValue);
						var valObj = Objects.findOne({
							id:valueOidParts.id,
							rev:valueOidParts.rev
						});
					}

					variable.push({
						key : keyObj.name,
						value : valObj.name
					});
				}
			  )();
		}

		return ({
			variableDep : this.variableDep,
			obj : this,
			fixed : fixed,
			variable : variable
		});
	}
});
