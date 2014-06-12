Template.coEdit.rendered = function() {
  var obj = Objects.findOne({
            id:"89a08cf9-9fb8-b406-0cce-2e4049d24377",
            isCurrent:true
        });

    jQuery("#editArea").html(obj.name);


};

Template.coEdit.helpers ({

    css : function () {

        var obj = Objects.findOne({
            id:"89a08cf9-9fb8-b406-0cce-2e4049d24377",
            isCurrent:true
        });

        return obj.name;
    }

});

Template.coEdit.events ({

    'keyup #editArea' : function(){
        jQuery("#css").html(jQuery("#editArea").val());
    }
});
