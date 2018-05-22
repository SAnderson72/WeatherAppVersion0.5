/*
 * File Name: settings.js
 * Description: Settings, legal information and legal information details handler.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Pratheesh VS
 * Creation Date: 30 January, 2018
 * Version : 1.0
 *
 * MODIFICATION RECORDS:
 */

WT.Settings = WT.Settings || {};

var settingsClass = function () {
    var legalInfoButtonEnable = true;

    /*
     * Name: updateLegalInfo
     * Description: Update legal information based on vehicle movement status:
     *               Continue button staus and Showing vehicle in motion message.
     * Parameters:
     * @param :
     * {number} : vehicle motion value 0/1
     * Returns: None
     * Globals updated: None
     */
    var updateLegalInfo = function (vehicleMotionValue) {
        if ((typeof vehicleMotionValue === "number")) {
            //Subscribe to vehicle in motion
            if (vehicleMotionValue === WT.Constant.vehicleStatus.MOTION) {
                //Disable continue button while in motion
                $("#view").addClass("in-motion");
                WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.VEHICLE_MOTION, WT.Constant.vehicleStatus.MOTION);
            } else {
                //Enable continue button in stationary
                $("#view").removeClass("in-motion");
                WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.VEHICLE_MOTION, WT.Constant.vehicleStatus.STATIONARY);
            }
        } else {
            //show default stationary page as motion value not a number
            WT.Global.logger("Settings::updateLegalInfo error in motion value", CI.Utils.Define.LOGSeverity.ERROR);
        }

    };

    /*
     * Name: settingsInitialisation
     * Description: translate the text shown in settings
     *              get vehicle movement status
     *              subscribe to vehicle motion
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated:
     */
    this.settingsInitialisation = function () {
        // show translated text here
        $("#legal span").html(CI.Utils.Localization.translate("weat_legal_info"));
        //Handle legal continue  button status
         WT.Service.Afw.getVehicleMotionStatus(function (motionValue) {
            updateLegalInfo(motionValue);
        }, function (errObj) {
            //errorcallback - show default stationary page
            WT.Global.logger("Settings::settingsInitialisation error from getVehicleMotionStatus", CI.Utils.Define.LOGSeverity.ERROR);
        });
         // subscribe to Vehicle Motion status
        WT.Service.Afw.subscribeVehicleMotion(function (motionValue) {
            updateLegalInfo(motionValue);
        }, function (errObj) {
            //errorcallback - show default stationary page
            WT.Global.logger("Settings::settingsInitialisation error from subscribeVehicleMotion", CI.Utils.Define.LOGSeverity.ERROR);
        });
        $("#legal").mousedown(function () {
            $(this).addClass("active");
            legalInfoButtonEnable = true;
        });

        $("#legal").mouseleave(function () {
            $(this).removeClass("active");
            legalInfoButtonEnable = false;
        });

        $("#legal").mouseup(function () {
            $(this).removeClass("active");
            // check vehicle motion here
            if (legalInfoButtonEnable === true)
            {
                //Redirect to legal information continue page              
                WT.Route.location(WT.Constant.Route.LEGALINFO.screenName);
            }
        });

    };


    /*
     * Name: legalInfoInitialisation
     * Description: Legal Information Introdunction page with 
     *              Continue button 
     * Parameters:
     * @param :
     * None
     * Returns:
     * None
     * Globals updated: None
     */

    this.legalInfoInitialisation = function () {
        WT.Global.logger("Settings::legalInfoInitialisation", CI.Utils.Define.LOGSeverity.INFO);
        $("#legalCont").html(CI.Utils.Localization.translate("weather_legal_text"));
        $("#continue").html(CI.Utils.Localization.translate("weat_continue"));
        updateLegalInfo(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.VEHICLE_MOTION));
        //Script to handle legal information continue button status
        $("#ContinueBtn").mousedown(function () {
            $(this).addClass("active");
            legalInfoButtonEnable = true;
        });

        $("#ContinueBtn").mouseleave(function () {
            $(this).removeClass("active");
            legalInfoButtonEnable = false;
        });

        $("#ContinueBtn").mouseup(function () {
            $(this).removeClass("active");
            //Mouse leave is false
            if (legalInfoButtonEnable === true)
            {
                //Redirect to legal detail page
                WT.Route.location(WT.Constant.Route.LEGALDETAILS.screenName); 
            }
        });
    };
    /*
     * Name: legalInfoInitialisation
     * Description: Legal Information Details page
     *              Scroll Integration
     * Parameters:
     * @param :  None
     * Returns: None
     * Globals updated: None
     */

    this.legalDetailInitialisation = function () {
        $("#vehicle-in-motion").html(CI.Utils.Localization.translate("weat_notice_msg"));
        updateLegalInfo(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.VEHICLE_MOTION));
        var legalScrollBar = new scrollBarClass();
        legalScrollBar.initialisation(".legal-information");
    };
};
