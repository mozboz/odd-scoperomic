Template.objectPage.events(
{
	'click #add-attribute-to-object' : function(e)
	{
		this.obj[jQuery("#key").val()] = jQuery("#value").val();
		storeObject(this.obj);
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
		var fixed =
		[];
		var variable =
		[];

		for (propertyName in this)
		{
			var propertyValue = this[propertyName];
			if (propertyName == "_id")
				continue;

			jQuery.inArray(propertyName, [ "oid", "name", "creator" ]) >= 0
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
