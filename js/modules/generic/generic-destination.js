/**
 * File Name: generic-destination.js
 * Description: Generic screen module for destination page.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
* Copyright (c) 2018: Jaguar Land Rover
 * Authors: Deepika Basavaraju
 * Creation Date: 31 Jan 2018
 * Version : 1.0
 *
 * MODIFICATION RECORDS:
 **/

//Weather Generic Screen Destination Object
WT.Genericdest = {};

//Global Variables
WT.Genericdest.refreshInProgress = false;

var genericDestClass = function () {
    //Injecting generic location class
    var genLocObject = new genericLocClass();

    /**
     * Name: staticDataLocalisation
     * Description: Public method which shall take care of Static Data localisation in generic destination.
     * Parameters: None
     * Returns: None
     * Globals updated: None
     *
     */
    this.staticDataLocalisation = function () {
        genLocObject.staticDataLocalisation();
    };

    /**
     * Name: getConnectivitySettingsCallBack
     * Description: Private method which shall be called on connectivity settings call back in generic destination.
     *      User connectivity check
     *      connection status
     *      Error scenarios :
     *      User connectivity check - "Data Connection Disabled" on-screen messaging
     *      connection status - "Unable to Connect" on-screen messaging
     * Parameters:
     * @param {string} - connValue - dataEnabled / dataDisabled
     * Returns: None
     * Globals updated:
     * refreshInProgress
     *
     */
    var getConnectivitySettingsCallBack = function (connValue) {

        if ((typeof connValue === "string") && connValue === WT.Constant.connectionParam.USER_CONNECTION_ENABLE) {

            $("#genericRefIcon").addClass("rotate");
            $("#updateSpan").html(CI.Utils.Localization.translate("weat_Updating"));
            WT.Service.Afw.getConnectivityStatus(connectivityStatusCallBack);

        } else {
            //this check to prevent background updation and unneccessary havoc
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.GENERICDEST.screenName) {
                WT.Genericdest.refreshInProgress = false;
                $("#updateSpan").html(CI.Utils.Localization.translate("weat_Data_noconnect_disabled"));
            }
        }
    };

    /**
     * Name: getDestinationSuccess
     * Description: Private method which shall be called on connectivity settings call back in generic destination.
     *      Routing - Destination page
     *      Start auto update timer
     * Parameters: None
     * Returns: None
     * Globals updated:
     * refreshInProgress
     *
     */
    var getDestinationSuccess = function () {
        //Success Call Back
        //this check to prevent background updation and unneccessary havoc
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.GENERICDEST.screenName && $("#genericRefIcon").hasClass("rotate")) {
            WT.Genericdest.refreshInProgress = false;
            $("#genericRefIcon").removeClass("rotate");

            if (WT.Route.getCurrentScreen() === WT.Constant.Route.GENERICDEST.screenName) {
                WT.Route.location(WT.Constant.Route.DESTINATION.screenName);
            }
            WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "genericRefIcon");
        }
    };

    /**
     * Name: getDestinationError
     * Description: Private method which shall be called on connectivity settings success call back
     *      in generic destination.
     *      connection status - "Unable to Connect" on-screen messaging
     *      Start auto update timer
     * Parameters: None
     * Returns: None
     * Globals updated:
     * refreshInProgress
     */
    var getDestinationError = function () {

        //Error Call Back
        //this check to prevent background updation and unneccessary havoc
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.GENERICDEST.screenName && $("#genericRefIcon").hasClass("rotate")) {

            WT.Genericdest.refreshInProgress = false;
            $("#genericRefIcon").removeClass("rotate");
            $("#updateSpan").html(CI.Utils.Localization.translate("weat_Unable_connect"));
            WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "genericRefIcon");

        }
    };

    /**
     * Name: getDestinationError
     * Description: Private method which shall be called on connectivity settings error call back in generic destination.
     *      connection status - "Unable to Connect" on-screen messaging
     *      Refresh icon animation
     * Parameters:
     * @param {string} - connStatus - connectionAvailable / noConnection
     * Returns: None
     * Globals updated:
     * refreshInProgress
     *
     */
    var connectivityStatusCallBack = function (connStatus) {

        if ((typeof connStatus === "string") && (connStatus === WT.Constant.connectionParam.CONNECTION_AVAILABLE)) {

            WT.Global.getDestination(WT.Constant.Api.LOC_RETRY_COUNTER, getDestinationSuccess, getDestinationError);

        } else {

            //this check to prevent background updation and unneccessary havoc
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.GENERICDEST.screenName && $("#genericRefIcon").hasClass("rotate")) {
                //subscribe Connectivity
                WT.Service.Afw.subscribeConnectivityStatus(function () {
                    //$("#genericRefIcon").trigger("click");
                    $("#genericRefIcon").trigger("mousedown");
                    $("#genericRefIcon").trigger("mouseup");
                    WT.Service.Afw.unSubscribeConnectivityStatus(function () {
                    });
                }, function () {
                    //Do nothing as of now
                });

                WT.Genericdest.refreshInProgress = false;
                $("#genericRefIcon").removeClass("rotate");
                $("#updateSpan").html(CI.Utils.Localization.translate("weat_Unable_connect"));
            }
        }
    };
    /**
     * Name: manualUpdate
     * Description: Public method which shall be called on manualUpdate in generic destination.
     *      User connectivity check
     *      connection status
     *      offboard call
     *      Error scenarios :
     *      User connectivity check - "Data Connection Disabled" on-screen messaging
     *      connection status - "Unable to Connect" on-screen messaging
     *      offboard call - "Unable to Connect" on-screen messaging
     * Parameters: None
     * Returns: None
     * Globals updated: None
     *
     */
    this.manualUpdate = function () {
        WT.Global.logger("GenericLoc::refreshIconClick", CI.Utils.Define.LOGSeverity.TRACE);
        //If off-board call not in progress
        if (!WT.Genericdest.refreshInProgress) {
            WT.Genericdest.refreshInProgress = true;
            WT.Service.Afw.sidePanelTriggerEvent();
            WT.Service.Afw.getUserConnectivitySettings(getConnectivitySettingsCallBack);
        }

    };

    /**
     * Name: initialisation
     * Description: Public method which shall take care of initialization of generic Destination.
     * Parameters: None
     * Returns: None
     * Globals updated: None
     *
     */
    this.initialisation = function () {
        //check user connectivity,check connectivity
        WT.Genericdest.refreshInProgress = false;
        $("#genericRefIcon").removeClass("rotate");
        $("#generic-head").html(CI.Utils.Localization.translate("weat_View_live_weather"));
        this.staticDataLocalisation();
        this.manualUpdate();
    };
};


