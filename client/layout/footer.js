Template.footer.events({
    'keydown #wish': function(e) {
        if (e.which == 13) {
            e.preventDefault();
            var msg = $("#wish").val();
            throwError('Submitting to profile: ' + msg);
            profileAdd("objects", JSON.stringify( {
            	"oid": guid () + "#0", 
            	"creator": SessionAmplify.get(PROFILE_KEY), 
            	"name": msg        	
            }));
        }
    }
});