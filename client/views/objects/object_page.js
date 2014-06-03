Template.objectPage.events(
{
	'click #add-attribute-to-object' : function(e)
	{
		loadObjectByOid("99612b47-41ab-5adc-83ab-6a203ad6c2ad#0");
	}
});

Template.objectPage.helpers(
{
	/**
	 * Takes a object and returns a view representation of it.
	 * 
	 * @param obj
	 *            {object}
	 * @returns {object} where obj:object is the original object fixed:array are
	 *          the fixed values of the object variable:array are the user
	 *          changeable values
	 */
	object : function()
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
			
			? fixed.push(
				{
					key : propertyName,
					value : propertyValue
				}) 
			: variable.push(
				{
					key : propertyName,
					value : propertyValue
				});
		}

		return {
			obj : this,
			fixed : fixed,
			variable : variable
		};
	}
});