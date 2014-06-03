/**
 * Parses a oid in the format "99612b47-41ab-5adc-83ab-6a203ad6c2ad#32" and
 * returns the id and revision.
 * 
 * @param oid
 *            {string} The oid in the format Guid#Revision
 * @returns {object} An object containing the id and revision (or null for the
 *          revision if it was not specified)
 */
parseOid = function(oid)
{
	if (typeof oid == "undefined")
		throw "The oid parameter is not specified";

	var groups = oid.match("([0-9a-fA-F-]*)#(\\w*)");

	return (
	{
		id : groups[1],
		rev : groups[2]
	});
};

/**
 * Creates a oid from a object's id and its revision.
 * 
 * @param id
 *            {string}
 * @param rev
 *            {int} optional, if undefined rev is 0
 */
createOid = function(id, rev)
{
	if (typeof id == "undefined")
		throw "The id parameter is not specified";
	if (typeof rev == "undefined")
		rev = 0;

	return id + '#' + revision;
};

/**
 * Loads a specific revision of a object.
 * 
 * @param oid
 *            {string} The oid of the object
 * @returns {object} the requested object or null
 */
loadObjectByOid = function(oid)
{
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
	{
		var newestRevision = SupportData.findOne(
		{
			id : id
		});

		if (newestRevision == null || typeof newestRevision == "undefined")
			revision = 0;
		else {
			var foundObject = Objects.findOne(newestRevision.mongoId);
			return foundObject;
		}
	}
	
	var oid = id + '#' + revision;

	return Objects.findOne(
	{
		oid : oid
	});

};

/**
 * Stores the supplied object in the linked profile. If you specify an existing
 * id, a new revision of this object will be created. Note that you can only
 * extend existing objects.
 * 
 * @param obj
 *            {object} The object to store
 * @returns {object} The stored object with it's id and revision
 */
storeObject = function(obj)
{

	if (typeof obj == "undefined")
		throw "The obj parameter is not set!";

	if (typeof obj.name == "undefined")
		throw "The obj.name property is not set!"

	var id = "";
	var revision = 0;

	if (typeof obj.oid != "undefined" && obj.oid != null && obj.id != "")
	{
		// @todo: this is only a temporary solution until the server implements
		// revisions
		// Creating a new revision
		var existingObject = this.loadObjectByOid(obj.oid);

		if (existingObject == null)
			throw "The object with the oid: " + obj.oid + " does not exist.";

		var oidComponents = this.parseOid(existingObject.oid);
		if (typeof oidComponents.rev == "undefined"
				|| oidComponents.rev == null)
			newRevision = 0;
		else
			newRevision = oidComponents.rev;

		obj.oid = oidComponents.id + "#" + ++newRevision;

		/*
		 * var merge = function() { var existingObjectProperties =
		 * Object.keys(existingObject).sort(); var newObjectProperties =
		 * Object.keys(obj).sort();
		 * 
		 * var longest = existingObjectProperties.length <
		 * newObjectProperties.length ? newObjectProperties.length :
		 * existingObjectProperties.length;
		 * 
		 * var changedProperties = []; var newOnlyProperties = [];
		 * 
		 * var pointerExistingObject = 0; var pointerNewObject = 0;
		 * 
		 * for ( var current = 0; current < longest; current++) { if
		 * (newObjectProperties[pointerNewObject] ==
		 * existingObjectProperties[pointerExistingObject]) { if
		 * (obj[newObjectProperties[pointerNewObject]] !=
		 * existingObjectProperties[newObjectProperties[pointerNewObject]]) { //
		 * value changed in new object
		 * changedProperties.push(newObjectProperties[pointerNewObject]); } }
		 * 
		 * if (pointerNewObject > existingObjectProperties.length)
		 * newOnlyProperties.push(newObjectProperties[pointerNewObject]);
		 * 
		 * if (pointerNewObject < newObjectProperties.length)
		 * pointerNewObject++; if (pointerExistingObject <
		 * existingObjectProperties.length) pointerExistingObject++; }
		 * 
		 * for (var num1 = 0; num1 < changedProperties.length; num1++) { } for
		 * (var num2 = 0; num2 < newOnlyProperties.length; num2++) { } };
		 */

	} else
	{
		// Creating a new object
		obj.oid = guid() + "#0";
	}
	
	if (typeof obj._id != "undefined")
		delete obj._id;
	
	obj.creator = SessionAmplify.get(PROFILE_KEY);
	profileAdd("objects", JSON.stringify(obj));
}