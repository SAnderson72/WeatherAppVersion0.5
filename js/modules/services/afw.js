/*
 * File Name: afw.js
 * Description: Service module handles framework calls and off-board calls.
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Sreejith P
 * Creation Date: 11 January, 2018
  *
 * MODIFICATION RECORDS:
 */

/*
 * Name: WT.Service
 * Description: @namespace
 *              Javascript WT.Service object, which is used for initialization of services
 * Parameters:
 * @param :
 * None
 * Returns:
 * None
 * Globals updated:
 * None
 * Tables updated:
 * None
 */

WT.Service = WT.Service || {};

/*
 * Name: WT.Service.Afw
 * Description:@class
 *             Javascript WT.Service.Afw object, which is used for initialization of application framework
 * Parameters:
 * @param :
 * None
 * Returns:
 * None
 * Globals updated:
 * None
 * Tables updated:
 * None
 */

WT.Service.Afw = {};


//Global Variable
WT.Service.Afw.subscribeStatus = false;
WT.Service.Afw.vehicleSubscribeStatus = false;

/*
 * Name: WT.Service.Afw.getSystemConfiguration
 * Description:Public method which get system configuration for application.
 *             Summary :
 *                getCCFCIConfig from framework
 *                check for hand drive only (as it is only required for now in the application)
 * Parameters:
 * @param :
 * None
 * Returns:{function}
 * call back provides the whether the configuration is LHD/RHD
 * Globals updated:
 * None
 * Tables updated:
 * None
 */

WT.Service.Afw.getSystemConfiguration = function (callBack) {
    WT.Global.logger("Afw::getSystemConfiguration", CI.Utils.Define.LOGSeverity.TRACE);
    //Get current CCF configuration
    CI.Utils.DataStorage.getCCFCIConfig(function (data) {
        if (data && data.result && (typeof data.result['steering-wheel-position'] !== undefined) &&
                 (typeof data.result['steering-wheel-position'] === "number") && (typeof (data.result['fnt-disp-variant'] !== undefined) ))  {

            if(data.result['fnt-disp-variant'] === 2 || data.result['fnt-disp-variant'] === 3){
               WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.DISPLAY_VARIANT, WT.Constant.Api.VARIANT_EIGHT);
               
               WT.Global.logger("Afw::DISPLAY_VARIANT" + data.result['fnt-disp-variant'], CI.Utils.Define.LOGSeverity.INFO);
              }
              else{
                WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.DISPLAY_VARIANT,WT.Constant.Api.VARIANT_TEN);
                WT.Global.logger("Afw::DISPLAY_VARIENT" + data.result['fnt-disp-variant'], CI.Utils.Define.LOGSeverity.INFO);
              }
            WT.Global.logger("Afw::getCCFCIConfigSuccessCallback" + JSON.stringify(data), CI.Utils.Define.LOGSeverity.TRACE);
            if (data.result['steering-wheel-position'] === WT.Constant.Api.WHEEL_POSITION_RHD) {
                WT.Global.logger("Afw::steeringWheelPos(RHD)" + data.result['steering-wheel-position'], CI.Utils.Define.LOGSeverity.TRACE);
                callBack(WT.Constant.Api.CONFIGURATION_RHD);
            } else {
                WT.Global.logger("Afw::steeringWheelPos(LHD)" + data.result['steering-wheel-position'], CI.Utils.Define.LOGSeverity.TRACE);
                callBack(WT.Constant.Api.CONFIGURATION_LHD);
            }
            

            //store chinese region for keyboard placeholder check
            if(data.result.region === WT.Constant.Api.CHINA_REGION_CODE){
                WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.CHINA_REGION,true);
            }

        } else {
            WT.Global.logger("Afw::steeringWheelUndesiredData,LHDload", CI.Utils.Define.LOGSeverity.TRACE);
            WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.DISPLAY_VARIANT, WT.Constant.Api.VARIANT_TEN);
            callBack(WT.Constant.Api.CONFIGURATION_LHD);
        }
    }, function (error) {
        if (error) {
            WT.Global.logger("Afw::getCCFCIConfigErrorCallback,LHDload", CI.Utils.Define.LOGSeverity.ERROR);
            WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.DISPLAY_VARIANT, WT.Constant.Api.VARIANT_TEN);
            callBack(WT.Constant.Api.CONFIGURATION_LHD);
        } else {
            WT.Global.logger("Afw::getCCFCIConfigErrorCallback,LHDload", CI.Utils.Define.LOGSeverity.ERROR);
            WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.DISPLAY_VARIANT, WT.Constant.Api.VARIANT_TEN);
            callBack(WT.Constant.Api.CONFIGURATION_LHD);
        }
    });
};

/*
 * Name: WT.Service.Afw.getSystemLanguage
 * Description:Public method which get system language from framework.
 *             Summary :
 *                getCurrentLanguage from framework
 *                pass the current language code back to the module level
 * Parameters:
 * @param :
 * None
 * Returns:{function}
 * call back provides the current language code in the application
 * Globals updated:
 * None
 * Tables updated:
 * None
 */

WT.Service.Afw.getSystemLanguage = function (callBack) {
    WT.Global.logger("Afw::getSystemLanguage", CI.Utils.Define.LOGSeverity.TRACE);
    //Get current system language
    CI.System.Core.getCurrentLanguage("TEXT", function (langType, langCode) {
        WT.Global.logger("Afw::getCurrentLanguageSuccessCallback", CI.Utils.Define.LOGSeverity.TRACE);
        if (langCode && typeof langCode === "string" && langCode !== 'ERROR') {
            WT.Global.logger("Afw::langCode" + langCode, CI.Utils.Define.LOGSeverity.TRACE);
            callBack(langCode);
        } else {
            WT.Global.logger("Afw::langCodeError,defaultEnglishLoad", CI.Utils.Define.LOGSeverity.TRACE);
            callBack("en-GB");
        }
    });
};
/*
 * Name: WT.Service.Afw.fetchDisplayTempUnits
 * Description: Public method to fetch temperature unit from navigation.
 *              Summary :
 *                get temperature unit from vehicle sensors
 *                if success pass the temperature unit details to module level
 *                if error , call must go to module level to do the necessary
 * Parameters:
 * @param :
 * None
 * Returns:
 * {function} : success call back provides the temperature unit
 * {function} : error call back
 * Globals updated: None
 */

WT.Service.Afw.fetchDisplayTempUnits = function (successCallBck, errCallBck) {
    WT.Global.logger("Afw::getDisplayTempUnits", CI.Utils.Define.LOGSeverity.TRACE);
    //Get temperature unit from cluster
    CI.Vehicle.Sensors.getDisplayTempUnits(function (tempObj) {
        if (tempObj && tempObj.result && tempObj.result['display-temperature-units'])
            WT.Global.logger("Afw::getDisplayTempUnits" + JSON.stringify(tempObj), CI.Utils.Define.LOGSeverity.TRACE);
            successCallBck(tempObj);
    },function (tempErr) {
        if (tempErr){
            WT.Global.logger("Afw::getDisplayTempUnits error", CI.Utils.Define.LOGSeverity.TRACE);
            errCallBck();
        }
    });
};
/*
 * Name: WT.Service.Afw.fetchNaviDestination
 * Description: Public method to fetch destination from navigation.
 *              Summary :
 *                getDestination from navigation
 *                if success pass the current destination details to module level
 *                if error , call must go to module level to do the necessary
 * Parameters:
 * @param :
 * None
 * Returns:
 * {function} : success call back provides the destination object
 * {function} : error call back
 * Globals updated: None
 */

WT.Service.Afw.fetchNaviDestination = function (successCallBck, errCallBck) {
    WT.Global.logger("Afw::fetchNaviDestination", CI.Utils.Define.LOGSeverity.TRACE);
    //Get destination from navigation
    CI.Vehicle.Navi.getDestination(function (destObj) {
        if (destObj && destObj["waypoint-data"].location &&
                destObj["waypoint-data"].location.geoCoordinates &&
                destObj["waypoint-data"].location.geoCoordinates.latitude &&
                destObj["waypoint-data"].location.geoCoordinates.longitude) {
            WT.Global.logger("Afw::getDestinationSuccessCall" + JSON.stringify(destObj), CI.Utils.Define.LOGSeverity.TRACE);
            successCallBck(destObj);
            //successCallBck(JSON.stringify(destObj));
        } else {
            WT.Global.logger("Afw::getDestination,Invalid coordinates or location name,loadNoDestination", CI.Utils.Define.LOGSeverity.TRACE);
            errCallBck();
        }

    }, function (error) {

        WT.Global.logger("Afw::getDestinationErrorCall,loadNoDestination", CI.Utils.Define.LOGSeverity.ERROR);
        //Handling Navi Request In Progress error(450)
        if (error.error.code != CIErrors.NAVI_REQ_IN_PROGRESS.code) {
            WT.Global.logger("Afw::getDestinationErrorCall" + JSON.stringify(error), CI.Utils.Define.LOGSeverity.ERROR);
            errCallBck();
        }

    });

};

/*
 * Name: WT.Service.Afw.getCurrentLocation
 * Description:  Public method to fetch current location from navigation.
 *               Summary :
 *                     getCurrentLocation from navigation
 *                     if success pass the current location details to module level
 *                     if error , call must go to module level to do the necessary
 * Parameters:
 * @param :
 * None
 * Returns:
 * {function} : success call back provides the locationData
 * {function} : error call back
 * Globals updated: None
 */

WT.Service.Afw.getCurrentLocation = function (callBack, errCallBack) {
    WT.Global.logger("Afw::getCurrentLocation", CI.Utils.Define.LOGSeverity.TRACE);
    //Get current location from navigation
    CI.Vehicle.Navi.getCurrentLocation(function (locationObj) {
        var locationData = {};
        if (locationObj) {
            locationData = {"latitude": locationObj['location-data'].geoCoordinates.latitude,
                "longitude": locationObj['location-data'].geoCoordinates.longitude,
                "locationName": locationObj['location-data'].locationName
            };
            WT.Global.logger("Afw::getcurrentLocationSuccessCall" + JSON.stringify(locationData), CI.Utils.Define.LOGSeverity.TRACE);
            callBack(locationData);
        } else {
            WT.Global.logger("Afw::getcurrentLocation,Invalid coordinates or location name,loadNoLocation", CI.Utils.Define.LOGSeverity.TRACE);
            errCallBack();
        }

    }, function (error) {
        WT.Global.logger("Afw::getLocationErrorCall,loadNoLocation" + JSON.stringify(error), CI.Utils.Define.LOGSeverity.ERROR);
        //Handling Navi Request In Progress error(450)
        if (error.error.code != CIErrors.NAVI_REQ_IN_PROGRESS.code) {
            WT.Global.logger("Afw::getDestinationErrorCall" + JSON.stringify(error), CI.Utils.Define.LOGSeverity.ERROR);
            errCallBack();
        }
    });

};

/*
 * Name: WT.Service.Afw.getUserConnectivitySettings
 * Description:  Public method to fetch User Connectivity Settings.
 *                 Summary :
 *                    Get user connectivity
 *                    Framework call only required once and then stored in cache which can be accessed
 * Parameters:
 * @param :
 * None
 * Returns:
 * {function} : call back has parameter either "dataDisabled"/"dataEnabled"
 * Globals updated: None
 */

WT.Service.Afw.getUserConnectivitySettings = function (callBack) {
    WT.Global.logger("Afw::getUserConnectivitySettings", CI.Utils.Define.LOGSeverity.TRACE);

       //Get user connectivity settings
        CI.Utils.Connectivity.getConnectivityUserSettings(function (userData) {
            WT.Global.logger("Afw::getUserConnectivitySettingsSuccessCallBack" + JSON.stringify(userData), CI.Utils.Define.LOGSeverity.TRACE);
            if ((userData.result && (userData.result['cellular-allowed'] === 0) && (userData.result['roaming-allowed'] === 0) &&
                    (userData.result['wifi-allowed'] === 0))) {
                WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.USER_CONNECTION_SETTINGS, userData);
                //Show Pop-Up
                callBack(WT.Constant.connectionParam.USER_CONNECTION_DISABLE);
            } else {

                WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.USER_CONNECTION_SETTINGS, userData);
                callBack(WT.Constant.connectionParam.USER_CONNECTION_ENABLE);
            }
        }, function (err) {
            WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.USER_CONNECTION_SETTINGS, "error");
            //Show Pop-Up
            callBack(WT.Constant.connectionParam.USER_CONNECTION_DISABLE);
        });
    
};


/*
 * Name: WT.Service.Afw.getHMISettingsDetails
 * Description:  Public method which get system HMISetting from framework.
 *              Summary :
 *                getHMISettingsDetails from framework
 *                pass the current time format back to the module level
 * Parameters:
 * @param :
 * None
 * Returns:
 * {function} : call back has parameter of date/Time format
 * Globals updated: None
 */

WT.Service.Afw.getHMISettingsDetails = function (callBack) {
    dateTimeFormat = "";
    WT.Global.logger("Afw::getHMISettingsDetails", CI.Utils.Define.LOGSeverity.TRACE);
    //Get HMI settings
    CI.System.Core.getHMISettings(function (data) {
        WT.Global.logger("Afw::getHMISettingsDetailsSuccessCallback", CI.Utils.Define.LOGSeverity.TRACE);
        if (data && data.timeFormat && (typeof data.timeFormat !== undefined) &&
                (typeof data.timeFormat === "string") && (typeof data.dateFormat !== undefined) &&
                (typeof data.dateFormat === "string")) {
            WT.Global.logger("Afw::dateFormat" + data.dateFormat +" timeFormat"+data.timeFormat, CI.Utils.Define.LOGSeverity.TRACE);
            dateTimeFormat = {"timeFormat": data.timeFormat,
                "dateFormat": data.dateFormat

            };
            callBack(dateTimeFormat);
        } else {
            WT.Global.logger("Afw::timeFormatError,defaultDateTimeFormat", CI.Utils.Define.LOGSeverity.TRACE);
            dateTimeFormat = {"timeFormat": WT.Constant.Api.DEFAULT_TIME_FORMAT,
                "dateFormat": WT.Constant.Api.DEFAULT_DATE_FORMAT
            };
            callBack(dateTimeFormat);
        }
    }, function (error) {
        if (error) {
            WT.Global.logger("Afw::Afw::getHMISettingsDetailsErrorCallBack,Defaultload", CI.Utils.Define.LOGSeverity.ERROR);
            dateTimeFormat = {"timeFormat": WT.Constant.Api.DEFAULT_TIME_FORMAT,
                "dateFormat": WT.Constant.Api.DEFAULT_DATE_FORMAT};
            callBack(dateTimeFormat);
        } else {
            WT.Global.logger("Afw::Afw::getHMISettingsDetailsErrorCallBack,Defaultload", CI.Utils.Define.LOGSeverity.ERROR);
            dateTimeFormat = {"timeFormat": WT.Constant.Api.DEFAULT_TIME_FORMAT,
                "dateFormat": WT.Constant.Api.DEFAULT_DATE_FORMAT};
            callBack(dateTimeFormat);
        }
    });
};



/*
 * Name: WT.Service.Afw.getConnectivityStatus
 * Description: Public method to fetch Connectivity Status.
 *             Summary :
 *                Get connectivity status from framework
 * Parameters:
 * @param :
 * None
 * Returns:
 * {function} : call back has parameter either "noConnection"/"connectionAvailable"
 * Globals updated: None
 */

WT.Service.Afw.getConnectivityStatus = function (callBack) {
    WT.Global.logger("Afw::getConnectivityStatus", CI.Utils.Define.LOGSeverity.TRACE);
    //Get connection status
    CI.Utils.Connectivity.getConnectionStatus(function (data) {
        WT.Global.logger("Afw::getConnectionStatusSuccessCallBack" + JSON.stringify(data), CI.Utils.Define.LOGSeverity.TRACE);
        if (data && data.result && data.result["active-connection"] && (data.result["active-connection"] === "none")) {
            WT.Global.logger("Afw::getConnectionStatusSuccessCallBack,no connection", CI.Utils.Define.LOGSeverity.TRACE);
            //no connection
            callBack(WT.Constant.connectionParam.NO_CONNECTION);
        } else {
            WT.Global.logger("Afw::getConnectionStatusSuccessCallBack,connection Available", CI.Utils.Define.LOGSeverity.TRACE);
            //connection is available
            callBack(WT.Constant.connectionParam.CONNECTION_AVAILABLE);
        }

    }, function (error) {
        WT.Global.logger("Afw::getConnectionStatusErrorCallBack,no connection", CI.Utils.Define.LOGSeverity.ERROR);
        //no connection
        callBack(WT.Constant.connectionParam.NO_CONNECTION);
    });

};


/*
 * Name: WT.Service.Afw.subscribeConnectivityStatus
 * Description: Public method to subscribe Connectivity Status.
 * Summary :
 *  Subscribe connectivity listener from framework
 * Parameters:
 * @param :
 * None
 * Returns:
 * {function} : call back success if connectivity available
 * {function} : call back error
 * Globals updated:
 * WT.Service.Afw.subscribeStatus
 */

WT.Service.Afw.subscribeConnectivityStatus = function (callBack, errCallBck) {
    WT.Global.logger("Afw::subscribeConnectivityStatus", CI.Utils.Define.LOGSeverity.TRACE);
    //To check if subscribed
    WT.Service.Afw.subscribeStatus = true;
    //Subscribe for connectivity check
    CI.Utils.Connectivity.subscribeActiveConnection(function (successRes) {
        WT.Global.logger("Afw::subscribeConnectivityStatusCallBack - " + JSON.stringify(successRes), CI.Utils.Define.LOGSeverity.TRACE);
        callBack();

    }, function (errorRes) {
        WT.Global.logger("Afw::subscribeConnectivityStatusCallBack - " + JSON.stringify(errorRes), CI.Utils.Define.LOGSeverity.ERROR);
        //no connection
        errCallBck();

    });

};

/*
 * Name: WT.Service.Afw.subscribeConnectivityStatus
 * Description: Public method to unsubscribe Connectivity Status.
 *              Summary :
 *                   unsubscribe connectivity listener from framework
 *
 * Note: The call back will only occur when there is and error during un-subscription
 * Parameters:
 * @param :
 * None
 * Returns:
 * {function} : call back for unsubscription
 * Globals updated:
 * WT.Service.Afw.subscribeStatus
 */

WT.Service.Afw.unSubscribeConnectivityStatus = function (callBack) {
    //Check for connectivity subscription is enabled
    if (WT.Service.Afw.subscribeStatus === true) {
        WT.Global.logger("Afw::unSubscribeConnectivityStatus", CI.Utils.Define.LOGSeverity.TRACE);
        WT.Service.Afw.subscribeStatus = false;
        //Unsubscribe connectivity subscription
        CI.Utils.Connectivity.unSubscribeActiveConnection(function (errorRes) {
            WT.Global.logger("Afw::unSubscribeConnectivityStatusCallBack - " + JSON.stringify(errorRes), CI.Utils.Define.LOGSeverity.ERROR);
            //Unable to unsubscribe active connection check
            callBack();
        });
    }
};

/*
 * Name: WT.Service.Afw.fetchDisplayDistUnits
 * Description: Public method to fetch distance unit from cluster.
 * Summary :
 *          get distance unit from cluster
 *          if success pass the distance unit details to module level
 *          if error , call must go to module level to do the necessary
 * Parameters:
 * @param :
 * None
 * Returns:
 * {function} : success call back provides the distance unit
 * {function} : error call back
 * Globals updated: None
 */

WT.Service.Afw.fetchDisplayDistUnits = function (successCallBck, errCallBck) {
    WT.Global.logger("Afw::getDisplayDistUnits", CI.Utils.Define.LOGSeverity.TRACE);
    //Distance Unit from Cluster
    CI.Vehicle.Sensors.getDisplayDistUnits(function (distObj) {
        successCallBck(distObj);
        },
        function (distObj) {
            errCallBck(distObj);
    });
};

/*
 * Name: WT.Service.Afw.showPopUp
 * Description: Removes CI keyboard
 * Parameters:
 * @param :
 * {string} - pop up type of whether decision/timer
 * {string} - what is the message to be displayed
 * Returns:
 * {function} - callback on yes click on decision pop up
 * {function} - callback on no click on decision pop up
 * Globals updated: None
 */

WT.Service.Afw.showPopUp = function (popUpType, popUpTitle, popUpMsg, yesCallBack, noCallBack) {
    switch (popUpType) {
        case WT.Constant.popUpParam.POPUP_TYPE_DECISION :
            CI.UI.Common.Popups.displayPopup({
                popupType: CI.UI.Common.Popups.HMI_POPUP_TYPE.DECISION2,
                popupTitle: popUpTitle,
                popupText: popUpMsg,
                btn1: CI.Utils.Localization.translate("weat_Yes"),
                btn2: CI.Utils.Localization.translate("weat_No")
            },
            function (popupId, result) {
                //Needs to verfiy whether the call back is required
                if (result.status == CI.Utils.Define.HMI_RESPONSE_STATUS.STATUS_REJECTED ||
                        result.status == CI.Utils.Define.HMI_RESPONSE_STATUS.STATUS_REMOVED ||
                        result.status == CI.Utils.Define.HMI_RESPONSE_STATUS.STATUS_ERROR) {
                    WT.Global.logger("Afw::showPopUp inside remove popup", CI.Utils.Define.LOGSeverity.TRACE);
                    // Call back function for No Click
                    noCallBack();
                }

            },
            function (popupId, isClosed, btnId, btnText) {
                if (isClosed) {
                    WT.Global.logger("Afw::showPopUp inside isClosed", CI.Utils.Define.LOGSeverity.TRACE);
                    // Call back function for No Click
                    noCallBack();
                } else {
                    if (btnId === WT.Constant.popUpParam.YES_BUTTON) {
                        // Call back function for YES Click
                        yesCallBack();
                    } else {
                        // Call back function for NO click
                        noCallBack();
                    }
                }
            });
        break;
        case WT.Constant.popUpParam.POPUP_TYPE_TIMER :
            CI.UI.Common.Popups.displayPopup({
                popupType: CI.UI.Common.Popups.HMI_POPUP_TYPE.INFO_TIMEOUT,
                popupText: popUpMsg
            },
            function (popupId, result) {
                //Do nothing as of now
            });
            break;
        default:
    }
};

/*
 * Name: WT.Service.Afw.showKeyboard
 * Description: CI keyboard shall be shown when display Keyboard is called
 * Parameters:
 * @param :
 * {string} - prefilledText to be shown ,if place holder has to shown give prefilled text as ""
 * Returns:
 * {function} - callback on Ok click of keyboard
 * {function} - callback on back click on keyboard
 * Globals updated: None
 */

WT.Service.Afw.showKeyboard = function (prefilledText, successCallBack, backButtonCallBack) {
    //Check for Keyboard Availability
    if (CI.UI.Common.Keyboard.isAvailable()){
        
        var placeHolder = CI.Utils.Localization.translate("weat_Enter_town,city_or_postcode");

        //Check chinese region to update place holder
        if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.CHINA_REGION)){
            placeHolder = CI.Utils.Localization.translate("weat_Enter_town,city_or_postcode_china");
        }    

        //Show keyboard with placeholder data
        CI.UI.Common.Keyboard.displayKeyboard(CI.Utils.Localization.translate("APP_NAME"), placeHolder,
                prefilledText, false, function (status, key, enteredString) {
                    WT.Global.logger('CI_Keyboard displaycallback status: ' + status, CI.Utils.Define.LOGSeverity.INFO);
                    WT.Global.logger('CI_Keyboard displaycallback pressed key: ' + key, CI.Utils.Define.LOGSeverity.INFO);
                    WT.Global.logger('CI_Keyboard displaycallback entered text: ' + enteredString, CI.Utils.Define.LOGSeverity.INFO);

                    if ((typeof key === "number") && key === WT.Constant.keyBoardBtn.OK) {
                        //OK button called from keyboard
                        if (enteredString !== "") {
                            if (WT.Constant.languages.indexOf(WT.Service.Api.CurrentLanguage) < 0)
                            {
                                enteredString = enteredString.trim();
                                if (enteredString.length < 3) {
                                    WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"", CI.Utils.Localization.translate("weat_Type_3_char"));

                                }
                                else {
                                    successCallBack(enteredString);
                                }
                            }
                            else {
                                successCallBack(enteredString);
                            }
                        }


                    } else if ((typeof key === "number") && key === WT.Constant.keyBoardBtn.BACK) {
                        //back button called from keyboard
                        backButtonCallBack();
                    } else {
                        //When status during keyboard launch is coming as rejected , relaunch again
                        WT.Global.logger("Afw::showKeyboard Call Back"+"status :"+status+"key :"+key ,CI.Utils.Define.LOGSeverity.INFO);
                        if(status === CI.Utils.Define.JSNIHMICtrl.HMIStatusT.E_STATUS_REJECTED){
                            // continues call of keyboard after a rejection can cause keyboard failue
                            setTimeout( 
                                function () {
                                    WT.Route.location(WT.Constant.Route.SEARCHKEYBOARD.screenName); 
                                }, WT.Constant.Api.SEARCH_TIMEOUT
                            );
                        }
                    }
                }, null, function (key, message, removedByNativeHMI) {
                    WT.Global.logger("Afw::showKeyboard - Remove keyboard"+"key :"+key+"msg :"+message+"HMI :"+removedByNativeHMI, CI.Utils.Define.LOGSeverity.INFO);
        });
    }
};

/*
 * Name: WT.Service.Afw.removeKeyboard
 * Description: Removes CI keyboard
 * Parameters:
 * @param :
 * {string} - prefilledText to be shown ,if place holder has to shown give prefilled text as ""
 * Returns:
 * {function} - callback on Ok click of keyboard
 * {function} - callback on back click on keyboard
 * Globals updated: None
 */

WT.Service.Afw.removeKeyboard = function () {
    WT.Global.logger("Afw::Remove keyboard", CI.Utils.Define.LOGSeverity.TRACE);
    CI.UI.Common.Keyboard.removeKeyboard(); //Remove keyboard
};


/*
 * Name: WT.Service.getVehicleMotionStatus
 * Description: Get the vehicle movement status 0:stationary , 1:motion
 * Parameters:
 * @param : None
 * Returns:
 * {function} - callback with vehicle movement status
 * {function} - error Call Back
 * Globals updated: None
 *
 */

WT.Service.Afw.getVehicleMotionStatus = function (callBack, errorCall) {
    //Get vehicle is in motion / stationary
    CI.Vehicle.Sensors.getVehicleMovementStatus(function (obj) {
        if (obj && obj.result) {
            WT.Global.logger('Afw::getVehicleMotionStatus' + obj.result['vehicle-movement-status'], CI.Utils.Define.LOGSeverity.TRACE);
            callBack(obj.result['vehicle-movement-status']);
        } else {
            errorCall();
        }
    }, function (obj) {
        WT.Global.logger('Afw::getVehicleMotionStatus Error', CI.Utils.Define.LOGSeverity.ERROR);
        errorCall(obj);
    });
};

/*
 * Name: WT.Service.subscribeVehicleMotion
 * Description: Subscribe to vehicle movement status 0:stationary , 1:motion
 * Parameters:
 * @param : None
 * Returns:
 * {function} - callback with vehicle movement status
 * {function} - error Call Back
 * Globals updated:
 * WT.Service.Afw.vehicleSubscribeStatus
 */

WT.Service.Afw.subscribeVehicleMotion = function (callBack, errCallBack) {
    //Check for vehicle motion is not subscribed
    if (WT.Service.Afw.vehicleSubscribeStatus === false) {
        WT.Service.Afw.vehicleSubscribeStatus = true;
        //Subscribe vehicle motion status
        CI.Vehicle.Sensors.subscribeVehicleMovementStatus(function (obj) {
            if (obj && obj.data) {
                WT.Global.logger('Afw::subscribeVehicleMotion' + obj.data['vehicle-movement-status'], CI.Utils.Define.LOGSeverity.TRACE);
                callBack(obj.data['vehicle-movement-status']);
            }
        }, function (error) {
            WT.Global.logger('Afw::subscribeVehicleMotion Error', CI.Utils.Define.LOGSeverity.ERROR);
            errCallBack(error);
        });
    }
};

/*
 * Name: WT.Service.unsubscribeVehicleMotion
 * Description: Unsubscribe to vehicle movement status if subscribed to vehicle motion in other pages
 * Parameters:
 * @param : None
 * Returns: {function} - callback if error
 * Globals updated:
 * WT.Service.Afw.vehicleSubscribeStatus
 */

WT.Service.Afw.unsubscribeVehicleMotion = function (callBack) {
    //Check for vehicle motion is subscribed
    if (WT.Service.Afw.vehicleSubscribeStatus === true) {
        WT.Service.Afw.vehicleSubscribeStatus = false;
        //Unsubscribe vehicle motion subscription
        CI.Vehicle.Sensors.unSubscribeVehicleMovementStatus(function (obj) {
            WT.Global.logger('Afw::unsubscribeVehicleMotion Error', CI.Utils.Define.LOGSeverity.ERROR);
            callBack();
        });
    }
};
/*
 * Name: WT.Service.Afw.subscribeDistanceUnit
 * Description: subscribing distance unit change in the cluster
 * Parameters: None
 * Returns: None
 * Globals updated: WT.Constant.DISTANCE_UNIT
 */
WT.Service.Afw.subscribeDistanceUnit = function () {
    CI.Vehicle.Sensors.subscribeDisplayDistUnits(function (successRes) {
        WT.Global.logger("WT::Afw::subscribeDisplayDistUnits:SuccessCallback" + JSON.stringify(successRes), CI.Utils.Define.LOGSeverity.TRACE);
        if (successRes && successRes.data) {
            if (successRes.data['display-distance-units'] === 0) {
                WT.Constant.DISTANCE_UNIT = WT.Constant.Api.DIST_METRIC;
                $("#currLocRefIcon").trigger("mousedown");
                $("#currLocRefIcon").trigger("mouseup");
            } else {
                WT.Constant.DISTANCE_UNIT = WT.Constant.Api.DIST_IMPERIAL;
                $("#currLocRefIcon").trigger("mousedown");
                $("#currLocRefIcon").trigger("mouseup");
            }
            WT.Global.logger("WT::Afw::subscribeDisplayDistUnits:Deistance unit changed to  " + WT.Constant.DISTANCE_UNIT, CI.Utils.Define.LOGSeverity.TRACE);
        }
    }, function (errorRes) {
        WT.Global.logger("WT::Afw::subscribeDisplayDistUnits:ErrorCallback - " + JSON.stringify(errorRes), CI.Utils.Define.LOGSeverity.ERROR);
    });
};
/*
 * Name: WT.Service.Afw.subscribeTemperatureUnit
 * Description: subscribing temperature unit change in the cluster
 * Parameters: None
 * Returns: None
 * Globals updated: WT.Constant.TEMP_UNIT
 */
WT.Service.Afw.subscribeTemperatureUnit = function () {
    CI.Vehicle.Sensors.subscribeDisplayTempUnits(function (successRes) {
        WT.Global.logger("WT::Afw::subscribeDisplayTempUnits:SuccessCallback" + JSON.stringify(successRes), CI.Utils.Define.LOGSeverity.TRACE);
        if (successRes && successRes.data) {
            if (successRes.data['display-temperature-units'] === 0) {
                WT.Constant.TEMP_UNIT = WT.Constant.Api.TEMP_CEL;
                $("#currLocRefIcon").trigger("mousedown");
                $("#currLocRefIcon").trigger("mouseup");
            } else {
                WT.Constant.TEMP_UNIT = WT.Constant.Api.TEMP_FAREN;
                $("#currLocRefIcon").trigger("mousedown");
                $("#currLocRefIcon").trigger("mouseup");
            }
            WT.Global.logger("WT::Afw::subscribeDisplayTempUnits:Temperature unit changed to  " + WT.Constant.TEMP_UNIT, CI.Utils.Define.LOGSeverity.TRACE);
        }
    }, function (errorRes) {
            WT.Global.logger("WT::Afw::subscribeDisplayTempUnits:ErrorCallback - " + JSON.stringify(errorRes), CI.Utils.Define.LOGSeverity.ERROR);
    });
};


//TODO::Header
WT.Service.Afw.onCIEventReception = function(triggerClick){
    CI.System.Notifier.onCIAppEvent(function (senderUID, data) {
            WT.Global.logger("WT::Afw::subscribeDisplayTempUnits:SuccessCallback"+JSON.stringify(data), CI.Utils.Define.LOGSeverity.INFO);
            if(senderUID === WT.Constant.Api.SIDE_PANEL_UUID){
                triggerClick();
            }  
    });
};

//TODO::Header
WT.Service.Afw.sidePanelTriggerEvent = function(){
    CI.System.Notifier.sendAppEvent(WT.Constant.Api.SIDE_PANEL_UUID, {"id": "WeatherUpdatedNtf"});
};

//TODO::Header
WT.Service.Afw.sidePanelFavUpdate= function(){
    CI.System.Notifier.sendAppEvent(WT.Constant.Api.SIDE_PANEL_UUID, {"id": "FavouritesChangedNtf"});
};
