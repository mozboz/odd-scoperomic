/**
 * Returns an array containing the system fields of a object.
 * System fields should not be copied to other objects.
 * @returns {Array}
 */
getSystemFields = function() {
	return [ "id", "rev", "creator", "isCurrent", "name", "derivedObjects", "derivedFrom" ];
};

/**
 * Checks if a name is the name of a system field.
 * @param name {string} the name to check
 * @returns {Boolean}
 */
isSystemField = function(name) {
	return jQuery.inArray(name, getSystemFields()) >= 0;
}


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
 *            {integer} The revision of the object.
 *            (optional, will get the latest when not supplied = undefined)
 * @returns {object} the requested object or null
 */
loadObject = function(id, revision)
{
	if (typeof id == "undefined")
		throw "The id parameter is undefined.";

	if (typeof revision == "undefined")
	{
		var foundObject = Objects.findOne({
			id:id,
			isCurrent:true
		});
		return foundObject;
	}

	var foundObj = Objects.findOne({
		id:id,
		rev:parseInt(revision)
	});
	
	if (typeof foundObj == "undefined")
		return ({
			name:"Error! The query yielded no result!"
		});

	return foundObj;
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
	
	if (typeof obj.isCurrent != "undefined")
		delete obj.isCurrent;

	if (typeof obj._id != "undefined")
		delete obj._id;
	
	if (typeof obj == "undefined")
		throw "The obj parameter is not set!";

	if (typeof obj.name == "undefined"){
		// @todo: this is not a solution at all :-)
		obj.name = "unnamed";
		//throw "The obj.name property is not set!"
	}

	maintainSystemFields(obj);	
	
	obj.creator = SessionAmplify.get(PROFILE_KEY);
	profileAdd("objects", JSON.stringify(obj));
};

/**
 * Checks if all system fields are in place and stuffed with the correct values.
 */
maintainSystemFields = function(obj) {
	
	if (typeof obj.isCurrent != "undefined")
		delete obj.isCurrent;

	if (typeof obj._id != "undefined")
		delete obj._id;
	
	if (typeof obj.derivedObjects == "undefined")
		obj.derivedObjects = [];
	
	var id = "";
	var revision = 0;

	if (typeof obj.id != "undefined" && obj.id != null && obj.id != "")
	{
		// @todo: this is only a temporary solution until the server implements
		// revisions
		var existingObject = this.loadObject(obj.id);

		if (existingObject == null)
			throw "The object with the id: " + obj.id + " does not exist.";

		obj.id = existingObject.id;
		obj.rev = existingObject.rev + 1;
		
	} else
	{
		// Creating a new object
		obj.id = guid();
		obj.rev = 0;
	}
}


/**
 * Derives a new object from an existing one.
 */
deriveObjectFromObjectId = function(id, revision) {
	
	var objectToDeriveFrom = loadObject(id, revision);
	return deriveObject(objectToDeriveFrom);
}

/**
 * Derives a new object from the supplied one.
 */
deriveObjectFromObject = function(obj) {
	
	if (obj == null || typeof obj == "undefined")
		throw "The obj parameter is not set or null!";
	
	var name = prompt("Please enter a object name");
	var derivedObject = {};
	
	for (property in obj) {
		
		if (isSystemField(property))
			continue;
		
		derivedObject[property] = null;
	}
	
	derivedObject.name = name;
	derivedObject.derivedFrom = {
		id:obj.id,
		rev:obj.rev
	};

	storeObject(derivedObject);
	
	// Make the connection	
    Objects.update(obj._id, {
		$push: {
			derivedObjects : derivedObject.id
		}
	});
};