Template.footer.events({
    'keydown #wish': function(e) {
        if (e.which == 13) {
            e.preventDefault();
            var msg = $("#wish").val();
            throwError('Submitting to profile: ' + msg);
            // profileAdd("objects", msg);
            profileAdd("objects", JSON.stringify( {
            	"oid": "100#0", 
            	"creator": "http://samuelandert.com/samuel", 
            	"name": "Samuel"        	
            }));
        }
    }
});
