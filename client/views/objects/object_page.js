Template.objectPage.rendered = function() {
	
	var graphData = Template.objectPage.graph(this.data);
	
	var width = 960,
	    height = 500;

	var force = d3.layout.force()
	    .nodes(graphData.nodes)
	    .links(graphData.edges)
	    .size([width, height])
	    .linkDistance(60)
	    .charge(-300)
	    .on("tick", tick)
	    .start();

	var svg = d3.select("#object-history-graph").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	// build the arrow.
	svg.append("svg:defs").selectAll("marker")
	    .data(["end"])      // Different link/path types can be defined here
	.enter().append("svg:marker")    // This section adds in the arrows
	    .attr("id", String)
	    .attr("viewBox", "0 -5 10 10")
	    .attr("refX", 15)
	    .attr("refY", -1.5)
	    .attr("markerWidth", 6)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto")
	  .append("svg:path")
	    .attr("d", "M0,-5L10,0L0,5");

	// add the links and the arrows
	var path = svg.append("svg:g").selectAll("path")
	    .data(force.links())
	  .enter().append("svg:path")
//	    .attr("class", function(d) { return "link " + d.type; })
	    .attr("class", "link")
	    .attr("marker-end", "url(#end)");

	// define the nodes
	var node = svg.selectAll(".node")
	    .data(force.nodes())
	  .enter().append("g")
	    .attr("class", "node")
	    .call(force.drag);

	// add the nodes
	node.append("circle")
	    .attr("r", 5);

	// add the text 
	node.append("text")
	    .attr("x", 12)
	    .attr("dy", ".35em")
	    .text(function(d) { return d.name; });

	// add the curvy lines
	function tick() {
	    path.attr("d", function(d) {
	        var dx = d.target.x - d.source.x,
	            dy = d.target.y - d.source.y,
	            dr = Math.sqrt(dx * dx + dy * dy);
	        return "M" + 
	            d.source.x + "," + 
	            d.source.y + "A" + 
	            dr + "," + dr + " 0 0,1 " + 
	            d.target.x + "," + 
	            d.target.y;
	    });

	    node
	        .attr("transform", function(d) { 
	  	    return "translate(" + d.x + "," + d.y + ")"; });
	}

};

Template.objectPage.events(
{
	'click #add-attribute-to-object' : function(e)
	{
		e.preventDefault();
		
		var key = jQuery("#key").val().trim();
		var val = jQuery("#value").val().trim();
		
		if (typeof this.obj[key] != "undefined") {
			alert("You can not change the keys of an object. Instead, add new ones.");
			return;
		}
		
		this.obj[key] = val;
		
		storeObject(this.obj);
		
		Router.go("objectPage", {
				id: this.obj.id, 
				rev: this.obj.rev
			});		
	},
	
	'blur .value-editor' : function(e) {

        var editorId = jQuery(e.currentTarget).attr("id");
        var key = editorId.split("_")[0]; 
        var value = jQuery(e.currentTarget).val().trim();
        var prevValue = jQuery(e.currentTarget).attr("data-previous").trim();
		
        if (value == prevValue)
        	return;
        
		var objToUpdate = loadObject(jQuery("#id").val(), parseInt(jQuery("#rev").val()));
		objToUpdate[key] = value;
		
		storeObject(objToUpdate);
		
		Router.go("objectPage", {
				id: objToUpdate.id, 
				rev: objToUpdate.rev
			});	
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
			variableDep : this.variableDep,
			obj : this,
			fixed : fixed,
			variable : variable
		});
	},
	
	graph : function(obj) {

		// Add this object as 
		var nodes = [{name:obj.name + "(" + obj.rev + ")"}];
		var edges = [];
		var previousIndex = 0;

		var currentObj = obj;
		
		while (currentObj.derivedFrom != null
				&& typeof currentObj.derivedFrom != "undefined") {	
			
			currentObj = Objects.findOne({
				id:currentObj.derivedFrom.id,
				rev:currentObj.derivedFrom.rev
			});
			
			if (typeof currentObj == "undefined")
				break;
			
			edges.push({
				source: previousIndex,
				target: ++previousIndex
			});
			
			nodes.push({
				name:currentObj.name + "(" + currentObj.rev + ")"
			});
		}
		
		return {
			nodes: nodes,
			edges: edges
		}
		
	}
});
