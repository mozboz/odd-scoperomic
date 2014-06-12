/**
 * 
 */
autoComplete = function(completeThis, context, exact) {
	
	var searchFor = "";
	
	if (exact)
		searchFor = completeThis.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
	else
		searchFor = completeThis;
	
	var searchResult = undefined;
	var autoCompleteEntries = [];
	
	if (typeof exact == "undefined") {
		searchResult = Objects.find({
			name: {$regex: '^' + searchFor + '.*'}
		});
		
		searchResult.forEach(function(element) {
			autoCompleteEntries.push(element);
		});
	} else {
		searchResult = Objects.findOne({
			name: completeThis
		});
		
		if (typeof searchResult != "undefined")
			autoCompleteEntries.push(searchResult);
	}
	
	return autoCompleteEntries;
},

/**
 * Adds a property to an object or changes its value.
 * 
 * @param oid {string}
 * 				The object id and revision in oid format
 * @param key {string}
 * 				The name of the predicate object
 * @param value {string}
 * 				The name of the value (object) object.
 */
addOrChangeProperty = function(oid, key, value) {

	if (typeof oid == "undefined")
		throw "Invalid argument specified for parameter: oid";
	if (typeof key == "undefined")
		throw "Invalid argument specified for parameter: key";
	if (typeof value == "undefined")
		throw "Invalid argument specified for parameter: value";
	
	var idParts = parseOid(oid);
	var objectToModify = loadObject(idParts.id, idParts.rev);
	
	if (typeof objectToModify == "undefined")
		throw "Could not find the object with oid " + oid;
	
	if (typeof objectToModify[key] != "undefined")
		throw "You can not change the keys of an object. Instead, add new ones.";
	
	var keysMatching = autoComplete(key, objectToModify, true);
	var valuesMatching = autoComplete(value, objectToModify, true);
	
	var keyObj = null;
	
	if (keysMatching.length != 1) {
		 keyObj = storeObject({
			name:key
		 });
	} else 
		keyObj = keysMatching[0];

	var valueObj = null;
	
	if (valuesMatching.length != 1) {
		valueObj = storeObject({
			name:value
		});
	} else 
		valueObj = valuesMatching[0];

	objectToModify[keyObj.id + "#" + keyObj.rev] = valueObj.id + "#" + valueObj.rev;

	storeObject(objectToModify);
},

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

	if (groups.length != 3)
		throw "Can not parse the supplied oid: " + oid;
	
	return (
	{
		id : groups[1],
		rev : parseInt(groups[2])
	});
};

/**
 * Returns an array containing the system fields of a object.
 * System fields should not be copied to other objects.
 * @returns {Array}
 */
getSystemFields = function() {
	return [ "_id", "id", "rev", "creator", "isCurrent", "name", "derivedObjects", "derivedFrom", "timestamp", "variableDep" ];
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

	if (typeof obj.name == "undefined")
		throw "The obj.name property is not set!"

	maintainSystemFields(obj);	
	
	obj.creator = SessionAmplify.get(PROFILE_KEY);
	
	var clientObject = jQuery.extend({}, obj);
	clientObject.isCurrent = true;
	
	Objects.insert(clientObject);
	
	$(".main").animate({ scrollTop: $(".inner").height() }, "fast");

	
	profileAdd("objects", JSON.stringify(obj));

	return obj;
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
	
	if (!Date.now) {
	    Date.now = function() { return new Date().getTime(); };
	}
	
	obj.timestamp = Date.now();
	
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
		
		Objects.update(existingObject._id, {
			$set: {
				isCurrent : false
			}
		});
		
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
	return deriveObjectFromObjects([objectToDeriveFrom]);
}

/**
 * Derives a new object from the supplied ones.
 * @param objects {array}
 * 		The objects from which to derive
 */
deriveObjectFromObjects = function(objects) {

	if (objects == null || typeof objects == "undefined")
		throw "The objects parameter is not set or null!";
	
	var name = prompt("Please enter a object name");
	
	var derivedObject = {
			derivedFrom:[]
	};
	
	jQuery.each(objects, function(idx, obj) {
		
		for (property in obj) {			
			if (isSystemField(property))
				continue;
			
			derivedObject[property] = null;
		}
		
		derivedObject.name = name;
		derivedObject.derivedFrom.push({
			id:obj.id,
			rev:obj.rev
		});
	});
	
	storeObject(derivedObject);

	jQuery.each(objects, function(idx, obj) {
		// Tell the source objects that we derived other objects
		// from them
	    Objects.update(obj._id, {
			$push: {
				derivedObjects : derivedObject.id
			}
		});
	});
};
