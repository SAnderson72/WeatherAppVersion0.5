/*
 * File Name: constants.js
 * Description: Weather App constants are defined here.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Sreejith P
 * Creation Date: 11 January, 2018
 * MODIFICATION RECORDS:
 */

//Weather Object
var WT = WT || {};

WT.Constant = {};

/*
 * Name: WT.Constant.Route
 * Description: Public member which acts as Enum for Screen Information for routing throughout application.
 *      defines each app screen with sidebar, name, html, js and scrollbar.
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */
WT.Constant.Route = {
    GENERICLOC: {sideBarId: 1, screenName: "genericCurLoc", screenHtml: "generic",
        jsPath: "generic"},
    GENERICDEST: {sideBarId: 4, screenName: "genericDestLoc", screenHtml: "generic",
        jsPath: "generic"},
    CURRLOC: {sideBarId: 1, screenName: "currLoc", screenHtml: "wtdetail",
        jsPath: "currentloc"},
    DESTINATION: {sideBarId: 4, screenName: "destination", screenHtml: "wtdestdetail",
        jsPath: "destination"},
    DESTNOTAVAIL: {sideBarId: 4, screenName: "destNotAvailable", screenHtml: "no-dest",
        jsPath: "destination"},
    FORECAST: {sideBarId: 1, screenName: "forecastdet", screenHtml: "forecast",
        jsPath: "forecast",tabTwentyFour:"twentyFourHour",tabFiveDay:"fiveDay"},
    SEARCHKEYBOARD: {sideBarId: 3, screenName: "searchKB", screenHtml: "",
        jsPath: "search"},
    SEARCHLIST: {sideBarId: 3, screenName: "searchList", screenHtml: "search-list",
        jsPath: "search"},
    SEARCHDETAILS: {sideBarId: 3, screenName: "searchDetails", screenHtml: "wtdetail",
        jsPath: "search"},
    SETTINGS: {sideBarId: 5, screenName: "settings", screenHtml: "settings",
        jsPath: "settings"},
    LEGALINFO: {sideBarId: 5, screenName: "legalInfo", screenHtml: "legal-info",
        jsPath: "settings"},
    LEGALDETAILS: {sideBarId: 5, screenName: "legalDetails", screenHtml: "legal-detail",
        jsPath: "settings"},
    FAVOURITE: {sideBarId: 2, screenName: "favouriteList", screenHtml: "favourite",
        jsPath: "favourite"}
};



Object.freeze(WT.Constant.Route);

/*
 * Name: WT.Constant.Api
 * Description: Public member which defines constant values needed to make Off-board API calls throughout application.
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */

WT.Constant.Api = {
    API_VERSION: "v2.2",
    LOC_RETRY_COUNTER: 3,
    DES_RETRY_COUNTER: 1,
    REQUEST_TIMEOUT: 15000,
    API_TIMEOUT: 60000,
    DEFAULT_AUTOUPDATE_TIMEOUT: 600000,
    DEFAULT_UPDATED_DISPLAY_TIMEOUT: 5000,
    APP_VERSION: "1.0",
    APP_UUID: "550e8400-e29b-41d4-a716-446655444999",
    TIME_AM: "AM",
    TIME_PM: "PM",
    DEFAULT_LANGUAGE: "en-GB",
    ANIMATION_TIMER: 200,
    ONE_HOUR_IN_MILLISECOND: 3600000,
    TWELVE_HOUR_IN_MILLISECOND: 43200,
    LONG_PRESS_TIMER: 500,
    CONFIGURATION_RHD: "RHD",
    CONFIGURATION_LHD: "LHD",
    VARIANT_EIGHT:"8inch",
    VARIANT_TEN:"10inch",
    DEFAULT_TIME_FORMAT : "12HR",
    DEFAULT_DATE_FORMAT : "ddmmyyyy",
    DEFAULT_LEGAL_INFO_DISPLAY: 60,
    TEMP_CEL : "C",
    TEMP_FAREN : "F",
    MAXIMUM_RESULTS : 10,
    DIST_METRIC : "metric",
    DIST_IMPERIAL : "imperial",
    FORECAST_ANIMATION_TIMER : 650,
    FORECAST_LINE_EXPANSION_TIMER : 400,
    FORECAST_TAB_EXPANSION_TIMER : 700,
    SETTINGS_VERSION : "v1.3",
    SIDE_PANEL_UUID: '550e8400-e29b-41d4-a750-446655440001',
	ERROR_TIMEOUT : 5000,
	CHINA_REGION_CODE : 2,
	WHEEL_POSITION_RHD :1,
	SEARCH_TIMEOUT : 1000
};

Object.freeze(WT.Constant.Api);

/*
 * Name: WT.Constant.LocalStorage
 * Description: Public member which defines constant variables needed for local storage throughout application.
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */

WT.Constant.localStorage = {
    CURRENT_LANG: "WT-CURRENTLANG",
    CURRENT_WT_DETAILS: "WT-CURRENTWTDETAILS",
    DEST_DETAILS: "WT-DESTDETAILS",
    DEST_NAV_DETAILS: "WT-DESTNAVDETAILS"
};

Object.freeze(WT.Constant.localStorage);

/*
 * Name: WT.Constant.cacheStorage
 * Description: Public member which defines constant variables needed for cache storage throughout application.
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */

WT.Constant.cacheStorage = {
    DATE_TIME_FORMAT: "WT-dateTimeFormat",
    APP_EXECUTED: "WT-appExec",
    USER_CONNECTION_SETTINGS: "WT-userConnSettings",
    STEERING_POSITION: "WT-steeringPosition",
    DISPLAY_VARIANT: "WT-displayVariant",
    VEHICLE_MOTION: "WT-vehicleMotion",
    FORECAST_DATA : "WT-forecastDetail",
    PRE_FILLED_KB_DATA : "WT-prefilledKbData",    
    SELECTED_LOCATION_ID: "WT-selectedLocationId",
    SEARCH_LIST_DETAILS: "WT-searchListDetails",
    SEARCH_DETAILS: "WT-searchDetails",
    SEARCH_PREV_SCREEN: "WT-searchPrevScreen",
    FORECAST_PREV_SCREEN : "WT-forecastPrevScreen",
    SIDE_PANEL_LOCID : "WT-sidePanelLocID",
    SIDE_PANEL_LAT : "WT-sidePanelLat",
    SIDE_PANEL_LONG : "WT-sidePanelLong",
    CHINA_REGION : "WT-chinaRegion"
};

Object.freeze(WT.Constant.cacheStorage);

/*
 * Name: WT.Constant.connectionParam
 * Description: Public member which defines constant variables needed for user connectivity and connection status
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */

WT.Constant.connectionParam = {
    USER_CONNECTION_ENABLE: "dataEnabled",
    USER_CONNECTION_DISABLE: "dataDisabled",
    NO_CONNECTION: "noConnection",
    CONNECTION_AVAILABLE: "connectionAvailable"
};

Object.freeze(WT.Constant.connectionParam);

/*
 * Name: WT.Constant.screenNames
 * Description: Public member which defines constant for screen names
 *              for speech input
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */

WT.Constant.screenNames = {
    CURRENT_LOCATION: "CurrentLocation",
    DESTINATION: "destination",
    SETTINGS: "settings",
    SEARCH: "search",
    FULL_LOADING: "full-loading",
    PARTIAL_LOADING: "partial-loading",
    FORECAST_MYLOC_24 : "mylocation_24",
    FORECAST_MYLOC_5 : "mylocation_5",
    FORECAST_DEST_24 : "destination_24",
    FORECAST_DEST_5 : "destination_5"
};

Object.freeze(WT.Constant.screenNames);

/*
 * Name: WT.Constant.keyBoardBtn
 * Description: Public member which defines keuboard button constants
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */

WT.Constant.keyBoardBtn = {
    OK: 1,
    BACK: 4
};

Object.freeze(WT.Constant.keyBoardBtn);

/*
 * Name: WT.Constant.languages
 * Description: Public member which defines constant for list languages
 *              which do not support minimum 3 character check
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */

WT.Constant.languages = ["zh-Hans", "zh-Hant", "ja-JP", "ko-KR"];

Object.freeze(WT.Constant.languages);

/*
 * Name: WT.Constant.vehicleStatus
 * Description: Public member which defines vehicle Status
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */

WT.Constant.vehicleStatus = {
    MOTION: 1,
    STATIONARY: 0
};
Object.freeze(WT.Constant.vehicleStatus);

/*
 * Name: WT.Constant.popupParam
 * Description: Public member which defines constant for pop up type and No button constant
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */

WT.Constant.popUpParam = {
    POPUP_TYPE_DECISION: "Decision",
    POPUP_TYPE_TIMER: "Timer",
    YES_BUTTON: 2
};

/*
 * Name: WT.Constant.Timer
 * Description: Public member which defines Enum for Timer related Variables.
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 * Note: Don't use Object.freeze for WT.Constant.Timer
 */

WT.Constant.Timer = {
    BACKEND_CALL: null
};
/*
 * Name: WT.Constant.Swipe
 * Description: Public member which defines Enum for Swipe related Variables.
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */

WT.Constant.Swipe = {
    CLICK_THRESHOLD: 2,
	DISABLE_SWIPE_TIMER : 300,
	DRAGGABLE_TIMER : 1000,
	DEBOUNCE_TIMER : 100
};

WT.Constant.DISTANCE_UNIT = "";
WT.Constant.TEMP_UNIT = "F";
WT.Constant.DELTA = 4;
WT.Constant.FAV_LIST_LENGTH = 5;
