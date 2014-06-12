var timeoutHandle = null;
var styleObj = null;

Template.coEdit.rendered = function() {
  var obj = Objects.findOne({
        id:"89a08cf9-9fb8-b406-0cce-2e4049d24377",
        isCurrent:true
    });

    jQuery("#editArea").html(styleObj.name);
};

Template.coEdit.helpers ({

    css : function () {

    	styleObj = Objects.findOne({
            id:"89a08cf9-9fb8-b406-0cce-2e4049d24377",
            isCurrent:true
        });

        return styleObj.name;
    }

});

Template.coEdit.events ({

    'keyup #editArea' : function(){
    	
    	styleObj.name = jQuery("#editArea").val();
        jQuery("#css").html(styleObj.name);
        
        if (timeoutHandle != null)
        	clearTimeout(timeoutHandle);
        
        timeoutHandle = setTimeout(function(){
        	storeObject(styleObj);
        }, 3000);
    }
});