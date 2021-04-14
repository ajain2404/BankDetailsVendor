sap.ui.define([], function() {
	"use strict";
	var sAuthorized;
	return {
		setAuthority:function(){
			sAuthorized = "X";
		},
		
		getAuthority: function(){
			return sAuthorized;
		}
	};
});