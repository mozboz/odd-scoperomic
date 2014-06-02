Template.footer.events({
    'keydown #wish': function(e) {
        if (e.which == 13) {
            e.preventDefault();
            var msg = $("#wish").val();
            throwError('Submitting to profile: ' + msg);
            // profileAdd("objects", msg);
            profileAdd("objects", JSON.stringify( {
            	"oid": guid () + "#0", 
            	"creator": "http://samuelandert.com/samuel", 
            	"name": msg        	
            }));
        }
    }
});

var guid = (function() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	               .toString(16)
	               .substring(1);
	  }
	  return function() {
	    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	           s4() + '-' + s4() + s4() + s4();
	  };
	})();
 
