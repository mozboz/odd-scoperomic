Template.footer.events(
{
	'keydown #wish' : function(e)
	{
		if (e.which != 13)
			return;

		e.preventDefault();

		var msg = $("#wish").val();
		throwError('Submitting to profile: ' + msg);
		storeObject(
		{
			"name" : msg
		});
		$("#wish").val("");
	}
});
