//if (Meteor.isClient)
//{

	/**
	 * Parses a oid in the format "99612b47-41ab-5adc-83ab-6a203ad6c2ad#32" and
	 * returns the id and revision.
	 * 
	 * @param oid
	 *            {string} The oid in the format Guid#Revision
	 * @returns {object} An object containing the id and revision (or null for
	 *          the revision if it was not specified)
	 */
	parseOid = function(oid)
	{
		if (typeof oid == "undefined")
			throw "The oid parameter is not specified";

		var groups = oid.match("([0-9a-fA-F-]*)#(\\w*)");
		
		return {
			id: groups[1],
			rev: groups[2]
		}
	};
	
	/**
	 * Loads a specific revision of a object.
	 * 
	 * @param oid
	 *            {string} The oid of the object
	 * @returns {object} the requested object or null
	 */
	loadObjectByOid = function(oid) {
		
		var idRevPair = this.parseOid(oid);
		return this.loadObject(idRevPair.id, idRevPair.rev);
	};

	/**
	 * Loads a specific revision of a object.
	 * 
	 * @param id
	 *            {string} The id of the object
	 * @param revision
	 *            {integer} The revision of the object or 0 for the latest.
	 *            (optional, will get the latest when not supplied)
	 * @returns {object} the requested object or null
	 */
	loadObject = function(id, revision)
	{
		if (typeof id == "undefined")
			throw "The id parameter is undefined.";
		if (typeof revision == "undefined")
			revision = 0;
		
		var oid = id + '#' + revision;
		
		var foundObject = Objects.findOne({
			oid : oid
		});
		
		alert(foundObject);
	};

	/**
	 * Stores the supplied object in the linked profile. If you specify an
	 * existing id, a new revision of this object will be created. Note that you
	 * can only extend existing objects.
	 * 
	 * @param obj
	 *            {object} The object to store
	 * @returns {object} The stored object with it's id and revision
	 */
	storeObject = function(obj)
	{

		if (typeof obj == "undefined")
			throw "The obj parameter is not set!";

		var id = "";
		var revision = 0;

		if (typeof obj.oid != "undefined" && obj.oid != null && obj.id != "")
		{

			// Creating a new revision
			var existingObject = this.loadObject(obj.oid, 0);

		} else
		{

			// Creating a new object

		}
	}
//}