/*
 * File Name: global.js
 * Description: global variables and function needed in WT app are defined in this modules.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Sreejith P
 * Creation Date: 11 January, 2018
 * MODIFICATION RECORDS:
 */

/*
 * @namespace
 * Javascript WT.Global object, which is used for initialization of global objects
 */
WT.Global = {};

//Global Variables
WT.Global.prevThemeScreen = "";
WT.Global.prevTheme = "";
WT.Global.showSearchWTDetail = true;
WT.Global.backTransition = false;
WT.Global.appIntialisation=false;
WT.Global.favoriteLogin=false;
WT.Global.speechInput = false;
WT.Global.langChange = false;
WT.Global.appHideSpeech = false;
//For multi item delete 
WT.Global.dataToDelete = [];
WT.Global.sentToDelete = [];
WT.Global.deleteProgress = false;
WT.Global.favDetailsScreen = false;
WT.Global.favUpdateBefore12Hour = false;


/*
 * Name: WT.Global.logger
 * Description: Public method which is used for logging
 *
 * Parameters:
 * @param :None
 * Returns:None
 * Globals updated:None
 */
WT.Global.logger = function (message, severity) {
    CI.Utils.Logger.log(message, severity, "Status", "Weather");
};


/*
 * Name: WT.Global.sidePanelEventReception
 * Description: Public method which is used for sidePanel Event Recption(self invoked)
 *
 * Parameters:
 * @param :None
 * Returns:None
 * Globals updated:None
 */
WT.Global.sidePanelEventReception = function () {
    WT.Service.Afw.onCIEventReception(function(){
        var currentScreen = WT.Route.getCurrentScreen(); 
        if((currentScreen === WT.Constant.Route.GENERICLOC.screenName) ||
            (currentScreen === WT.Constant.Route.GENERICDEST.screenName) ||
            (currentScreen === WT.Constant.Route.CURRLOC.screenName) ||
            (currentScreen === WT.Constant.Route.DESTINATION.screenName) ||
            (currentScreen === WT.Constant.Route.SEARCHDETAILS.screenName)){
            //Trigger Refresh Click
            $("#currLocRefIcon").trigger("mousedown");
            $("#currLocRefIcon").trigger("mouseup");

        }
    });
};

/*
 * Name: WT.Global.getCurrentTime
 * Description: Public method which is used to get current time.
 *              Current  time is returned in 24 Hr Format
 *
 * Parameters:
 * @param :None
 * Returns:
 *          outputTime in "24 HR" format
 * Globals updated:None
 */
WT.Global.getCurrentTime = function () {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var outputTime = '';
    hours = parseInt(hours);
    if(hours < 10){
        hours = '0' + hours;
    }
    if(minutes < 10){
        minutes = '0' + minutes;
    }
    outputTime = hours + ":" + minutes;
    return outputTime;
};
/*
 * Name: WT.Global.getTimeFormat
 * Description: Public method which is used to change time format
 *               according to system time Format.Time is stored in cache
 *               as 24 HR format and changed to system time format.
 *
 * Parameters:
 * @param :None
 * Returns:
 *          changedTime in system time format
 * Globals updated:None
 */
WT.Global.getTimeFormat = function (time) {
    var datetimeFormat = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DATE_TIME_FORMAT);
    var changedTime = "";
    if (datetimeFormat.timeFormat == WT.Constant.Api.DEFAULT_TIME_FORMAT)
    {
        var hours = time.substring(0, time.indexOf(":"));
        var minutes = time.substr(time.indexOf(":") + 1, 2);
        var ampm = (hours >= 12) ? WT.Constant.Api.TIME_PM : WT.Constant.Api.TIME_AM;
        hours = (hours > 12) ? hours - 12 : hours;
        if (hours === "00")
        {
            hours = "12";
        }
        changedTime = hours + ":" + minutes;

        if (ampm === WT.Constant.Api.TIME_AM)
        {
            changedTime = CI.Utils.Localization.translate("weat_updated_am", {'PARAM0': changedTime});
        }
        else {
            changedTime = CI.Utils.Localization.translate("weat_updated_pm", {'PARAM0': changedTime});
        }
    }
    else
    {
        changedTime = CI.Utils.Localization.translate("weat_updated_date", {'PARAM0': time});
    }
    return changedTime;
};
/*
 * Name: WT.Global.clickGenericRefreshIcon
 * Description: Public method which is used to refresh generic screen.
 *              clickGenericRefreshIcon is triggered on manual and auto update.
 *
 * Parameters:
 * @param :
 * None
 * Returns:
 * None
 * Globals updated: None
 */
WT.Global.clickGenericRefreshIcon = function () {
    var refreshClick = true;
    $(".icon.update").mouseleave(function () {
        refreshClick = false;
    });
    $(".icon.update").mouseup(function (event) {
        if (refreshClick === true) {
            if (WT.Route.getCurrentScreen() === "genericCurLoc") {
                WT.Genericloc.refreshIconClick();
            } else {
                //Destination Refresh Icon Click
                WT.Genericdest.manualUpdate();
            }
            //Stop other jquery events which is triggred during mouseup
            event.stopPropagation();
        }
    });
};
/*
 * Name: WT.Global.clickLocationRefreshIcon
 * Description: Public method which is used to refresh current loaction screen.
 *              clickLocationRefreshIcon is triggered on manual and auto update
 * Parameters:
 * @param :
 * None
 * Returns: None
 * Globals updated: None
 */
WT.Global.clickLocationRefreshIcon = function () {
    var refreshClick = true;
    $(".icon.update").mouseleave(function () {
        refreshClick = false;
    });
    $(".icon.update").mouseup(function (event) {
        if (refreshClick === true) {
            if (WT.Route.getCurrentScreen() === "currLoc") {
                 WT.Currentloc.refreshIconClick();
            }else if (WT.Route.getCurrentScreen() === "searchDetails") {
                WT.SearchDetail.manualUpdate();
            }else if(WT.Route.getCurrentScreen() === "destination") {
                WT.Destination.manualUpdate();
            }else if(WT.Route.getCurrentScreen() === "forecastdet"){
                var forecastObject = new forcastDetailClass();
                forecastObject.forcastAutoUpdate();
            }
            //Stop other jquery events which is triggred during mouseup
            event.stopPropagation();
        }
    });
};
/*
 * Name: WT.Global.validateResponseData
 * Description: Public method which are used for validating offboard data for
 *              geolocation objects within the application.
 *              Validate datas , if the parameters is not as expected then
 *              locDataInvalid is returned in Error Call Back
 * Parameters:
 * @param :
 *         {string}locationDetail to be validated
 * Returns:
 *         {object}detail with locationDetail updated Date and updated Time
 * Globals updated: None
 */
WT.Global.validateResponseData = function (locationDetail, callBckFn, errCallBckFn) {
    //locationDetail Object is checked for parameter validation
    if (locationDetail) {
        var currentTime = WT.Global.getCurrentTime();
        var currentDate = WT.Global.getCurrentDate();
        var details = {"locationDetail": locationDetail,
            "updatedTime": currentTime,
            "updatedDate": currentDate};
        callBckFn(details);
    }
    else {
        errCallBckFn("locDataInvalid");
    }
};
/*
 * Name: WT.Global.cacheStorage
 * Description: Public method which used for cache storage of variables and
 *              objects within the application.
 *              setItem(key, data) : to store data with given key
 *              getItem(key) : to fetch data by providing the key
 *              removeItem(key) : to release an item from cache.
 * Parameters:
 * @param :
 * Returns:
 *         cached object which is created for createCacheInstance
 * Globals updated:
 * None
 */
WT.Global.cacheStorage = function () {
    var cacheInstance;
    function createCacheInstance() {
        var object = {};
        return object;
    }
    return {
        getInstance: function () {
            if (!cacheInstance) {
                cacheInstance = createCacheInstance();
            }
            return cacheInstance;
        },
        setItem: function (key, data) {
            cacheInstance[key] = data;
        },
        getItem: function (key) {
            return cacheInstance[key];
        },
        removeItem: function (key) {
            delete cacheInstance[key];
        }
    };
}();

//Creating CacheStorage Instance for usage
WT.Global.cacheStorage.getInstance();
/*
 * Name: WT.Global.getCurrentTimeDiff
 * Description: Public method which calculates time difference between
 *              current time and Cached time.Difference in time is
 *              returned in milliseconds
 *
 * Parameters:
 * @param :
 * Returns:
 *         differenceInMilliSec.Current Date is returned based on date
 *         format set in HMI Settings
 * Globals updated:
 * None
 */
WT.Global.getCurrentTimeDiff = function (time) {
    var currentDateObj = new Date();
    var currentDate = currentDateObj.getMonth() + 1 + "/" + currentDateObj.getDate() + "/" + currentDateObj.getFullYear() + " " + time;
    var fromTime = new Date(currentDate);
    var differenceInMilliSec = currentDateObj.getTime() - fromTime.getTime();
    return Math.abs(differenceInMilliSec);
};
/*
 * Name: WT.Global.getCurrentDate
 * Description: Public method which fetches current date  for
 *              checking if Cached data is today's
 *
 * Parameters:
 * @param :
 * Returns:
 *         Current Date is returned based on date format set in HMI Settings
 * Globals updated:
 * None
 */
WT.Global.getCurrentDate = function () {
    var datetimeFormat = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DATE_TIME_FORMAT);
    //Get Date,Month and year from current date
    var dateObj = new Date();
    var dateDay = dateObj.getDate();
    var dateMonth = dateObj.getMonth() + 1;
    var currentDate = '';
    //Append zero to display day in DD Format
    if(dateDay < 10){
        dateDay = "0" + dateDay ;
    }
    //Append zero to display month in MM Format
    if(dateMonth < 10){
        dateMonth = "0" + dateMonth;
    }
    if ((datetimeFormat.dateFormat).toLowerCase() === WT.Constant.Api.DEFAULT_DATE_FORMAT){
        WT.Global.logger("WT::Global:getCurrentDate inside ddmmyyyy",CI.Utils.Define.LOGSeverity.TRACE);
        currentDate = dateDay + "/" + dateMonth + "/" + dateObj.getFullYear();
    }else{
        WT.Global.logger("WT::Global:getCurrentDate inside else mmddyyyy",CI.Utils.Define.LOGSeverity.TRACE);
        currentDate = dateMonth + "/" + dateDay + "/" + dateObj.getFullYear();
    }
    return currentDate;
};
/*
 * Name: WT.Global.getYesterdayDate
 * Description: Public method which fetches yesterday date  for
 *              checking if Cached data is yesterday's
 *
 * Parameters:
 * @param :
 * Returns:
 *         yestDate is returned based on date format set in HMI Settings
 * Globals updated:
 * None
 */
WT.Global.getYesterdayDate = function () {
    var datetimeFormat = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DATE_TIME_FORMAT);
    //Get Date,Month and year from current date
    var date = new Date();
    date.setDate(date.getDate() - 1);
    var dateDay = date.getDate();
    var dateMonth = date.getMonth() + 1;
    var yestDate = "";
    //Append zero to display day in DD Format
    if(dateDay < 10){
        dateDay = "0" + dateDay ;
    }
    //Append zero to display month in MM Format
    if(dateMonth < 10){
        dateMonth = "0" + dateMonth;
    }
    if ((datetimeFormat.dateFormat).toLowerCase() === WT.Constant.Api.DEFAULT_DATE_FORMAT) {
        yestDate = dateDay + "/" + dateMonth + "/" + date.getFullYear();
    }
    else {
        yestDate = dateMonth + "/" + dateDay + "/" + date.getFullYear();
    }
    return yestDate;
};
/*
 * Name: WT.Global.convertEtaToDelta
 * Description: Public method which takes estimated time of arrival at destiantion in millisec and 
                returns difference b/n curretn time and ETA
 *              
 * Parameters:
 * @param :
 * Returns:
 *         yestDate is returned based on date format set in HMI Settings
 * Globals updated:
 * None
 */
WT.Global.convertEtaToDelta= function (etaMilliSec) {   
    var hours = parseInt((etaMilliSec / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    if(isNaN(hours)){
        return 0;
    }else{
        return hours;
    }   
};
/*
 * Name: WT.Global.getDestination
 * Description: Public method which fetches destination details and saves in
 *      WT.Service.Api.getLocationWTData is invoked to get destination details
 *      validateResponseData validates the destination details
 *
 * Parameters:
 * @param :
 * Returns: None
 * Globals updated: None
 * Local Storage Variables updated:
 * WT-DESTDETAILS
 */
WT.Global.getDestination = function (maxRetries, destinationSuccess, destinationError) {
    if (localStorage.getItem(WT.Constant.localStorage.DEST_NAV_DETAILS)) {
        var destDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.DEST_NAV_DETAILS));
        var destLatitude = destDetails["waypoint-data"].location.geoCoordinates.latitude;
        var destLongitude = destDetails["waypoint-data"].location.geoCoordinates.longitude;
        var destETA = destDetails["waypoint-data"].tta;
        var delta=WT.Global.convertEtaToDelta(destETA);
		WT.Constant.DELTA = delta;
        WT.Service.Api.getLocationWTData({latitude: destLatitude, longitude: destLongitude, 
            retries: maxRetries},
        function (successResponse) {  //Success Callback
            WT.Global.logger("WT::Global:getLocationData successResponse ",
                    CI.Utils.Define.LOGSeverity.INFO + " - " + JSON.stringify(successResponse));
            WT.Global.validateResponseData(successResponse, function (destnDetails) {
                localStorage.setItem(WT.Constant.localStorage.DEST_DETAILS, JSON.stringify(destnDetails));
                destinationSuccess(destnDetails);
            }, function (errorResponse) {
                WT.Global.logger("WT::Global:validateResponseData errorResponse ",
                        CI.Utils.Define.LOGSeverity.INFO + " - " + JSON.stringify(errorResponse));
                destinationError();
            });
        }, function (errorResponse) {
            WT.Global.logger("WT::Global:getLocationData errorResponse ",
                    CI.Utils.Define.LOGSeverity.INFO + " - " + JSON.stringify(errorResponse));
            destinationError();
        });
    }else{
        if(WT.Global.speechInput){
            WT.Global.stopLoading();
            WT.Route.location(WT.Constant.Route.DESTNOTAVAIL.screenName);
        }
        $("#nodestination").html(CI.Utils.Localization.translate("weat_Dest_msg"));
    }
};
/*
 * Name: WT.Global.fetchForcast
 * Description: Public method which fetches Forcast details for
 *      checking if to populate TwentyFourHour or FiveDay data
 *
 * Parameters:
 * @param : {string} - tab information
 * Returns: None
 * Globals updated: None
 * None
 */
WT.Global.fetchForcast = function(forecast){
    var forecastObject = new forcastDetailClass();
    if(forecast === WT.Constant.Route.FORECAST.tabTwentyFour){
        //Fetch Twenty Four Data
        forecastObject.populate24Hour();
    }else{
        //Fetch Five Day
        forecastObject.populateFiveDay();
    }
};
/*
 * Name: WT.Global.locationForecastClick
 * Description: Public method which redirects to Forcast details of current location of destination
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 * None
 */
WT.Global.locationForecastClick = function(forecast){
    if (WT.Route.getCurrentScreen() === "currLoc") {
        WT.Currentloc.locForecastClick(); 
    }else if (WT.Route.getCurrentScreen() === "destination") {
        WT.Destination.locForecastClick(); 
    }else if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHDETAILS.screenName){
        WT.SearchDetail.locForecastClick();
    }else{
        //todo for favorite
    }
};

/*
 * Name: WT.Global.searchLocation
 * Description: Public method which fetches location details on selecting a list Item
 *      WT.Service.Api.getWTDataByLocationId is invoked to get location WT details
 *      validateResponseData validates the location WT details
 *
 * Parameters:
 * @param :
 * Returns:
 * @success - {Object} Weather JSON object appended with date and time
 * @error - None
 * Globals updated:
 *      WT.Global.showSearchWTDetail
*/
WT.Global.searchLocation = function (searchSuccess, searchError) {
    var locationId = "";
    //WT.Global.showSearchWTDetail = true;
    
    if (WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID)) {
        locationId = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID);
    }
    WT.Global.logger("WT::Global::searchLocation locationId", CI.Utils.Define.LOGSeverity.INFO+ " - " +locationId);
    WT.Service.Api.getWTDataByLocationId({retries: WT.Constant.Api.LOC_RETRY_COUNTER,
        locationId: locationId},
    function (successResponse) {

        //if (WT.Global.showSearchWTDetail === true) {
            WT.Global.logger("WT::Global:searchLocation successResponse ",
                    CI.Utils.Define.LOGSeverity.INFO + " - " + JSON.stringify(successResponse));

            WT.Global.validateResponseData(successResponse, function (searchDetails) {
                WT.Global.logger("WT::Global:geoLocValidateData successResponse ", CI.Utils.Define.LOGSeverity.INFO);
                if(locationId == successResponse.location.locationId){
                    WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.SEARCH_DETAILS, searchDetails);
                    searchSuccess(searchDetails);
                }else{
                    WT.Global.logger("WT::Global:geoLocValidateData req id ans res id are"+locationId+' : '+successResponse.location.locationId, CI.Utils.Define.LOGSeverity.INFO);
                    searchError();
                }
            }, function (errorResponse) {
                WT.Global.logger("WT::Global:geoLocValidateData errorResponse ",
                        CI.Utils.Define.LOGSeverity.INFO + JSON.stringify(errorResponse));
                searchError();
            });
       // } else {
          //  WT.Global.logger("WT::Global:searchLocation -> WT.Global.showSearchWTDetail - Success response aborted", CI.Utils.Define.LOGSeverity.INFO);

        //}
    }, function (errorResponse) {
        WT.Global.logger("WT::Global:searchLocation errorResponse ",
                CI.Utils.Define.LOGSeverity.INFO + JSON.stringify(errorResponse));
        searchError();
    });
};
/*
 * Name: WT.Global.startLoading
 ** Description : Public method which launch loading animation.
 *              loading animation elements creation
 *              Appending to the main element and start animation
 *
 * Parameters:
 * @param :
 * Returns:
 * None
 * Globals updated:
 *             WT.Global.animationInProgress
 *             WT.Global.animationFinish
 */
WT.Global.startLoading = function (title, loadingType) {
    
    WT.Global.animationInProgress = true;
    /*WT.Global.loadTimer = setTimeout(function () {
        WT.Global.animationFinish = true;
    }, 750);*/

    //Loading Animation elements injected into loading Div
    if (loadingType === "full-loading") {
        $('#container').hide();
        $('#loadingBg').removeClass("partial-loading");
        $('#loadingBg').addClass("full-loading");
    }
    else {
        $("#mainView").hide();
        $('#loadingBg').removeClass("full-loading");
        $('#loadingBg').addClass("partial-loading");
    }
    $('#loadingBg').html("");
    $('#loadingBg').css('display', 'block');
    var loadingDiv = '<div id="loadingBgGradient" class="loadingBgGradient">';
    loadingDiv += '<div id="loading" class="loading">';
    loadingDiv += '<div class="outerDiv"><div id="box1" class="box1"></div><div id="box2" class="box2"></div><div id="box3" class="box3"></div><div id="box4" class="box4"></div></div>';
    loadingDiv += '<div id="loadingTitle" class="loadingTitle white font25pt fontTipReg">' + title + '</div>';
    $('#loadingBg').html(loadingDiv);
    $('#loadingBg').css('display', 'block');
    var shape = $("#outerDiv"),
        box1 = $("#box1"),
        box2 = $("#box2"),
        box3 = $("#box3"),
        box4 = $("#box4"),
        tw = new TimelineMax({repeat: -1}),
        spd = 0.20;
    CSSPlugin.defaultTransformPerspective = 100;
    TweenMax.set($(".outerDiv"), {visibility: "visible"});
    tw.from(box1, spd, {rotationX: 90, transformOrigin: "center bottom", transformPerspective: 10})
        .from(box2, spd, {rotationY: 90, transformOrigin: "left center", transformPerspective: 10})
        .from(box3, spd, {rotationX: -90, transformOrigin: "center top", transformPerspective: 10})
        .from(box4, spd, {rotationY: -90, transformOrigin: "center right", transformPerspective: 10})
        .to(box1, spd, {rotationY: -90, transformOrigin: "right center", transformPerspective: 10, background: "url('res/Loading-box-1.png')"})
        .to(box2, spd, {rotationX: 90, transformOrigin: "center bottom", transformPerspective: 10, background: "url('res/Loading-box-2.png')"})
        .to(box3, spd, {rotationY: 90, transformOrigin: "left center", transformPerspective: 10, background: "url('res/Loading-box-4.png')"})
        .to(box4, spd, {rotationX: -90, transformOrigin: "top center", transformPerspective: 10, background: "url('res/Loading-box-3.png')"});
};
/*
 * Name: WT.Global.stopLoading
 ** Description : Public method which stops loading animation.
 *
 * Parameters:
 * @param :
 * Returns: None
 * Globals updated:
 *              WT.Global.animationFinish
 *              WT.Global.animationInProgress
 *              WT.Global.loadTimer
 */
WT.Global.stopLoading = function () {
    if (WT.Global.animationInProgress === true) {
        var tw = new TimelineMax();
        WT.Global.animationInProgress = false;
      //  var loadingTimer = setInterval(function () {
           // if (WT.Global.animationFinish === true) {
               // WT.Global.animationFinish = false;
                // Kill animation object
                TweenLite.killTweensOf(["#box1","#box2","#box3","#box4"]);
                $('#container').show();
                $('#mainView').show();
                $('#loadingBg').removeClass("partial-loading").removeClass("full-loading");
                $('#loadingBg').html("");
                $('#loadingBg').fadeOut(300);
              //  clearInterval(loadingTimer);
              //  clearInterval(WT.Global.loadTimer);
           // }
     //   }, 100);
    }
};
/*
* Name: updateBackgroundTheme
* Description: Public method which is called to reflect background w.r.t feed data.*              
* Parameters: {number} weatherIcon is used to map distinct weather states to graphics
* Returns: None
* Globals updated: None
* 
*/
WT.Global.updateBackgroundTheme = function (weatherIcon, updateThemeCallBack) {
    WT.Global.logger("WT::Global::updateBackground() Entered with Icon: "+weatherIcon, CI.Utils.Define.LOGSeverity.TRACE);
    // iconTyppe is used to map distinct weather states to background graphics
    var iconType = weatherIcon.toString() || "";
    // current_theme to be applied based on feed data.
    var current_theme;
    switch (iconType) {
        /* 1: Sunny; 2: Mostly sunny; 30: Hot */
        case '1':
        case '2':
        case '30':
            current_theme = "sunny_theme";
            break;
        /* 3: Partly Sunny; 4: Interimenent clouds; 35:36: cloudy day/night TBD */
        case '3':
        case '4':
            current_theme = "partly_sunny_theme";                  
            break;
        /* 5:Hazy */
        case '5':
            current_theme = "hazy_theme";                 
            break;
        /* 6: mostly cloudy; 7: cloudy; 8: overcast; 38:TBD */
        case '6':
        case '7':
        case '8':
        case '38':
            current_theme = "overcast_theme";
            break;
        /* 11:Fog */
        case '11':
            current_theme = "fog_theme";
            break;
        /* 12: showers; 13: mostly cloudy with showers; 18: rain; 39: parlty showers; 40: mostly cloudy with showwers */
        case '12':
        case '13':
        case '18':
        case '39':
        case '40':
        /* 14: Partly Sunny with showers */
        case '14':
            current_theme = "showers_theme";
            break;
        /* 17: Partly Sunny with t/s; 15: thunderstorms; 16: Mostly cloudy with t/s; 41&42:TBD */
        case '15':
        case '16':
        case '17':
        case '41':
        case '42':
            current_theme = "thundershowers_theme";
            break;
        /* 21: partly sunny with flurries */
        case '21':
            current_theme = "snow_theme";
            break;
        /* 24: Ice; 31: cold  TO be Changed */
        case '24':
        case '31':
            current_theme = "icy_theme";
            break;
        /* '26': freezing rain */
        case '26':
            current_theme = "hail_theme";
            break;
        /* 25: sleet; 29: rain and snow; TO be Changed */
        case '29':
            current_theme = "showers_theme";
            break;
        /* 32: windy TBD day/night */
        case '32':
            current_theme = "wind_theme";
            break;
        /*33 34:clear,mostly clear TBD day/night*/
        case '33':
        case '34':
            current_theme = "clear_night_theme";
            break;
        /*35:partly cloudy 36:inter cloudy TBD DAY/NIGHT*/
        case '35':
        case '36':
            current_theme = "moon_cloud_theme";
            break;
        /*MOON HAZY 37*/
        case '37':
            current_theme = "moon_hazy_theme";
            break;
        case 'Rain And Snow':
            current_theme = "showers_theme";
            break;
        case 'Foggy Night':
            current_theme = "fog_theme";
            break;
        /* 39:40:TBD:Moon with rain */
        case '39':
        case '40':
            current_theme = "moon_cloud_theme";
            break;
        /* Night electric TBD for 41 and 42 */
        case '41':
        case '42':
            current_theme = "thundershowers_theme";
            break;
        /* '19':flurries; '20':mostly cloudy with flurries; '22':snow; '23':mostly cloudy with snow */
        /* Night snow for 43 and 44 */
        case '43':
        case '44':
        case '19':
        case '20':
        case '22':
        case '23':
        case '25':
            current_theme = "snow_theme";
            break;
        default:            
    }
    $("#container").attr("class","container background");
    updateThemeCallBack(current_theme);
    // applyTheme current_theme here
};
/*
* Name: translateWeatherText
* Description: Public method which is called to get the translated value of weather text         
* Parameters:
* Returns: None
* Globals updated: None
* 
*/
WT.Global.translateWeatherText = function (weatTextId, weatherIcon) {
    WT.Global.logger("WT::Global::translateWeatherText() Entered with Icon: "+weatherIcon, CI.Utils.Define.LOGSeverity.TRACE);
    var iconType = weatherIcon.toString() || "";
    switch (iconType) {
        case '1':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Sunny"));
            break;
        case '2':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Mostly_sunny"));
            break;
        case '3':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Partly_sunny"));
            break;
        case '4':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Intermittent_clouds"));
            break;
        case '5':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Hazy_sunshine"));
            break;
        case '6':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Mostly_cloudy"));
            break;
        case '7':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Cloudy"));
            break;
        case '8':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Overcast"));
            break;
        case '11':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Foggy"));
            break;
        case '12':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Showers"));
            break;
        case '13':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Cloudy_with_showers"));
            break;
        case '14':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Sunshine_with_showers"));
            break;
        case '15':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Thunderstorms"));
            break;
        case '16':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Cloudy_with_thunderstorms"));
            break;
        case '17':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Sunny_with_thunderstorms"));
            break;
        case '18':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Rain"));
            break;
        case '19':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Light_snow"));
            break;
        case '20':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Cloudy_with_light_snow"));
            break;
        case '21':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Sunny_with_light_snow"));
            break;
        case '22':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Snow"));
            break;
        case '23':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Cloudy_with_snow"));
            break;
        case '24':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Icy"));
            break;
        case '25':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Sleet"));
            break;
        case '26':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Hail"));
            break;
        case '29':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Rain_and_snow"));
            break;
        case '30':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Hot"));
            break;
        case '31':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Cold"));
            break;
        case '32':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Windy"));
            break;
        case '33':
            $(weatTextId).html(CI.Utils.Localization.translate("Clear_night"));
            break;
        case '34':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Mostly_clear_night"));
            break;
        case '35':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Partly_cloudy"));
            break;
        case '36':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Intermittent_clouds"));
            break;
        case '37':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Hazy_night"));
            break;
        case '38':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Mostly_cloudy"));
            break;
        case '39':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Partly_cloudy_with_showers"));
            break;
        case '40':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Mostly_cloudy_with_showers"));
            break;
        case '41':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Partly_cloudy_with_thunderstorms"));
            break;
        case '42':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Mostly_cloudy_with_thunderstorms"));
            break;
        case '43':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Mostly_cloudy_with_light_snow"));
            break;
        case '44':
            $(weatTextId).html(CI.Utils.Localization.translate("weat_Mostly_cloudy_with_snow"));
            break;
        default:
            WT.Global.logger("WT::Global::translateWeatherText(): Default case. Entered with Icon: "+weatherIcon, CI.Utils.Define.LOGSeverity.TRACE);
            break;
    }
};

//TODO::Header
WT.Global.clickFavIcon = function (obj) {    
    var favClick = true;
    $(".icon.favselected, .icon.nonfav").mouseleave(function () {
        favClick = false;
    });
    $(".icon.favselected, .icon.nonfav").mouseup(function (event) {
        if (favClick === true) {
            var loginSuccessCallBack = function (loginStatus) {
                var currentScreen = WT.Route.getCurrentScreen();
                //check which screen
                if (currentScreen === WT.Constant.Route.CURRLOC.screenName) {
                    WT.Currentloc.favIconClick(obj, loginStatus);
                } else if (currentScreen === WT.Constant.Route.DESTINATION.screenName) {
                    WT.Destination.favIconClick(obj, loginStatus);
                } else if (currentScreen === WT.Constant.Route.SEARCHDETAILS.screenName) {
                    WT.SearchDetail.favIconClick(obj, loginStatus);
                } else {
                    var forecastObject = new forcastDetailClass();
                    forecastObject.favIconClick(obj, loginStatus);
                }
            };
            if (!WT.Service.FavoriteHandler.loggedIn) {
                if (!WT.Global.favoriteLogin) {
                    WT.Service.FavoriteHandler.loginToProfile(false, loginSuccessCallBack);
                } else {
                    WT.Sidemenu.curLocClick();
                }
            } else {
                loginSuccessCallBack("alreadyLoggedIn");
            }
            //Stop other jquery events which is triggred during mouseup
            event.stopPropagation();
        }
    });
};
