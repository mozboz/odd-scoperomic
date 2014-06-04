Template.objectPage.events(
{
	'click #add-attribute-to-object' : function(e)
	{
		var key = jQuery("#key").val().trim();
		var val = jQuery("#value").val().trim();
		
		if (typeof this.obj[key] != "undefined") {
			alert("You can not change the keys of an object. Instead, add new ones.");
			return;
		}
		this.obj[key] = val;
		storeObject(this.obj);
	},
	
	'keyup .value-editor' : function(e) {
        if (e.which != 13) 
        	return;
        
        e.preventDefault();

        var editorId = jQuery(e.currentTarget).attr("id");
        var key = editorId.split("_")[0];        
		
		var objToUpdate = loadObject(jQuery("#id").val(), parseInt(jQuery("#rev").val()));
		objToUpdate[key] = jQuery(e.currentTarget).val().trim();
		
		storeObject(objToUpdate);
	}
});

Template.objectPage.helpers(
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
			: variable.push({ key : propertyName, value : propertyValue });
		}

		return ({
			obj : this,
			fixed : fixed,
			variable : variable
		});
	}
});
