function omObject() {
	
	this._id = null;
	this._slots = [];
	this._isLiteral = false;
	this._literalObject = null;
	this._literalType = null;
	
	this.getProperties = function() {
		
	};
	
	this.addProperty = function(type, value) {
		
	};
}

function omType(name) {
	this.name = name;
}

function omProperty(type, value) {
	this.type = type;
	this.value = value;
}