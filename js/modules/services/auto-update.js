/*
 * File Name: auto-update.js
 * Description: Auto update module handles update functionality based on timer value.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Deepika Basavaraju
 * Creation Date: 19 Jan 2018
 * Version : 1.0
 *
 * MODIFICATION RECORDS:
 * 
 */


/**
 * @class
 * Javascript WT.Service.AutoUpdate object, which is used for initialization of AutoUpdate Service
 */

WT.Service.AutoUpdate = {};

/**
 * Public method which kick starts the autoUpdate timer.
 * @param{string} : Timer Value after which manual updation shall be triggered
 * @param{string} : The id for which the trigger should be done
 * Summary :
 *		Timer will start when we are in the current screen.
 *		If already an instance is there clear the instance and start new
 */

WT.Service.AutoUpdate.startTimer = function (timerValue, clickId) {
    WT.Global.logger("AutoUpdate::startTimer", CI.Utils.Define.LOGSeverity.TRACE);
    if (WT.Service.AutoUpdate.timer) {
        clearTimeout(WT.Service.AutoUpdate.timer);
    }
    WT.Service.AutoUpdate.timer = setTimeout(function () {
        //$("#"+clickId).trigger("click");
        $("#" + clickId).trigger("mousedown");
        $("#" + clickId).trigger("mouseup");
    }, timerValue);
};

/**
 * Public method which clear the autoUpdate timer.
 * Summary :
 *		The function shall be called in route to clear any previous timer
 */

WT.Service.AutoUpdate.clearTimer = function () {
    WT.Global.logger("AutoUpdate::clearTimer", CI.Utils.Define.LOGSeverity.TRACE);
    if (WT.Service.AutoUpdate.timer) {
        clearTimeout(WT.Service.AutoUpdate.timer);
    }
};