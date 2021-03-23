sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/UploadCollectionParameter",
	"sap/m/MessageToast"
], function (
	Controller,
	UploadCollectionParameter,
	MessageToast
) {
	"use strict";

	return Controller.extend("com.evonik.mdm.vendor.cbv.bankdetails.ext.controller.Attachments", {
		
		onInit: function () {
			this.getOwnerComponent().getEventBus().subscribe("ObjectPage", "vendorChanged", this.handleVendorChanged, this);
		},
		
		handleVendorChanged: function (sChannel, sEvent, mData) {
			var oUploadColleciton = this.byId("idUploadCollection");
			oUploadColleciton.setUploadUrl(this._getModel().sServiceUrl + mData.VendorDetailsPath + "/to_AttachList");			
		},

		handleUploadCollectionBeforeUploadStarts: function (oEvent) {
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

			var oModel = this.getView().getModel();
			oModel.refreshSecurityToken();

			var oHeaders = oModel.oHeaders;
			var sToken = oHeaders["x-csrf-token"];
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			});
			
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderToken);
		},
		
		handleUploadCollectionUploadComplete: function () {
			MessageToast.show(this._getText("Message.SuccessfullyUploaded"));
			this.byId("idUploadCollection").getBinding("items").refresh(true);
		},
		
		
		generateDownloadUrl: function (sLifnr, sFileId, sAttachType, sArcRepId, sArcDocType) {
			var sServiceUrl = this._getModel().sServiceUrl;
			var sUrl = sServiceUrl + this._getModel().createKey("/ZI_ATTACH_UNI", {
				Lifnr: sLifnr,
				FileID: sFileId,
				AttachType: sAttachType,
				ArcRepID: sArcRepId,
				ArcDocType: sArcDocType
			}) + "/$value";
			
			return sUrl;
		},
		
		_getText: function (sId) {
			return this._getModel("i18n").getResourceBundle().getText(sId);
		},
		
		_getModel: function (sModelName) {
			return this.getView().getModel(sModelName) || this.getOwnerComponent().getModel(sModelName);
		}

	});

});