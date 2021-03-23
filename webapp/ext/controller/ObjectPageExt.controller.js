sap.ui.define([
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/MessageStrip",
	"sap/ui/model/json/JSONModel"
], function (Fragment, MessageBox, MessageToast, MessageStrip, JSONModel) {
	"use strict";

	return sap.ui.controller("com.evonik.mdm.vendor.cbv.bankdetails.ext.controller.ObjectPageExt", {

		HelpLinks: {
			Guideline: "",
			Help: "",
			Bank: ""
		},

		onInit: function (oEvent) {
			var oViewModel = new JSONModel();
			this.getView().setModel(oViewModel, "local");

			this.extensionAPI.attachPageDataLoaded(this.handlePageDataLoaded.bind(this));
			this.fetchHelpLinks();
		},

		handlePageDataLoaded: function (oEvent) {
			this.getOwnerComponent().getEventBus().publish("ObjectPage", "vendorChanged", {
				VendorDetailsPath: oEvent.context.sPath
			});
		},

		fetchHelpLinks: function () {
			this.getOwnerComponent().getModel().read("/ZI_HELP_LINKS", {
				success: function (mResponse) {
					mResponse.results.forEach(function (mHelpLinkDetails) {
						if (mHelpLinkDetails.doc_type === "BNK_GUIDL") {
							this.HelpLinks.Guideline = mHelpLinkDetails.help_link_1;
						} else if (mHelpLinkDetails.doc_type === "BNK_HELP") {
							this.HelpLinks.Help = mHelpLinkDetails.help_link_1;
						} else if (mHelpLinkDetails.doc_type === "BANK_REQU") {
							this.HelpLinks.Bank = mHelpLinkDetails.help_link_1;
						}
					}.bind(this));
				}.bind(this)
			});
		},

		handleGuidelineButtonPress: function () {
			window.open(this.HelpLinks.Guideline, "_blank");
		},

		handleHelpButtonPress: function () {
			window.open(this.HelpLinks.Help, "_blank");
		},

		handleBankButtonPress: function () {
			window.open(this.HelpLinks.Bank, "_blank");
		},

		onAfterRendering: function (oEvent) {

			/*		var oList = oEvent.getSource(),
					bSelected = oEvent.getParameter("selected");*
			/*
						this.extensionAPI.getTransactionController().attachAfterActivate(this.onAfterActivate.bind(this));
						this.extensionAPI.getTransactionController().attachAfterSave(function (oEvent) {
						var oPromise = oEvent.activationPromise;
					 	oPromise.then(function (aResponse) {
						MessageToast.show("");

						 	});

						 });*/

			//Get SmartFilterBar
			/*		var oGlobalFilter = this.getView().byId("com.evonik.mdm.vendor.cbv.bankdetails::sap.suite.ui.generic.template.ListReport.view.ListReport::ZC_VendorDetails--listReportFilter-filterItem-___INTERNAL_-lifnr");

					//Create JSON data that contains the Inital value of the filter
					//"company_code" is the name of the filter field. You should put your own field ID.
					var oDefaultFilter = {
						"Kreditor": "11111"
					};

					//Set SmartFilterBar initial values
					oGlobalFilter.setFilterData(oDefaultFilter);*/

		},

		onDialog: function (oEvent) {

		},

		// onActionDelete: function (oEvent) {
		// 	var oDataModel = this.getView().getModel();
		// 	var aItems = oEvent.getSource().getParent().getParent().getSelectedItems();

		// 	for (var i = 0; i < aItems.length; i++) {
		// 		var sPath = aItems[i].getBindingContext().getPath();
		// 		oDataModel.remove(sPath, {
		// 			success: jQuery.proxy(this._handlePostSuccess, this),
		// 			error: jQuery.proxy(this._handleOdataError, this)
		// 		});

		// 	};
		// },

		/*
		 * Vendor Bank Detail Table Deletion
		 * @param oEvent
		 */
		onPressActionDelete: function (oEvent) {
			var sSelectedPath = oEvent.getSource().getParent().getParent().getSelectedItem().getBindingContext().getPath();

			MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("Message.DeleteBankWarning"), {
				actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.DELETE,
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.DELETE) {
						this.getView().setBusy(true);
						this.getView().getModel().remove(sSelectedPath, {
							success: function () {
								this.getView().setBusy(false);
								MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("Message.BankDeleteSuccess"));
								this.getOwnerComponent().getModel().refresh();
							}.bind(this),
							error: this._handleOdataError
						}, this);
					}
				}.bind(this)
			});
		},

		onActionAdd: function (oEvent) {
			this.getView().getModel("local").setProperty("/newBank", null);

			var oResBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oAddModel = new sap.ui.model.json.JSONModel([]);
			oAddModel.setData(this._getInitFrontend());
			if (!this._oDialog) {
				Fragment.load({
					name: "com.evonik.mdm.vendor.cbv.bankdetails.ext.fragment.SaveAction",
					controller: this
				}).then(function (oDialog) {
					this._oDialog = oDialog;
					this.getView().addDependent(this._oDialog);
					//this._oDialog.getBinding('items').filter(oFilters);
					this._oDialog.open();
				}.bind(this));
			} else {
				//this._oDialog.getBinding('items').filter(oFilters);
				this._oDialog.open();
			}

			sap.ui.getCore().byId("idSaveBankGreen").setVisible(false);
			sap.ui.getCore().byId("idSaveBankRed").setVisible(false);
			sap.ui.getCore().byId("idSaveBankCBV").setVisible(false);
			sap.ui.getCore().byId("idSaveBankSPEND").setVisible(false);
			sap.ui.getCore().byId("idSaveBankYellow").setVisible(false);

			sap.ui.getCore().byId("AttachmentLabel").setVisible(false);
			sap.ui.getCore().byId("fileUploader").setVisible(false);
			sap.ui.getCore().byId("buttonUploader").setVisible(false);

		},
		onCancelBank: function (oEvent) {

			this.getOwnerComponent().getModel().refresh();
			this._oDialog.close();
		},
		dialogAfterclose: function () {
			if (this._oDialog) {
				// sap.ui.getCore().byId("idAddressGroup").setVisible(false);
				this._oDialog.getModel().resetChanges();
				this._oDialog.destroy();
				this.getOwnerComponent().getModel().refresh();
				this._oDialog = null; // make it falsy so that it can be created next time
			}
		},
		onSaveBank: function (oEvent) {
			this.oGlobalBusyDialog = new sap.m.BusyDialog();
			this.oGlobalBusyDialog.open();

			sap.ui.getCore().byId("VboxContent").removeAllItems();

			var oSmartForm = sap.ui.getCore().byId("idCreateForm");
			var aFields = oSmartForm.getSmartFields();
			var bValidated = false;
			var that = this;
			var bNewBank = this.getView().getModel("local").getProperty("/newBank");
			aFields.forEach(function (Field) {
				if (typeof Field.getValue === "function" && Field.getMandatory()) {
					if (!Field.getValue() || Field.getValue().length < 1 || Field.getValue() <= 0) {
						Field.setValueState("Error");
					} else {
						Field.setValueState("None");
					}
				}
			});
			bValidated = aFields.every(function (Field) {
				return Field.getValueState() === "None";
			});
			if (bValidated) {
				var oPayload = {};
				oPayload.lifnr = this.getView().getBindingContext().getObject().lifnr;
				oPayload.banks = sap.ui.getCore().byId("idBankCountry").getValue();
				oPayload.bankl = sap.ui.getCore().byId("idBankKey").getValue();
				oPayload.bankn = sap.ui.getCore().byId("idBankAcc").getValue();
				oPayload.iban = sap.ui.getCore().byId("idIBAN").getValue();
				oPayload.bvtyp = sap.ui.getCore().byId("idBankTyp").getValue();
				oPayload.bkont = sap.ui.getCore().byId("idContrKey").getValue();
				oPayload.bkref = sap.ui.getCore().byId("idRef").getValue();
				oPayload.koinh = sap.ui.getCore().byId("idAccHold").getValue();
				oPayload.xezer = sap.ui.getCore().byId("idDebAuth").getValue();
				if (bNewBank) {
					oPayload.newBank = bNewBank;
				}

				this.getView().getModel().create("/ZC_BankDetails", oPayload, {
					success: jQuery.proxy(this._handlePostSuccess, this),
					error: jQuery.proxy(this._handleOdataError, this)
				});
			} else {
				that.oGlobalBusyDialog.close();
			}

		},

		onSaveBankCBV: function (oEvent) {
			this.getView().getModel("local").setProperty("/newBank", "C");

			sap.ui.getCore().byId("VboxContent").removeAllItems();

			this.onSaveBank();
			/*					 		 var oStrip3 = new MessageStrip({
										text: "SAVED with CBV Process",
										showCloseButton: false,
										showIcon: true,
										type: "Success"
									});
									oStrip3.addStyleClass("sapUiSmallMarginTopBottom");
									sap.ui.getCore().byId("VboxContent").addItem(oStrip3);
									*/

			sap.ui.getCore().byId("idSaveBankSPEND").setVisible(false);
			sap.ui.getCore().byId("idSaveBankCBV").setVisible(false);
			sap.ui.getCore().byId("idCreateSave").setVisible(false);
			sap.ui.getCore().byId("idCreateCancel").setType("Accept");
			sap.ui.getCore().byId("idCreateCancel").setText("OK");

		},

		saveBankGreen: function (oEvent) {
			sap.ui.getCore().byId("VboxContent").removeAllItems();

			var oStrip3 = new MessageStrip({
				text: "BANK SAVED",
				showCloseButton: false,
				showIcon: true,
				type: "Success"
			});
			oStrip3.addStyleClass("sapUiSmallMarginTopBottom");
			sap.ui.getCore().byId("VboxContent").addItem(oStrip3);
			sap.ui.getCore().byId("idSaveBankGreen").setVisible(false);
			sap.ui.getCore().byId("idCreateSave").setVisible(false);
			sap.ui.getCore().byId("idCreateCancel").setType("Accept");

			sap.ui.getCore().byId("idCreateCancel").setText("OK");

		},

		saveBankYellow: function (oEvent) {
			sap.ui.getCore().byId("VboxContent").removeAllItems();

			this.onSaveBank();

			var oStrip3 = new MessageStrip({
				text: "BANK SAVED",
				showCloseButton: false,
				showIcon: true,
				type: "Success"
			});
			oStrip3.addStyleClass("sapUiSmallMarginTopBottom");
			sap.ui.getCore().byId("VboxContent").addItem(oStrip3);

			sap.ui.getCore().byId("idSaveBankYellow").setVisible(false);

			//	sap.ui.getCore().byId("idCreateCancel").setType("Accept");
			//	sap.ui.getCore().byId("idCreateCancel").setText("OK");

			sap.ui.getCore().byId("idCreateSave").setVisible(false);
			sap.ui.getCore().byId("idCreateCancel").setType("Accept");
			sap.ui.getCore().byId("idCreateCancel").setText("OK");

		},

		saveBankRed: function (oEvent) {
			sap.ui.getCore().byId("VboxContent").removeAllItems();

			var oStrip3 = new MessageStrip({
				text: "BANK SAVED",
				showCloseButton: false,
				showIcon: true,
				type: "Success"
			});
			oStrip3.addStyleClass("sapUiSmallMarginTopBottom");
			sap.ui.getCore().byId("VboxContent").addItem(oStrip3);

			sap.ui.getCore().byId("idCreateSave").setVisible(false);

			sap.ui.getCore().byId("idSaveBankRed").setVisible(false);
			sap.ui.getCore().byId("idCreateCancel").setType("Accept");

			sap.ui.getCore().byId("idCreateCancel").setText("OK");

		},

		onSaveBankSPEND: function (oEvent) {
			this.getView().getModel("local").setProperty("/newBank", "S");
			this.onSaveBank();

			sap.ui.getCore().byId("VboxContent").removeAllItems();

			/*	 		 var oStrip3 = new MessageStrip({
						text: "SAVED as SPEND",
						showCloseButton: false,
						showIcon: true,
						type: "Success"
					});
					oStrip3.addStyleClass("sapUiSmallMarginTopBottom");
					sap.ui.getCore().byId("VboxContent").addItem(oStrip3);*/

			sap.ui.getCore().byId("idSaveBankCBV").setVisible(false);
			sap.ui.getCore().byId("idSaveBankSPEND").setVisible(false);

			sap.ui.getCore().byId("idSaveBankGreen").setVisible(false);
			sap.ui.getCore().byId("idSaveBankRed").setVisible(false);

			sap.ui.getCore().byId("idCreateSave").setVisible(false);

			sap.ui.getCore().byId("idCreateCancel").setVisible(true);
			sap.ui.getCore().byId("idCreateCancel").setType("Accept");
			sap.ui.getCore().byId("idCreateCancel").setText("OK");

		},

		//@function call back on successfull post request
		_handlePostSuccess: function (oData, oResponse) {
			if (this.oGlobalBusyDialog) {
				this.oGlobalBusyDialog.close();
			}
			var that = this,
				oHeader = oResponse.headers["sap-message"],
				oResBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			if (oHeader) {
				var oJson = JSON.parse(oHeader);
				switch (oJson.code) {
				case "ZMD_CBV/004": //Warning - blue

					if (!this.getView().getModel("local").getProperty("/newBank", "S") && !this.getView().getModel("local").getProperty("/newBank",
							"C")) {
						sap.ui.getCore().byId("idSaveBankCBV").setVisible(true);
						sap.ui.getCore().byId("idCreateSave").setVisible(false);
						sap.ui.getCore().byId("idSaveBankCBV").setText("SAVE with CBV Process");
						sap.ui.getCore().byId("idSaveBankSPEND").setVisible(true);
						sap.ui.getCore().byId("idSaveBankSPEND").setText("SAVE as SPEND");
						sap.ui.getCore().byId("idCreateCancel").setText("CANCEL");

						var oStrip2 = new MessageStrip({
							text: oJson.message,
							showCloseButton: false,
							showIcon: true,
							type: "Warning"
						});
						oStrip2.addStyleClass("sapUiSmallMarginBottom");
						sap.ui.getCore().byId("VboxContent").addItem(oStrip2);

						for (var i in oJson.details) {
							var oStrip = new MessageStrip({
								text: oJson.details[i].message,
								showCloseButton: false,
								showIcon: true,
								type: "Warning"
							});
							oStrip.addStyleClass("sapUiSmallMarginTop");
							sap.ui.getCore().byId("VboxContent").addItem(oStrip);
						}

					} else {

					}
					break;
				case "ZMD_CBV/005": //error

					var oStrip2 = new MessageStrip({
						text: oJson.message,
						showCloseButton: false,
						showIcon: true,
						type: "Error"
					});

					oStrip2.addStyleClass("sapUiSmallMarginBottom");
					sap.ui.getCore().byId("VboxContent").addItem(oStrip2);

					for (var j in oJson.details) {
						var oStrip = new MessageStrip({
							text: oJson.details[j].message,
							showCloseButton: false,
							showIcon: true,
							type: "Error"
						});
						oStrip.addStyleClass("sapUiSmallMarginTop");
						sap.ui.getCore().byId("VboxContent").addItem(oStrip);
					}
					sap.ui.getCore().byId("idCreateSave").setVisible(false);
					sap.ui.getCore().byId("idSaveBankRed").setVisible(false);
					sap.ui.getCore().byId("idSaveBankRed").setText("SAVE");
					sap.ui.getCore().byId("idCreateCancel").setText("CANCEL");

					break;

				case "ZMD_CBV/016": //error

					var oStrip2 = new MessageStrip({
						text: oJson.message,
						showCloseButton: false,
						showIcon: true,
						type: "Error"
					});

					oStrip2.addStyleClass("sapUiSmallMarginBottom");
					sap.ui.getCore().byId("VboxContent").addItem(oStrip2);

					for (var j in oJson.details) {
						var oStrip = new MessageStrip({
							text: oJson.details[j].message,
							showCloseButton: false,
							showIcon: true,
							type: "Error"
						});
						oStrip.addStyleClass("sapUiSmallMarginTop");
						sap.ui.getCore().byId("VboxContent").addItem(oStrip);
					}
					sap.ui.getCore().byId("idCreateSave").setVisible(false);
					sap.ui.getCore().byId("idSaveBankRed").setVisible(false);
					sap.ui.getCore().byId("idSaveBankRed").setText("SAVE");
					sap.ui.getCore().byId("idCreateCancel").setText("CANCEL");

					break;

				case "ZMD_CBV/006": //Warning - orange

					if (!this.getView().getModel("local").getProperty("/newBank", "S") && !this.getView().getModel("local").getProperty("/newBank",
							"C")) {
						sap.ui.getCore().byId("idSaveBankCBV").setVisible(true);
						sap.ui.getCore().byId("idCreateSave").setVisible(false);
						sap.ui.getCore().byId("idSaveBankCBV").setText("SAVE with CBV Process");
						sap.ui.getCore().byId("idSaveBankSPEND").setVisible(true);
						sap.ui.getCore().byId("idSaveBankSPEND").setText("SAVE as SPEND");
						sap.ui.getCore().byId("idCreateCancel").setText("CANCEL");

						var oStrip2 = new MessageStrip({
							text: oJson.message,
							showCloseButton: false,
							showIcon: true,
							type: "Warning"
						});
						oStrip2.addStyleClass("sapUiSmallMarginBottom");
						sap.ui.getCore().byId("VboxContent").addItem(oStrip2);

						for (var i in oJson.details) {
							var oStrip = new MessageStrip({
								text: oJson.details[i].message,
								showCloseButton: false,
								showIcon: true,
								type: "Warning"
							});
							oStrip.addStyleClass("sapUiSmallMarginTop");
							sap.ui.getCore().byId("VboxContent").addItem(oStrip);
						}
					} else {

					}
					break;
				case "ZMD_CBV/007":

					if (!this.getView().getModel("local").getProperty("/newBank", "X")) {
						//success
						var oStrip2 = new MessageStrip({
							text: oJson.message,
							showCloseButton: false,
							showIcon: true,
							type: "Success"
						});

						oStrip2.addStyleClass("sapUiSmallMarginBottom");
						sap.ui.getCore().byId("VboxContent").addItem(oStrip2);

						sap.ui.getCore().byId("idCreateSave").setVisible(false);
						sap.ui.getCore().byId("idSaveBankGreen").setVisible(true);
						sap.ui.getCore().byId("idSaveBankGreen").setText("SAVE BANK");
						sap.ui.getCore().byId("idCreateCancel").setText("CANCEL");
					} else {
						var oStrip3 = new MessageStrip({
							text: "BANK SAVED",
							showCloseButton: false,
							showIcon: true,
							type: "Success"
						});
						oStrip3.addStyleClass("sapUiSmallMarginTopBottom");
						sap.ui.getCore().byId("VboxContent").addItem(oStrip3);

						sap.ui.getCore().byId("idSaveBankYellow").setVisible(false);
						sap.ui.getCore().byId("idCreateSave").setVisible(false);

						sap.ui.getCore().byId("idCreateCancel").setType("Accept");
						sap.ui.getCore().byId("idCreateCancel").setText("OK");

					}

					break;

				case "ZMD_CBV/008": //yellow

					if (!this.getView().getModel("local").getProperty("/newBank", "X")) {
						var oStrip2 = new MessageStrip({
							text: oJson.message,
							showCloseButton: false,
							showIcon: true,
							type: "Success"
						});
						oStrip2.addStyleClass("sapUiSmallMarginBottom");
						sap.ui.getCore().byId("VboxContent").addItem(oStrip2);

						for (var i in oJson.details) {
							oStrip = new MessageStrip({
								text: oJson.details[i].message,
								showCloseButton: false,
								showIcon: true,
								type: "Success"
							});
							oStrip.addStyleClass("sapUiSmallMarginTop");
							sap.ui.getCore().byId("VboxContent").addItem(oStrip);

						}

						this.getView().getModel("local").setProperty("/newBank", "X");

						sap.ui.getCore().byId("idCreateSave").setVisible(true);
						sap.ui.getCore().byId("idCreateSave").setText("SAVE BANK");

						sap.ui.getCore().byId("idSaveBankYellow").setVisible(false);
						/*	sap.ui.getCore().byId("idSaveBankYellow").setText("SAVE BANK");*/
						sap.ui.getCore().byId("idCreateCancel").setText("CANCEL");

					} else {

						/*		sap.ui.getCore().byId("idCreateSave").setVisible(false);
						        sap.ui.getCore().byId("idCreateCancel").setType("Accept");
							    sap.ui.getCore().byId("idCreateCancel").setText("OK");*/
					}
					break;

				case "ZMD_CBV/012": //yellow

					var oStrip2 = new MessageStrip({
						text: oJson.message,
						showCloseButton: false,
						showIcon: true,
						type: "Warning"
					});

					oStrip2.addStyleClass("sapUiSmallMarginBottom");
					sap.ui.getCore().byId("VboxContent").addItem(oStrip2);

					for (var i in oJson.details) {
						oStrip = new MessageStrip({
							text: oJson.details[i].message,
							showCloseButton: false,
							showIcon: true,
							type: "Warning"
						});
						oStrip.addStyleClass("sapUiSmallMarginTop");
						sap.ui.getCore().byId("VboxContent").addItem(oStrip);
					}

					sap.ui.getCore().byId("idCreateSave").setVisible(false);
					sap.ui.getCore().byId("idCreateSave").setText("SAVE BANK");

					sap.ui.getCore().byId("idSaveBankYellow").setVisible(false);

					sap.ui.getCore().byId("idCreateCancel").setType("Accept");
					sap.ui.getCore().byId("idCreateCancel").setText("OK");

					break;

				}

			}

			//	this._oDialog.close();
			this.getOwnerComponent().getModel().refresh();
			//	
		},

		_handleUpdateSuccess: function (oResponse, oData) {
			MessageBox.success("success");
		},
		_handleUpdatError: function (oResponse, oData) {
			MessageBox.error("error");
		},

		//@function private method for handling oData errors from backend.
		_handleOdataError: function (oError, oThis) {
			this.getView().setBusy(false);
			if (!oThis) {
				oThis = this;
			}
			if (oThis.oGlobalBusyDialog) {
				oThis.oGlobalBusyDialog.close();
			}
			if (oError.responseText) {
				var oErrorResponse = JSON.parse(oError.responseText);
				sap.m.MessageBox.error(oErrorResponse.error.message.value, {
					title: oError.message
				});
			} else {
				sap.m.MessageBox.error(oError.statusText, {
					title: oError.message
				});
			}
		},

		onClickActionZC_VendorDetailsHeader1: function (oEvent) {

			this.oButton = oEvent.getSource();
			var that = this;
			var oList = new sap.m.List({
				mode: sap.m.ListMode.None
			});
			var oItem = new sap.m.CustomListItem({
				content: [
					new sap.m.Link({
						text: "{doc_type}",
						target: "_blank",
						href: "{help_link_1}"
					})
				]
			});
			oList.bindItems({
				path: "/ZI_HELP_LINKS",
				template: oItem
			});
			if (!this._oPopover) {
				Fragment.load({
					name: "com.evonik.mdm.vendor.cbv.bankdetails.ext.fragment.Popover",
					controller: this
				}).then(function (oPopover) {
					this._oPopover = oPopover;
					this.getView().addDependent(this._oPopover);
					oList.addStyleClass("sapUiTinyMargin");
					sap.ui.getCore().byId("VboxContent2").addItem(oList);
					//	this._oPopover.addContent(oList);
					//this._oPopover.bindElement("/ZI_HELP_LINKS");
					this._oPopover.openBy(that.oButton);
				}.bind(this));
			} else {
				this._oPopover.openBy(that.oButton);
			}
		},

		onHelpPress: function (oEvent) {

			this.oButton = oEvent.getSource();
			var that = this;
			var oList = new sap.m.List({
				mode: sap.m.ListMode.None
			});
			var oItem = new sap.m.CustomListItem({
				content: [

					new sap.m.Link({
						text: "{doc_type}",
						target: "_blank",
						href: "{help_link_1}"
					})
				]
			});
			var oFilters = new sap.ui.model.Filter("doc_type", sap.ui.model.FilterOperator.EQ, "BNK_HELP");

			oList.bindItems({
				path: "/ZI_HELP_LINKS",
				template: oItem,
				//	filters: { path : 'doc_type', operator : 'Contains', value1 : 'BNK_HELP'}
				filters: oFilters

			});

			if (!this._oPopover) {
				Fragment.load({
					name: "com.evonik.mdm.vendor.cbv.bankdetails.ext.fragment.Popover",
					controller: this
				}).then(function (oPopover) {
					this._oPopover = oPopover;
					this.getView().addDependent(this._oPopover);
					oList.addStyleClass("sapUiTinyMargin");
					this._oPopover.bindElement("/ZI_HELP_LINKS");
					sap.ui.getCore().byId("VboxContent2").addItem(oList);
					this._oPopover.openBy(that.oButton);
				}.bind(this));
			} else {
				this._oPopover.openBy(that.oButton);
			}
		},

		onExit: function (oEvent) {
			this._oPopover.close();
		},

		_handleReadSuccess: function (oResponse, oData) {
			//	var that = this;
			//	var oButton = this.byId(this.oButton);

			//	MessageBox.show(oEvent.results[0].doc_type);    

		},

		_handleReadError: function () {
			MessageBox.error("error");

		},

		_getInitFrontend: function () {
			var sLifnr = this.getView().getBindingContext().getObject().lifnr;
			var oInitFrontend = {
				lifnr: sLifnr,
				koinh: "",
				ebpp_accname: "",
				ebpp_bvstatus: "",
				kovon: new Date(),
				kobis: new Date(),
				valid_from: new Date(),
				ernam: "",
				erdat: new Date(),
				tabname: "",
				tabkey: "",
				banks: "",
				bankl: "",
				bankn: "",
				bkont: "",
				iban: "",
				bvtyp: "",
				xezer: true,
				bkref: ""
			};
			return oInitFrontend;
		},

		handleUploadComplete: function (oEvent) {
			var sResponse = oEvent.getParameter("response");
			if (sResponse) {
				var sMsg = "";
				var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
				if (m[1] == "200") {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
					oEvent.getSource().setValue("");
				} else {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
				}

				MessageToast.show(sMsg);
			}
		},

		handleUploadPress: function () {
			var oFileUploader = this.byId("fileUploader");
			oFileUploader.upload();
		}
	});
});