/*
 * File Name: app-launch.js
 * Description: Launch module handles app initialization and launch process.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Sreejith P
 * Creation Date: 11 January, 2018
 * MODIFICATION RECORDS:
 */

WT.Launch = {};
//Default screen to be launched is Current Location
WT.Launch.screenToBeLaunched = WT.Constant.screenNames.CURRENT_LOCATION;
/*
 * Name: WT.Launch.appIntialisation
 * Description: Public method which does the initialization during launch of Weather application.
 *      fetches app manifest details
 *      getSystemConfiguration from framework
 *      getSystemLanguage from framework and store and clear storage if language change
 *      fetch destination from navigation and store it
 * Parameters:None
 * Returns: None
 * Globals updated:
 * APP_VERSION,APP_UUID,WT-CURRENTLANG,WT-DESTDETAILS
 */
WT.Launch.appIntialisation = function () {  
    /*
     * Name: fetchNaviDestSuccessCallBack
     * Description: private method to handle success call back of  fetchNaviDestination Success CallBack.
     * Parameters: None
     * Returns: None
     * Globals updated: None
     */
    var fetchNaviDestSuccessCallBack = function (destData) {
        var destnLatitude = destData['waypoint-data'].location.geoCoordinates.latitude;
        var destnLongitude = destData['waypoint-data'].location.geoCoordinates.longitude;
        var destnETA = destData["waypoint-data"].tta;
        WT.Constant.DELTA=WT.Global.convertEtaToDelta(destnETA);
        try{
            var destDetails = localStorage.getItem(WT.Constant.localStorage.DEST_NAV_DETAILS);
            if (destDetails) {
                var destNavDetails = JSON.parse(destDetails);
                if ((destNavDetails["waypoint-data"].location.geoCoordinates.latitude !== destnLatitude) ||
                        (destNavDetails["waypoint-data"].location.geoCoordinates.longitude !== destnLongitude)) {
                    //removing the cached destination details, as destination data changed
                    localStorage.removeItem(WT.Constant.localStorage.DEST_DETAILS);
                    localStorage.setItem(WT.Constant.localStorage.DEST_NAV_DETAILS, JSON.stringify(destData));
                    WT.Global.logger("WT::AppLaunch::fetchNaviDestSuccessCallBack WT-DESTDETAILS removed ",
                            CI.Utils.Define.LOGSeverity.TRACE);
                }
                else {
                    WT.Global.logger("WT::AppLaunch::fetchNaviDestSuccessCallBack WT-DESTDETAILS not cleared ",
                            CI.Utils.Define.LOGSeverity.TRACE);
                }
            }
            else {
                localStorage.setItem(WT.Constant.localStorage.DEST_NAV_DETAILS, JSON.stringify(destData));
            }
        }catch(error){
            WT.Global.logger("WT::AppLaunch::fetchNaviDestSuccessCallBack JSON parse error ",
                            CI.Utils.Define.LOGSeverity.TRACE);
        }
        WT.Launch.appScreen();
        
    };
    /*
     * Name: fetchNaviDestErrorCallBack
     * Description: private method to handle success call back of  fetchNaviDestination Error CallBack.
     * Parameters: None
     * Returns: None
     * Globals updated: None
     */
    var fetchNaviDestErrorCallBack = function () {
        WT.Global.logger("WT::AppLaunch::fetchNaviDestErrorCallBack JSON parse error ",CI.Utils.Define.LOGSeverity.INFO);
        localStorage.removeItem(WT.Constant.localStorage.DEST_NAV_DETAILS);
        localStorage.removeItem(WT.Constant.localStorage.DEST_DETAILS);
        WT.Launch.appScreen();
    };
    /*
     * Name: fetchTempSuccessCallBack
     * Description: private method to handle success call back of  fetchNaviDestination Success CallBack.
     * Parameters: None
     * Returns: None
     * Globals updated: None
     */
    var fetchTempSuccessCallBack = function (tempData) {
        WT.Global.logger("WT::AppLaunch::fetchTempSuccessCallBack  ",CI.Utils.Define.LOGSeverity.INFO);
        
        if (tempData.result['display-temperature-units'] === 0) {
            WT.Constant.TEMP_UNIT = WT.Constant.Api.TEMP_CEL;
        } else {
            WT.Constant.TEMP_UNIT = WT.Constant.Api.TEMP_FAREN;
        }
        WT.Service.Afw.fetchDisplayDistUnits(fetchDistSuccessCallBack, fetchDistErrorCallBack);    
    };
    /*
     * Name: fetchTempErrorCallBack
     * Description: private method to handle success call back of  fetchNaviDestination Error CallBack.
     * Parameters: None
     * Returns: None
     * Globals updated: None
     */
    var fetchTempErrorCallBack = function () {       
        WT.Global.logger("WT::AppLaunch::fetchTempErrorCallBack error ",CI.Utils.Define.LOGSeverity.ERROR);
    };
    /*
     * Name: fetchDistSuccessCallBack
     * Description: private method to handle success call back of  fetchDisplayDistUnits Success CallBack.
     * Parameters: None
     * Returns: None
     * Globals updated: None
     */
    var fetchDistSuccessCallBack = function (distData) {
        WT.Global.logger("WT::AppLaunch::fetchDistSuccessCallBack  ",CI.Utils.Define.LOGSeverity.INFO);
        if (distData.result['display-distance-units'] === 0) {
            WT.Constant.DISTANCE_UNIT = WT.Constant.Api.DIST_METRIC;//kph
            WT.Global.logger("WT::AppLaunch::getDisplayDistUnits = metric(kph)", CI.Utils.Define.LOGSeverity.TRACE);
        } else {
            WT.Constant.DISTANCE_UNIT = WT.Constant.Api.DIST_IMPERIAL;//mph
            WT.Global.logger("WT::AppLaunch::getDisplayDistUnits = imperial(mph)", CI.Utils.Define.LOGSeverity.TRACE);
        }
        WT.Service.Afw.fetchNaviDestination(fetchNaviDestSuccessCallBack, fetchNaviDestErrorCallBack);
    };
    /*
     * Name: fetchDistErrorCallBack
     * Description: private method to handle success call back of  fetchDisplayDistUnits Error CallBack.
     * Parameters: None
     * Returns: None
     * Globals updated: None
     */
    var fetchDistErrorCallBack = function () {
       
        WT.Global.logger("WT::AppLaunch::fetchDistErrorCallBack error ",CI.Utils.Define.LOGSeverity.ERROR);
    };
    /*
     * Name: getSystemLanguageCallBack
     * Description: private method to handle success call back of  getSystemLanguage.
     * Parameters: None
     * Returns: None
     * Globals updated: None
     */
    var getSystemLanguageCallBack = function (langCode) {
        //Weather Service API Object for Current Language
        WT.Service.Api.CurrentLanguage = langCode;
        //Check if the language has changed
        if (localStorage.getItem(WT.Constant.localStorage.CURRENT_LANG) && localStorage.getItem(WT.Constant.localStorage.CURRENT_LANG) !== langCode) {
            //Remove cached Weather data of current location and destination if available
               localStorage.removeItem(WT.Constant.localStorage.CURRENT_WT_DETAILS);
               localStorage.removeItem(WT.Constant.localStorage.DEST_DETAILS);
               WT.Global.langChange = true;
        }
        localStorage.setItem(WT.Constant.localStorage.CURRENT_LANG, langCode);
        WT.Service.Afw.fetchDisplayTempUnits(fetchTempSuccessCallBack, fetchTempErrorCallBack);        
    };
    /*
     * Name: getHMISettingsDetailsCallBack
     * Description: private method to handle success call back of  getHMISettingsDetails.
     * Parameters: None
     * Returns: None
     * Globals updated: None
     */
    var getHMISettingsDetailsCallBack = function (dateTimeFormat) {
        WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.DATE_TIME_FORMAT, dateTimeFormat);
        WT.Service.Afw.getSystemLanguage(getSystemLanguageCallBack);
    };
    /*
     * Name: getSystemConfigurationCallBack
     * Description: private method to handle success call back of getSystemConfiguration.
     * Parameters: None
     * Returns: None
     * Globals updated: None
     */
    var getSystemConfigurationCallBack = function (handDriveConf) {
        WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.STEERING_POSITION, handDriveConf);
        if (handDriveConf && handDriveConf === WT.Constant.Api.CONFIGURATION_RHD){
            if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DISPLAY_VARIANT) === WT.Constant.Api.VARIANT_TEN){
                $('body').append('<link rel="stylesheet" href="css/10inch/rhd.css" type="text/css" />');
            } else{
                $('body').append('<link rel="stylesheet" href="css/8inch/rhd.css" type="text/css" />');
            }
        }
        WT.Service.Afw.getHMISettingsDetails(getHMISettingsDetailsCallBack);
    };
    CI.System.Core.ready(function () {
        var manifestDetails = CI.System.Core.getManifestData();
        WT.Constant.Api.APP_VERSION = manifestDetails.version;
        WT.Constant.Api.APP_UUID = manifestDetails.id;
        WT.Service.Afw.getSystemConfiguration(getSystemConfigurationCallBack);
    });
    WT.Service.Afw.subscribeTemperatureUnit();
    WT.Service.Afw.subscribeDistanceUnit();
};
/*
 * Name: WT.Launch.appScreen
 * Description: Public method to launch default home screen as current location,and trigger update.
 * Parameters: None
 * Returns: None
 * Globals updated: None
 */
WT.Launch.appScreen = function () {
    WT.Global.appIntialisation = true;
    WT.Global.appHideSpeech = false;
    //Subscribe to side panel Event
    WT.Global.sidePanelEventReception();
    //Translated values for menu label
    $("#mylocBtnSpan").html(CI.Utils.Localization.translate("weat_My_location"));
    $("#favBtnSpan").html(CI.Utils.Localization.translate("weat_Favourites"));
    $("#findBtnSpan").html(CI.Utils.Localization.translate("weat_Find"));
	$("#destnSpan").html(CI.Utils.Localization.translate("weat_Destination"));
    //App launch Normal and Through Speech
    if (WT.Launch.screenToBeLaunched === WT.Constant.screenNames.CURRENT_LOCATION) {
        $("#nav-myloc").trigger("mousedown");
        $("#nav-myloc").trigger("mouseup");
    } else if (WT.Launch.screenToBeLaunched === WT.Constant.screenNames.DESTINATION) {        
        $("#nav-dest").trigger("mousedown");
        $("#nav-dest").trigger("mouseup");
    } else if (WT.Launch.screenToBeLaunched === WT.Constant.screenNames.SETTINGS) {
        $("#container").attr("class", "container settings-page");
        WT.Route.location(WT.Constant.Route.SETTINGS.screenName);
    } else if (WT.Launch.screenToBeLaunched === WT.Constant.screenNames.SEARCH) {
        $("#nav-find").trigger("mousedown");
        $("#nav-find").trigger("mouseup");
    } else if (WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_MYLOC_24 || WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_MYLOC_5) {
        if(WT.Global.sidePanelInProgress){
            WT.Route.location(WT.Constant.Route.FORECAST.screenName);
            WT.Global.sidePanelInProgress = false;
        }else if(WT.Global.speechInput){
            WT.Route.location(WT.Constant.Route.FORECAST.screenName);
        }else{

        }
    } else if(WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_DEST_24 || WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_DEST_5){
        if (localStorage.getItem(WT.Constant.localStorage.DEST_NAV_DETAILS)) {
            WT.Route.location(WT.Constant.Route.FORECAST.screenName);
        }else{
            $("#nav-dest").trigger("mousedown");
            $("#nav-dest").trigger("mouseup");
        }
    }else {
        WT.Global.logger("WT::AppLaunch::appScreen Application already launched ", CI.Utils.Define.LOGSeverity.TRACE);
    }
};
/*
 * Name: lazyLoadJS
 * Description: private method to handle lazy load js files.
 * Parameters: 
 *          [Array] : Array of files to be lazily loaded
 * Returns: 
 *        Call back when all files are successfully loaded
 * Globals updated: None
 */
WT.Launch.lazyLoadJS = function(filesToLoad,callBack){        
    var jsLoader = function(path){
        var result = $.Deferred();
        var script = document.createElement("script");
            script.async = "async";
            script.type = "text/javascript";
            script.src = path;
            script.onload = script.onreadystatechange = function (_, isAbort) {
                if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                    if (isAbort)
                        result.reject();
                    else
                        result.resolve();
                }
            };
            script.onerror = function () { 
                result.reject(); 
            };
            document.querySelector('head').appendChild(script);
            return result.promise();
    };
    var map = $.map(filesToLoad,function(file,i){
        return jsLoader(file+".js");                   
    }); 
    $.when.apply($,map).then(function() {
        callBack();
    });                    
};
/*
 * Name: triggerLazyLoad
 * Description: private method to handle app handle lazy load from index.html.
 * Parameters: None
 * Returns: None
 * Globals updated: None
 */
WT.Launch.triggerLazyLoad = function(){
    WT.Launch.lazyLoadJS([
            //CI Framework files Start
            '/afw/UI/Common/js/CI_Keyboard',
            '/afw/Utils/Connectivity',
            '/afw/Vehicle/Sensor',
            '/afw/Vehicle/Profiles',
            //CI Framework files End
            //Weather app specific files
            'js/side-menu',
            'js/lib/scroll.min',
            'js/modules/services/offboard-api'],function(){
                WT.Global.logger("WT::AppLaunch:: Lazy load done", CI.Utils.Define.LOGSeverity.TRACE);
            }
    );
};
/*
 * Name: app show event handler
 * Description: private method to handle app show event.
 *              check app launched already & get instance of cacheStorage
 * Parameters: None
 * Returns: None
 * Globals updated:
 * APPEXECUTED
 */
$(CI.System.Core).on(CI.System.Events.show, function (optData, data) {
    WT.Global.appShow = true;
        //App Luanch through speech and side panel
    if (data.data !== undefined ) {
         WT.Global.logger("WT::app-Launch::Eventsshow-sidepanel input - " + data.data.mode , CI.Utils.Define.LOGSeverity.TRACE);
        if(data.data.mode === 'speech_input'){
            WT.Global.logger("WT::app-Launch::Eventsshow-speach input - " + data.data.mode, CI.Utils.Define.LOGSeverity.TRACE);
            WT.Launch.screenToBeLaunched = data.data.event;
            WT.Global.speechInput = true;
        }else if(data.data.mode === '24hForecast'){
            WT.Global.logger("WT::app-Launch::Eventsshow-sidepanel input - " + data.data.locationId, CI.Utils.Define.LOGSeverity.TRACE);
            //side panel Launch
            if(data.data.locationId){
               if(!WT.Global.sidePanelInProgress){
                    WT.Global.logger("WT::app-Launch::Eventsshow-sidepanel inside if - " , CI.Utils.Define.LOGSeverity.INFO);
                    WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.SIDE_PANEL_LOCID, data.data.locationId);
                    WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.SIDE_PANEL_LAT, data.data.lat);
                    WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.SIDE_PANEL_LONG, data.data.long);
                    WT.Launch.screenToBeLaunched = WT.Constant.screenNames.FORECAST_MYLOC_24;
                    WT.Global.sidePanelInput = true;
                    WT.Global.sidePanelInProgress = true;
               }
            }else{
                WT.Launch.screenToBeLaunched = WT.Constant.screenNames.CURRENT_LOCATION;
            }
        }else{
             WT.Global.logger("WT::app-Launch::Eventsshow-input else - ", CI.Utils.Define.LOGSeverity.TRACE);
        }
    }
    
    if(!WT.Global.appIntialisation){
    	WT.Global.startLoading(CI.Utils.Localization.translate("weat_Loading_weather"), WT.Constant.screenNames.FULL_LOADING);
        //Launch the Weather default screen & get instance of cacheStorage
        /*if(!WT.Global.speechInput){
            WT.Launch.screenToBeLaunched = WT.Constant.screenNames.CURRENT_LOCATION;
        }*/
        WT.Service.FavoriteHandler.checkActiveUser();
        
        WT.Launch.appIntialisation();
        //app-launch by speach input Settings/Search
        if (WT.Launch.screenToBeLaunched === WT.Constant.screenNames.SETTINGS) {
            $("#container").attr("class", "container settings-page");
            WT.Route.location(WT.Constant.Route.SETTINGS.screenName);
        } else if (WT.Launch.screenToBeLaunched === WT.Constant.screenNames.SEARCH) {
            $("#nav-find").trigger("mousedown");
            $("#nav-find").trigger("mouseup");
        }
    }else{
        //In-app transition through speech
        if(!WT.Global.favoriteLogin){
            if ((WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHKEYBOARD.screenName) && (WT.Launch.screenToBeLaunched !== WT.Constant.screenNames.SEARCH)) {
                WT.Service.Afw.removeKeyboard();
            }
            if(WT.Global.appHideSpeech){
                WT.Launch.appIntialisation();
            }else{
                if (WT.Launch.screenToBeLaunched === WT.Constant.screenNames.CURRENT_LOCATION) {
                    $("#nav-myloc").trigger("mousedown");
                    $("#nav-myloc").trigger("mouseup");
                } else if (WT.Launch.screenToBeLaunched === WT.Constant.screenNames.DESTINATION) {        
                    $("#nav-dest").trigger("mousedown");
                    $("#nav-dest").trigger("mouseup");
                } else if (WT.Launch.screenToBeLaunched === WT.Constant.screenNames.SETTINGS) {
                    $("#container").attr("class", "container settings-page");
                    WT.Route.location(WT.Constant.Route.SETTINGS.screenName);
                } else if (WT.Launch.screenToBeLaunched === WT.Constant.screenNames.SEARCH) {
                    $("#nav-find").trigger("mousedown");
                    $("#nav-find").trigger("mouseup");
                } else if (WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_MYLOC_24 || WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_MYLOC_5) {
                    if(WT.Global.sidePanelInProgress){
                        WT.Route.location(WT.Constant.Route.FORECAST.screenName);
                        WT.Global.sidePanelInProgress = false;
                    }else if(WT.Global.speechInput){
                        WT.Route.location(WT.Constant.Route.FORECAST.screenName);
                    }else{

                    }
                } else if(WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_DEST_24 || WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_DEST_5){
                    if (localStorage.getItem(WT.Constant.localStorage.DEST_NAV_DETAILS)) {
                        WT.Route.location(WT.Constant.Route.FORECAST.screenName);
                    }else{
                        $("#nav-dest").trigger("mousedown");
                        $("#nav-dest").trigger("mouseup");
                    }
                }
            }
        }else{
            WT.Global.favoriteLogin = false;
        }
    }
});
/*
 * Name: app hide event handler
 * Description: private method to handle app hide event.
 * Parameters: None
 * Returns: None
 * Globals updated:
 * WT.Global.appShow
 */
$(CI.System.Core).on(CI.System.Events.hide, function () {
    //Remove Requested Pop Up
    WT.Launch.screenToBeLaunched = WT.Constant.screenNames.CURRENT_LOCATION;
    WT.Global.appShow = false;
    WT.Global.appHideSpeech = true;
    WT.Global.logger("WT::app-Launch::Events hide - " + WT.Global.appShow, CI.Utils.Define.LOGSeverity.TRACE);
});

