/*
 * File Name: generic-location.js
 * Description: routing to each screen is WT app is handled in this module.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Sreejith P
 * Creation Date: 16 January, 2018
 *
 * MODIFICATION RECORDS:
 */


/*
 * Name: WT.Genericloc
 * Description:  @namespace
 *               Javascript WT.Genericloc object, which is used for initialization of generic current location
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */

WT.Genericloc = {};

//Global variable to check whether refresh is in Progress
WT.Genericloc.refreshInProgress = false;

var genericLocClass = function () {

    /*
     * Name: WT.Genericloc.staticDataLocalisation
     * Description: Public method which shall take care of localisation and binding to view
     *
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */

    this.staticDataLocalisation = function () {
        $("#generic-head").html(CI.Utils.Localization.translate("weat_View_live_weather"));
        $("#updateSpan").html(CI.Utils.Localization.translate("weat_Updating"));

    };

    /*
     * Name: validationSuccCallBck
     * Description: Validation Success Call back route to Mylocation
     *
     * Parameters:
     * @param : {object} : offboard object from Appc
     * Returns: None
     * Globals updated:
     * WT.Genericloc.refreshInProgress
     * Local Storage Variables updated:
     * WT-CURRENTWTDETAILS
     */

    var validationSuccCallBck = function (locDetails) {

        WT.Global.logger("GenericLoc::validateData" + JSON.stringify(locDetails), CI.Utils.Define.LOGSeverity.TRACE);
        localStorage.setItem(WT.Constant.localStorage.CURRENT_WT_DETAILS, JSON.stringify(locDetails));
        // TODO getDestination

        if (WT.Route.getCurrentScreen() === WT.Constant.Route.GENERICLOC.screenName) {
            WT.Genericloc.refreshInProgress = false;
            $("#genericRefIcon").removeClass("rotate");
            WT.Route.location(WT.Constant.Route.CURRLOC.screenName);
        }
    };

    /*
     * Name: validationErrCallBck
     * Description: Validation error Call back show unable to connect
     *
     * Parameters:
     * @param : {object} : object after error validation
     * Returns: None
     * Globals updated: None
     */

    var validationErrCallBck = function (errorCallBck) {
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.GENERICLOC.screenName) {
            WT.Global.logger("GenericLoc::invalidLoc", CI.Utils.Define.LOGSeverity.TRACE);
            WT.Genericloc.refreshInProgress = false;
            $("#genericRefIcon").removeClass("rotate");
            $("#updateSpan").html(CI.Utils.Localization.translate("weat_Unable_connect"));
            WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "genericRefIcon");
        }
    };

    /*
     * Name: offBoardSuccCallBck
     * Description: Off Board success Call back validate received data
     *
     * Parameters:
     * @param : {object} : offboard object from Appc
     * Returns: None
     * Globals updated: None
     */

    var offBoardSuccCallBck = function (succResponse) {
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.GENERICLOC.screenName && $("#genericRefIcon").hasClass("rotate")) {
            WT.Global.logger("GenericLoc::getLocationData" + JSON.stringify(succResponse), CI.Utils.Define.LOGSeverity.TRACE);
            WT.Global.validateResponseData(succResponse, validationSuccCallBck,
                    validationErrCallBck);
        }
    };

    /*
     * Name: offBoardSuccCallBck
     * Description: Off Board error Call back show unable to connect and start auto update
     *
     * Parameters:
     * @param : {object} : offboard object from Appc
     * Returns: None
     * Globals updated: None
     */

    var offBoardErrCallBck = function (errResponse) {
        //this check to prevent background updation and unneccessary havoc
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.GENERICLOC.screenName && $("#genericRefIcon").hasClass("rotate")) {
            WT.Genericloc.refreshInProgress = false;
            $("#genericRefIcon").removeClass("rotate");
            $("#updateSpan").html(CI.Utils.Localization.translate("weat_Unable_connect"));
            WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "genericRefIcon");
        }
    };

    /*
     * Name: getCurrentLocSuccCall
     * Description: Current location Success Call back do off board call
     *
     * Parameters:
     * @param : {object} : curent location object from framework
     * Returns: None
     * Globals updated: None
     */

    var getCurrentLocSuccCall = function (locationData) {
        WT.Global.logger("GenericLoc::getCurrentLocation" + JSON.stringify(locationData), CI.Utils.Define.LOGSeverity.TRACE);
        //offboard call if three retry failure start auto update timer
        WT.Service.Api.getLocationWTData({latitude: locationData.latitude, longitude: locationData.longitude,
            retries: WT.Constant.Api.LOC_RETRY_COUNTER}, offBoardSuccCallBck,
                offBoardErrCallBck);
    };

    /*
     * Name: getCurrentLocErrCall
     * Description: Current location error Call back show unable to connect and start auto update
     *
     * Parameters:
     * @param : {object} : curent location object from framework
     * Returns: None
     * Globals updated: None
     */

    var getCurrentLocErrCall = function () {
        //this check to prevent background updation and unneccessary havoc
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.GENERICLOC.screenName && $("#genericRefIcon").hasClass("rotate")) {
            WT.Genericloc.refreshInProgress = false;
            $("#genericRefIcon").removeClass("rotate");
            $("#updateSpan").html(CI.Utils.Localization.translate("weat_Cur_loc_not_avail"));
            WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "genericRefIcon");
        }
    };

    /*
     * Name: connectivityCallBack
     * Description: Connectivity suceess call back fetch getCurrentLocSuccCall
     *              else subscribe connectivity and show unable to connect
     *
     * Parameters:
     * @param : {string} : connectionAvailable/connectionNotAvailable
     * Returns: None
     * Globals updated: None
     */

    var connectivityCallBack = function (connStatus) {
        if ((typeof connStatus === "string") && (connStatus === WT.Constant.connectionParam.CONNECTION_AVAILABLE)) {
            WT.Service.Afw.getCurrentLocation(getCurrentLocSuccCall, getCurrentLocErrCall);
        } else {
            //this check to prevent background updation and unneccessary havoc
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.GENERICLOC.screenName && $("#genericRefIcon").hasClass("rotate")) {
                //subscribe Connectivity
                WT.Service.Afw.subscribeConnectivityStatus(function () {
                    //$("#genericRefIcon").trigger("click");
                    $("#genericRefIcon").trigger("mousedown");
                    $("#genericRefIcon").trigger("mouseup");
                    WT.Service.Afw.unSubscribeConnectivityStatus(function () {
                    });
                }, function () {
                });
                WT.Genericloc.refreshInProgress = false;
                $("#genericRefIcon").removeClass("rotate");
                $("#updateSpan").html(CI.Utils.Localization.translate("weat_Unable_connect"));
            }
        }

    };

    /*
     * Name: userConnectivityCallBack
     * Description: User connectivity call back fetch connectivity status
     *              else show data connection disabled
     *
     * Parameters:
     * @param : {string} : dataenabled/datadisabled
     * Returns: None
     * Globals updated: None
     */

    var userConnectivityCallBack = function (connValue) {
        if ((typeof connValue === "string") && connValue === WT.Constant.connectionParam.USER_CONNECTION_ENABLE) {
            $("#genericRefIcon").addClass("rotate");
            $("#updateSpan").html(CI.Utils.Localization.translate("weat_Updating"));
            WT.Service.Afw.getConnectivityStatus(connectivityCallBack);
        } else {
            //this check to prevent background updation and unneccessary havoc
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.GENERICLOC.screenName) {
                WT.Genericloc.refreshInProgress = false;
                $("#updateSpan").html(CI.Utils.Localization.translate("weat_Data_noconnect_disabled"));
            }
        }
    };

    /*
     * Name: Genericloc.refreshIconClick
     * Description: refreshIconClick triggered on manual or auto update
     *
     * Parameters:
     * @param : {object} : object after error validation
     * Returns: None
     * Globals updated: None
     */

    this.refreshIconClick = function () {
        WT.Global.logger("GenericLoc::refreshIconClick", CI.Utils.Define.LOGSeverity.TRACE);
        //call user connectivty
        if (!WT.Genericloc.refreshInProgress) {
            WT.Genericloc.refreshInProgress = true;
            WT.Service.Afw.sidePanelTriggerEvent();
            WT.Service.Afw.getUserConnectivitySettings(userConnectivityCallBack);
        }
    };
    /*
     * Name: WT.Genericloc.initialisation
     * Description: Public method which shall be called on initialisation of the generic screen.
     *              Summary :
     *		           Should contain default configuartion on launch
     *                 Static data localisation and binding to view
     *		           call the refresh icon click functionality(updation functionality)
     *
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */

    this.initialisation = function () {
        WT.Genericloc.refreshInProgress = false;
        $("#genericRefIcon").removeClass("rotate");
          $("#generic-head").html(CI.Utils.Localization.translate("weat_View_live_weather"));
        this.staticDataLocalisation();
        this.refreshIconClick();
    };
};

