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

	return id + '#' + rev;
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

	if (typeof revision == "undefined" 
		|| revision == 0)
	{
		var foundObject = Objects.findOne({
			id:id,
			_current:true
		});
		return foundObject;
	}
	
	var oid = id + '#' + revision;

	return Objects.findOne(
	{
		id:id,
		rev:revision
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

	if (typeof obj.id != "undefined" && obj.id != null && obj.id != "")
	{
		// @todo: this is only a temporary solution until the server implements
		// revisions
		var existingObject = this.loadObject(obj.id, 0);

		if (existingObject == null)
			throw "The object with the id: " + obj.id + " does not exist.";

		obj.id = oidComponents.id;
		obj.rev = existingObject.rev + 1;

	} else
	{
		// Creating a new object
		obj.id = guid();
		obj.rev = 0;
	}
	
	if (typeof obj._id != "undefined")
		delete obj._id;
	
	obj.creator = SessionAmplify.get(PROFILE_KEY);
	profileAdd("objects", JSON.stringify(obj));
}