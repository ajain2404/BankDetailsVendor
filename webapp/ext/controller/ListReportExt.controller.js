sap.ui.define([
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/MessageStrip",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text",
	"sap/ui/core/ValueState",
	"sap/ui/core/routing/History"
], function (Fragment, MessageBox, MessageToast, MessageStrip, JSONModel, Dialog, DialogType, Button, ButtonType, Text, ValueState,
	History) {
	"use strict";

	return sap.ui.controller("com.evonik.mdm.vendor.cbv.bankdetails.ext.controller.ListReportExt", {
			onInit: function (oEvent) {
				var oViewModel = new JSONModel();
				this.getView().setModel(oViewModel, "local");

			// 	var oModel = this.getOwnerComponent().getModel();
			// 	var sUrl = "/AuthorizationCheckSet";
			// 	oModel.read(sUrl, {
			// 			async: false,
			// 			success: function (oData, controller) {
			// 				sap.ui.core.BusyIndicator.hide();
			// 				var sResult = oData.results[0];
			// 				if (sResult.Editable === false) {
			// 					MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("Message.AuthorizationError"));
			// 				}
			// 			}.bind(this),
			// 		error: function (oError) {
			// 			sap.ui.core.BusyIndicator.hide();
			// 		}
			// 	});
			// //End of Authority Check Logic
		},

		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				// Navigate back to FLP home 
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#"
					}
				});
			}
		}
	});
});