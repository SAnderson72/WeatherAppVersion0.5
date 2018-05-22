/*
 * File Name: search.js
 * Description: Search keyboard, back-button for keyboard and no result pop-up are handled here.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Vinny V
 * Creation Date: 08 Februrary, 2018
 * Version : 1.0
 */

WT.Searchkeyboard = {};

var searchKeyboardClass = function () {
    
    //public variables
    searchKeyboardClass.responseInProgress = false;

    /*
     * Name: updateListBackground
     * Description: Search Keyboard back button functionality
     *    should go to the previous screen from where keyboard was selected
     * Parameters:
     * @param {string} : None
     * Returns: None
     * Globals updated: None
     */
    var updateListBackground = function(){
        //Update Background
        if(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS)){
            var locationDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
            WT.Global.updateBackgroundTheme(locationDetails.locationDetail.today.weatherIcon, function(current_theme){
                $("#container").addClass(current_theme+"_dest");   
            });
        }else{
            //Show grtadient image
            $("#container").attr("class", "container dest-background");
        }
    };

    /*
     * Name: backButtonPress
     * Description: Search Keyboard back button functionality
     *    should go to the previous screen from where keyboard was selected
     * Parameters:
     * @param {string} : None
     * Returns: None
     * Globals updated: None
     */
    var backButtonPress = function () {
        WT.Service.Afw.removeKeyboard();

        var prevScreen = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SEARCH_PREV_SCREEN);
        WT.Global.cacheStorage.removeItem(WT.Constant.cacheStorage.SEARCH_PREV_SCREEN);
        
        //Back transition animation flag
        WT.Global.backTransition = true;

        switch (prevScreen) {
            case WT.Constant.Route.DESTINATION.screenName :
            case WT.Constant.Route.DESTNOTAVAIL.screenName :
            case WT.Constant.Route.GENERICDEST.screenName :
                //$("#nav-dest").trigger("click");
                $("#nav-dest").trigger("mousedown");
                $("#nav-dest").trigger("mouseup");
                break;
            case WT.Constant.Route.SEARCHLIST.screenName :
                WT.Global.logger("WT::Searchkeyboard:backButtonPress to SearchList ",CI.Utils.Define.LOGSeverity.INFO);
                updateListBackground();
                WT.Route.location(WT.Constant.Route.SEARCHLIST.screenName);
                break;
            case WT.Constant.Route.SEARCHDETAILS.screenName :
                WT.Global.logger("WT::Searchkeyboard:backButtonPress to SearchDetails ",CI.Utils.Define.LOGSeverity.INFO);
                WT.Route.location(WT.Constant.Route.SEARCHDETAILS.screenName);
                break;
            case WT.Constant.Route.FAVOURITE.screenName :
                WT.Global.logger("WT::Searchkeyboard:backButtonPress to SearchDetails ",CI.Utils.Define.LOGSeverity.INFO);
                $("#nav-fav").trigger("mousedown");
                $("#nav-fav").trigger("mouseup");
                break;
            default:
                //$("#nav-myloc").trigger("click");
                $("#nav-myloc").trigger("mousedown");
                $("#nav-myloc").trigger("mouseup");
                break;
        }

    };

    /*
     * Name: yesCallBck
     * Description: When Pop-up yes is pressed, Keyboard shall show shown.
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */

    var yesCallBck = function () {
        //Show keyboard and remove pre-filled data
        WT.Global.logger("WT::searchKeyboardClass:yesCallBack", CI.Utils.Define.LOGSeverity.INFO);
        WT.Global.cacheStorage.removeItem(WT.Constant.cacheStorage.PRE_FILLED_KB_DATA);
        // don't call keyboard if already opened
        if (CI.UI.Common.Keyboard.isOpened) {
            WT.Global.logger("WT::searchKeyboardClass:yesCallBack remove and reopen keyboard", CI.Utils.Define.LOGSeverity.INFO);
            WT.Service.Afw.removeKeyboard();
        }
            WT.Service.Afw.showKeyboard("", kBSuccessPress, backButtonPress);
        
    };

    /*
     * Name: noCallBack
     * Description: When Pop up no is pressed , should redirect to current location screen 
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */
    var noCallBack = function () {
        //remove keyboard
        WT.Service.Afw.removeKeyboard();
        //go to current location page
        //$("#nav-myloc").trigger("click");
        WT.Global.logger("WT::searchKeyboardClass:noCallBack", CI.Utils.Define.LOGSeverity.INFO);
        $("#nav-myloc").trigger("mousedown");
        $("#nav-myloc").trigger("mouseup");
    };

    /*
     * Name: singleSearchSuccCall
     * Description: Single search success after validation Place the details in cache
     *              and Route to search Details
     * Parameters:
     * @param :
     * {object} - search object from APPD
     * Returns: None
     * Globals updated:
     * None 
     */
    var singleSearchSuccCall = function (searchDetails) {
        var searchedLocationId = null;
        WT.Global.logger("WT::search:singleSearchSuccCall:locationId: "+searchDetails.locationDetail.location.locationId, CI.Utils.Define.LOGSeverity.INFO);
        if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID)){
            searchedLocationId = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID);
            if ($("#loadingTitle").length && searchKeyboardClass.responseInProgress &&
                searchedLocationId == searchDetails.locationDetail.location.locationId) {
                searchKeyboardClass.responseInProgress = false;
                WT.Global.logger("WT::search:singleSearchSuccCall:route to search details: ", CI.Utils.Define.LOGSeverity.INFO);
                WT.Global.favDetailsScreen = false;
                WT.Route.location(WT.Constant.Route.SEARCHDETAILS.screenName);
            }
        }
        
    };

    /*
     * Name: listReqFailure
     * Description: Called when APPC failure for search call 
     *          Show unable to connect loading animation for 5 seconds and redirect back to keyboard
     *
     * Parameters:
     * @param :
     * {object} - error object from APPD
     * Returns: None
     * Globals updated: None
     */
    var listReqFailure = function (error) {
        //check if loading exists as back can be clicked any time.To handle asynchronous callback
        if ($("#loadingTitle").length) {
            WT.Global.logger("WT::searchKeyboardClass:listReqFailure", CI.Utils.Define.LOGSeverity.INFO);
            $("#loadingTitle").html(CI.Utils.Localization.translate("weat_Unable_connect"), "full-loading");
            WT.Global.timerConnectSearchKB = setTimeout(function () {
                WT.Service.Afw.showKeyboard(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.PRE_FILLED_KB_DATA), kBSuccessPress, backButtonPress);
                WT.Global.logger("WT::searchKeyboardClass:listReqFailure timerConnectSearchKB", CI.Utils.Define.LOGSeverity.INFO);
                WT.Global.stopLoading();
            }, WT.Constant.Api.DEFAULT_UPDATED_DISPLAY_TIMEOUT);
        }
    };

   /*
    * Name: singleSearchErrCall
    * Description: single Search Error Callback after/before validation 
           Call the list request failure case as its the same behaviour
    * Parameters:
    * @param : None
    * Returns: None
    * Globals updated: None
    */
    var singleSearchErrCall = function () {
        WT.Global.logger("WT::searchKeyboardClass:singleSearchErrCall", CI.Utils.Define.LOGSeverity.INFO);
        listReqFailure();
    };
   	/*
    * Name: listReqSuccess
    * Description: Called if success response(list) is received form APPD
    *     if there are no list elements show no matches pop up
    *     if more than 1 list element route to list page after caching elements
    *     if 1 list element show location wt details page
    *
    * Parameters:
    * @param :
    * {object} - list data from APPD
    * Returns: None
    * Globals updated:
    * searchKeyboardClass.responseInProgress
    */
    var listReqSuccess = function (listObject) {
        //Check if the field locations is available and request is matching with the response
        if ($("#loadingTitle").length && searchKeyboardClass.responseInProgress && ((typeof listObject.searchText !== 'undefined') && WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.PRE_FILLED_KB_DATA) === listObject.searchText) ) {
            WT.Global.logger("searchKeyboardClass:listReqSuccess i/p : o/p text are"+WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.PRE_FILLED_KB_DATA) +':'+listObject.searchText, CI.Utils.Define.LOGSeverity.INFO);
            if (listObject.locations) {
                if (typeof listObject.locations !== 'undefined' && listObject.locations.length > 0) {
                    if (listObject.locations.length === 1) {
                        //if one match do off-board call for 1 result with location id
                        WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID, listObject.locations[0].locationId);
                        WT.Global.logger("WT::searchKeyboardClass:listReqSuccess search list with single element", CI.Utils.Define.LOGSeverity.INFO);
                        WT.Global.searchLocation(singleSearchSuccCall, singleSearchErrCall);
                    } else {
                        searchKeyboardClass.responseInProgress = false;
                        WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.SEARCH_LIST_DETAILS, listObject);
                        WT.Global.logger("WT::searchKeyboardClass:listReqSuccess search list with multiple elements", CI.Utils.Define.LOGSeverity.INFO);
                        //background
                        updateListBackground();
                        WT.Route.location(WT.Constant.Route.SEARCHLIST.screenName);
                    }
                } else {
                    //show no matches found
                    searchKeyboardClass.responseInProgress = false;
                    WT.Global.stopLoading();
                    WT.Global.logger("WT::searchKeyboardClass:listReqSuccess search list with no Matches", CI.Utils.Define.LOGSeverity.INFO);
                    if (WT.Global.appShow === true) {
                        var popUpTitle = CI.Utils.Localization.translate("weat_Weather_search");
                        var popUpMsg = CI.Utils.Localization.translate("weat_Match_msg");
                        WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_DECISION, popUpTitle, popUpMsg, yesCallBck, noCallBack);
                    }
                }
            } else {
                //locations field is not available from response
                WT.Global.logger("WT::searchKeyboardClass:listReqSuccess search list request failure", CI.Utils.Define.LOGSeverity.INFO);
                listReqFailure();
            }
        }
    };
    /*
     * Name: currLocSuccess
     * Description: Current location is got successfully
            Send off-board call with lat and long
     *
     * Parameters:
     * @param :
     * {object} - location data from framework
     * Returns: None
     * Globals updated:
     * searchKeyboardClass.responseInProgress 
     */
    var currLocSuccess = function (locationData) {
        //get lat /long and pass for off-board call
        WT.Global.logger("WT::searchKeyboardClass:getCurrentLocation" + JSON.stringify(locationData), CI.Utils.Define.LOGSeverity.INFO);
        //off-board call
        searchKeyboardClass.responseInProgress = true;

        WT.Service.Api.getWTSearchList({latitude: locationData.latitude, longitude: locationData.longitude,
            retries: WT.Constant.Api.LOC_RETRY_COUNTER, searchKey: WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.PRE_FILLED_KB_DATA)},
        listReqSuccess, listReqFailure);
    };

    /*
     * Name: currLocError
     * Description: Current location is not received, now make off-board call W/O lat and long
     * Parameters:
     * @param :
     * {object} - location data from framework
     * Returns: None
     * Globals updated:
     * searchKeyboardClass.responseInProgress
     */
    var currLocError = function () {
        //pass for off-board call w/o lat/long
        searchKeyboardClass.responseInProgress = true;
        WT.Global.logger("WT::searchKeyboardClass:currLocError ", CI.Utils.Define.LOGSeverity.INFO);
        WT.Service.Api.getWTSearchList({retries: WT.Constant.Api.LOC_RETRY_COUNTER,
            searchKey: WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.PRE_FILLED_KB_DATA)}, listReqSuccess, listReqFailure);
    };

    /*
     * Name: connectivityCallBack

     * Description: Connectivity success call back fetch getCurrentlocation
     *              else show unable to connect for 5 seconds and redirect to keyboard
     *
     * Parameters:
     * @param : {string} : connectionAvailable/connectionNotAvailable
     * Returns: None
     * Globals updated: None
     */
    var connectivityCallBack = function (connStatus) {
        if ((typeof connStatus === "string") && connStatus === WT.Constant.connectionParam.CONNECTION_AVAILABLE) {
            //get current location
            WT.Global.logger("WT::searchKeyboardClass:connectivityCallBack success", CI.Utils.Define.LOGSeverity.INFO);
            WT.Global.startLoading(CI.Utils.Localization.translate("weat_Searching"), "full-loading");
            WT.Service.Afw.removeKeyboard();
            WT.Service.Afw.getCurrentLocation(currLocSuccess, currLocError);
        } else {
            WT.Global.logger("WT::searchKeyboardClass:connectivityCallBack unable to connect", CI.Utils.Define.LOGSeverity.INFO);
            WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), "full-loading");
            WT.Service.Afw.removeKeyboard();
            WT.Global.timerConnectSearchKB = setTimeout(function () {
                WT.Service.Afw.showKeyboard(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.PRE_FILLED_KB_DATA), kBSuccessPress, backButtonPress);
                WT.Global.stopLoading();
            }, WT.Constant.Api.DEFAULT_UPDATED_DISPLAY_TIMEOUT);
        }
    };

    /*
     * Name: userSettingsCallBack
     * Description: User connectivity call back fetch connectivity status
     *              else show data connection disabled pop up
     *
     * Parameters:
     * @param : {string} : dataEnabled/dataNotEnabled
     * Returns: None
     * Globals updated: None
     */
    var userSettingsCallBack = function (connValue) {
        if ((typeof connValue === "string") && connValue === WT.Constant.connectionParam.USER_CONNECTION_ENABLE) {
            WT.Service.Afw.getConnectivityStatus(connectivityCallBack);
        } else {
            //show pop-up that data connection disabled
            if (WT.Global.appShow === true) {
               WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"",CI.Utils.Localization.translate("weat_Data_noconnect"));
            }
        }
    };
    /*
     * Name: kBSuccessPress
     * Description: Call back from keyboard OK button press
     *   cache the entered string for retention in keyboard call user connectivity
     *
     * Parameters:
     * @param : {string} : entered String
     * Returns: None
     * Globals updated: None
     */
    var kBSuccessPress = function (enteredString) {
        WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.PRE_FILLED_KB_DATA, enteredString);
        WT.Global.logger("WT::searchKeyboardClass:kBSuccessPress enteredString "+enteredString, CI.Utils.Define.LOGSeverity.INFO);
        WT.Service.Afw.getUserConnectivitySettings(userSettingsCallBack);
    };


    /*
     * Name: initialisation
     * Description: Called when keyboard is launched set if any pre-filled data is required lest show place-holder
     *
     * Parameters:
     * @param : {string} : entered String
     * Returns: None
     * Globals updated: None 
    */
    this.initialisation = function(){
       var prefilledData = "";
        WT.Global.showSearchWTDetail = false;
        WT.Global.logger("WT::Searchkeyboard:initialisation",CI.Utils.Define.LOGSeverity.INFO);
        if (WT.Route.getPrevScreen() !== WT.Constant.Route.SETTINGS.screenName) {
            WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.SEARCH_PREV_SCREEN, WT.Route.getPrevScreen());
        }
        //Show pre-filled data
        if (WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.PRE_FILLED_KB_DATA)) {
            prefilledData = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.PRE_FILLED_KB_DATA);
            WT.Global.logger("WT::searchKeyboardClass:initialisation prefilledData "+prefilledData, CI.Utils.Define.LOGSeverity.INFO);

        }
        WT.Service.Afw.showKeyboard(prefilledData, kBSuccessPress, backButtonPress);
    };
};