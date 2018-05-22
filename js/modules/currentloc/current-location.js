/*
 * File Name: current-location.js
 * Description: Launch module to handle app initialization and launch process.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Deepika Basavaraju
 * Creation Date: 19 Jan 2018
 * Version : 1.0
 *
 * MODIFICATION RECORDS:
 * /


/*
 * @namespace
 * Javascript WT.Currentloc object, which is used for initialization of current location
 */
WT.Currentloc = WT.Currentloc || {};

//Global Variables
WT.Currentloc.refreshInProgress = false;

var currLocClass = function () {

    var currentLoc = this;
    var locWTDetailObj = new locWTDetailClass();

    currLocClass.updatedTime = "";
    currLocClass.firstTimeCachedLaunch = false;
    currLocClass.locationDetails = {};
    currLocClass.firstTimeDestLaunch = false;
    currentLoc.messageDisplayTimer = null;
    currentLoc.loadFavFromCloud = false;
    currentLoc.preFavLocId = "";

    /*
     * Name: setMessageDisplayTimer
     * Description: Private method to show updated WT date and time
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: refreshInProgress
     */

    var setMessageDisplayTimer = function () {

        if (currentLoc.messageDisplayTimer !== null) {

            clearTimeout(currentLoc.messageDisplayTimer);
            currentLoc.messageDisplayTimer = null;

        }

        currentLoc.messageDisplayTimer = setTimeout(function () {
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName &&
                    WT.Currentloc.refreshInProgress === true) {
                WT.Currentloc.refreshInProgress = false;
                locWTDetailObj.updateTimeDetails(currLocClass.locationDetails);
            }
        }, WT.Constant.Api.DEFAULT_UPDATED_DISPLAY_TIMEOUT);

    };

    /*
     * Name: checkUpdatedTime
     * Description: Public method which is called on updating current location details.
     *              Screen is dimmed if cached data is older than 1 hour.
     * Parameters:
     * @param : {object} : off board object from Appc
     * Returns: None
     * Globals updated: None
     */

    var checkUpdatedTime = function (locDetails) {
        if (locDetails.updatedDate !== WT.Global.getCurrentDate()) {
            $(".wt-info.screen").addClass('one-hr-old');
        } else {
            var timeDifference = WT.Global.getCurrentTimeDiff(locDetails.updatedTime);
            //Change the time difference in Milliseconds to hour
            var timeDiffHour = timeDifference / WT.Constant.Api.ONE_HOUR_IN_MILLISECOND;
            if (timeDiffHour > 1) {
                $(".wt-info.screen").addClass('one-hr-old');
            }
            else {
                $(".wt-info.screen").removeClass('one-hr-old');
            }
        }
    };

    /*
     * Name: updateDetails
     * Description: Public method to display updated time details or current
     *              location details.
     * Parameters:
     * @param : {object} : offboard object from Appc
     * Returns: None
     * Globals updated: None
     */

    this.updateDetails = function (locDetails) {
        checkUpdatedTime(locDetails);
        currLocClass.updatedTime = locDetails.updatedTime;
        if (currLocClass.firstTimeCachedLaunch) {
            $("#updateSpan").html(CI.Utils.Localization.translate("weat_Updating"));
            currLocClass.firstTimeCachedLaunch = false;
        } else {
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName && WT.Currentloc.refreshInProgress === false) {
                locWTDetailObj.updateTimeDetails(locDetails);
            }
        }
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName && WT.Currentloc.refreshInProgress === false) {
            locWTDetailObj.updateLocDetails(locDetails);
        }

    };


    //TODO::Header
    var fetchFavorite = function(locObj){
        //Load Favorites
        WT.Service.FavoriteHandler.checkFav(locObj,function(successObj){
            currentLoc.preFavLocId = locObj.locationDetail.location.locationId;
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName) {
                if(successObj === null){
                    $("#favIcon").attr("class","icon nonfav");
                }else{
                    $("#favIcon").attr("class","icon favselected");
                }

            }
        },function(){
                //TODO::disable click
                //set flag to fetch from cloud if connectivity lest show unfilled icon
                currentLoc.loadFavFromCloud = true;
        });
    };

    //TODO::Header
    var fetchDestinationData = function(){
        if (localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS)) {
            WT.Global.logger("CurrentLoc::localStorage " + WT.Constant.localStorage.DEST_DETAILS + " exists", CI.Utils.Define.LOGSeverity.TRACE);
        }else {
            if (currLocClass.firstTimeDestLaunch === true) {
                currLocClass.firstTimeDestLaunch = false;
                WT.Global.getDestination(WT.Constant.Api.DES_RETRY_COUNTER,
                        function () {
                            WT.Global.logger("CurrentLoc::getDestination Success CallBack", CI.Utils.Define.LOGSeverity.TRACE);
                        }, function () {
                    WT.Global.logger("CurrentLoc::getDestination Error CallBack", CI.Utils.Define.LOGSeverity.TRACE);
                });
            }
        }
    };

    /*
     * Name: validateDataSuccess
     * Description: Validation Success Call back to update details of current location
     *
     * Parameters:
     * @param : {object} : offboard object from Appc
     * Returns: None
     * Globals updated: refreshInProgress
     * Local Storage Variables updated:
     * WT-CURRENTWTDETAILS
     */
    var validateDataSuccess = function (locDetails) {
        WT.Global.logger("CurrentLoc::validateData" + JSON.stringify(locDetails), CI.Utils.Define.LOGSeverity.TRACE);
        localStorage.setItem(WT.Constant.localStorage.CURRENT_WT_DETAILS, JSON.stringify(locDetails));
        
        if(currentLoc.loadFavFromCloud && WT.Service.FavoriteHandler.loggedIn){
            currentLoc.loadFavFromCloud = false;
            WT.Service.FavoriteHandler.downloadFavorite(function(successObj){
                //Enable 
                WT.Service.FavoriteHandler.setFavDSM("WT-FAVDATA",successObj.value,function(success){
                    //data stored success     
                    WT.Global.cacheStorage.setItem("WT-favData", successObj.value);
                },function(){
                    //Data set error
                });
                //fetch favorite
                fetchFavorite(locDetails);
                //fetch destination
                fetchDestinationData();
            },function(){
                //Error from fav call enable fav
                fetchDestinationData();
            });
        }else{
            //Fav avilable fetch destination
            fetchDestinationData();
        }
        
        currLocClass.locationDetails = locDetails;
        WT.Currentloc.refreshInProgress = false;

        $("#currLocRefIcon").removeClass("rotate");
        currentLoc.updateDetails(locDetails);
        //fetch favorite
        //Check if location change then update fav
        if(currentLoc.preFavLocId !== locDetails.locationDetail.location.locationId){
            //fetch fav
            fetchFavorite(locDetails);
        }

        WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "currLocRefIcon");
    };

    /*
     * Name: validateDataError
     * Description: Validation error Call back show unable to connect
     *
     * Parameters:
     * @param : {object} : object after error validation
     * Returns: None
     * Globals updated: None
     */
    var validateDataError = function (errorCallBck) {
        WT.Global.logger("CurrentLoc::validateerror", CI.Utils.Define.LOGSeverity.TRACE);
        $("#currLocRefIcon").removeClass("rotate");
        $("#updateSpan").html(CI.Utils.Localization.translate("weat_Unable_connect"));
        checkUpdatedTime(currLocClass.locationDetails);
        setMessageDisplayTimer(); //Function to set popup display timer
        WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "currLocRefIcon");

    };
    /*
     * Name: geoLocReqSuccess
     * Description: Off Board success Call back validate received data
     *
     * Parameters:
     * @param : {object} : off board object from Appc
     * Returns: None
     * Globals updated: None
     */
    var geoLocReqSuccess = function (succResponse) {
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName && $("#currLocRefIcon").hasClass("rotate")) {
            WT.Global.validateResponseData(succResponse, validateDataSuccess,
                    validateDataError);
        }
    };

    /*
     * Name: geoLocReqError
     * Description: Off Board error Call back show unable to connect and start auto update
     *
     * Parameters:
     * @param : {object} : off board object from Appc
     * Returns: None
     * Globals updated: None
     * Local Storage Variables updated: None
     */
    var geoLocReqError = function (errResponse) {
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName && $("#currLocRefIcon").hasClass("rotate")) {
            $("#currLocRefIcon").removeClass("rotate");
            $("#updateSpan").html(CI.Utils.Localization.translate("weat_Unable_connect"));
            checkUpdatedTime(currLocClass.locationDetails);
            setMessageDisplayTimer(); //Function to set popup display timer
            WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "currLocRefIcon");
        }
    };

    /*
     * Name: currLocSuccess
     * Description: Current location Success Call back do off board call
     *
     * Parameters:
     * @param : {object} : current location object from framework
     * Returns: None
     * Globals updated: None
     * Local Storage Variables updated: None
     */
    var currLocSuccess = function (locationData) {
        WT.Global.logger("Afw::getCurrentLocation" + JSON.stringify(locationData), CI.Utils.Define.LOGSeverity.TRACE);
        WT.Global.logger("GenericLoc::LocValid", CI.Utils.Define.LOGSeverity.TRACE);
        WT.Service.Api.getLocationWTData({latitude: locationData.latitude, longitude: locationData.longitude,
            retries: WT.Constant.Api.LOC_RETRY_COUNTER},
        geoLocReqSuccess, geoLocReqError);
    };

    /*
     * Name: currLocError
     * Description: Current location error Call back show unable to connect and start auto update
     *
     * Parameters:
     * @param : {object} : current location object from framework
     * Returns: None
     * Globals updated: None
     * Local Storage Variables updated: None
     */
    var currLocError = function () {
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName && $("#currLocRefIcon").hasClass("rotate")) {
            $("#currLocRefIcon").removeClass("rotate");
            $("#updateSpan").html(CI.Utils.Localization.translate("weat_Cur_loc_not_avail"));
            checkUpdatedTime(currLocClass.locationDetails);
            setMessageDisplayTimer();
            WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "currLocRefIcon");
        }

    };

    /*
     * Name: connectivityStatusSucc
     * Description: Connectivity success call back fetch getCurrentLocSuccCall
     *              else subscribe connectivity and show unable to connect
     *
     * Parameters:
     * @param : {string} : connectionAvailable/connectionNotAvailable
     * Returns: None
     * Globals updated: None
     * Local Storage Variables updated: None
     */
    var connectivityStatusSucc = function (connStatus) {
        if ((typeof connStatus === "string") && connStatus === WT.Constant.connectionParam.CONNECTION_AVAILABLE) {
            WT.Service.Afw.getCurrentLocation(currLocSuccess, currLocError);
        }
        else {
            //this check to prevent background updation and unneccessary havoc
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName && $("#currLocRefIcon").hasClass("rotate")) {
                //subscribe Connectivity
                WT.Service.Afw.subscribeConnectivityStatus(function () {
                    $("#currLocRefIcon").trigger("click");
                    $("#currLocRefIcon").trigger("mousedown");
                    $("#currLocRefIcon").trigger("mouseup");
                    WT.Service.Afw.unSubscribeConnectivityStatus(function () {
                    });
                }, function () {

                });
                $("#currLocRefIcon").removeClass("rotate");
                $("#updateSpan").html(CI.Utils.Localization.translate("weat_Unable_connect"));
                checkUpdatedTime(currLocClass.locationDetails);
                setMessageDisplayTimer();
            }
        }
    };

    /*
     * Name: userConnectivitySettingsSucc
     * Description: User connectivity call back fetch connectivity status
     *              else show data connection disabled
     *
     * Parameters:
     * @param : {string} : dataenabled/datadisabled
     * Returns: None
     * Globals updated: None
     * Local Storage Variables updated: None
     */
    var userConnectivitySettingsSucc = function (connValue) {
        $("#updateSpan").html(CI.Utils.Localization.translate("weat_Updating"));
        if ((typeof connValue === "string") && connValue === WT.Constant.connectionParam.USER_CONNECTION_ENABLE) {
            $("#currLocRefIcon").addClass("rotate");
            WT.Service.Afw.getConnectivityStatus(connectivityStatusSucc);
        } else {
            //this check to prevent background updation and unneccessary havoc
            $("#currLocRefIcon").removeClass("rotate");
            $("#updateSpan").html(CI.Utils.Localization.translate("weat_Data_noconnect_disabled"));
            checkUpdatedTime(currLocClass.locationDetails);
            setMessageDisplayTimer();
        }
    };

    /*
     * Name: refreshIconClick
     * Description: Public method which is called during auto update and manual update .
     *              If error in connection status Unable to Connect is shown
     *              If current location not available Current location not available is shown
     *
     * Parameters: None
     * Returns: None
     * Globals updated: None
     * Local Storage Variables Updated
     *      WT-CURRENTWTDETAILS
     *      WT-DESTDETAILS
     */
    this.refreshIconClick = function () {
        WT.Global.logger("Afw::refreshIconClick", CI.Utils.Define.LOGSeverity.TRACE);
        currLocClass.locationDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));

        

        if (!WT.Currentloc.refreshInProgress) {
            //need to be updated for rotating animation
            WT.Global.logger("Afw::refreshInProgress" + WT.Currentloc.refreshInProgress, CI.Utils.Define.LOGSeverity.INFO);
            WT.Currentloc.refreshInProgress = true;
             WT.Service.Afw.sidePanelTriggerEvent();
            WT.Service.Afw.getUserConnectivitySettings(userConnectivitySettingsSucc);

        }
    };

    //TODO::Header
    this.favIconClick = function(obj,alreadyLogIn){
        
        //add favorite since common finction
        function addFav(favoriteData){
            $("#favIcon").attr("class","icon update rotate");
               //$("#favIcon").attr("class","icon favselected");
               WT.Service.FavoriteHandler.addFavorite(favoriteData,function(){
                    if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName && $("#favIcon").hasClass("rotate")) {
                        $("#favIcon").attr("class","icon favselected");
                    }
               },function(error){
                    if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName && $("#favIcon").hasClass("rotate")) {
                        if(error === "listFull"){
                             WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"",CI.Utils.Localization.translate("weat_Fav_full_msg"));
                             $("#favIcon").attr("class","icon nonfav");
                        }else{
                            WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"",CI.Utils.Localization.translate("weat_Not_fav_added", {'PARAM0': favoriteData.locationDetail.location.name}));
                            $("#favIcon").attr("class","icon nonfav");
                        }
                    }
               });
        }

        //Delete Fav
        function deleteFav(favoriteData){
            $("#favIcon").attr("class","icon update rotate");
            WT.Service.FavoriteHandler.deleteFavorite(favoriteData.locationDetail.location.locationId,function(){
                if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName && $("#favIcon").hasClass("rotate")) {
                    $("#favIcon").attr("class","icon nonfav");
                }
            },function(){
                if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName && $("#favIcon").hasClass("rotate")) {
                    WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"", CI.Utils.Localization.translate("weat_Not_fav_del", {'PARAM0': favoriteData.locationDetail.location.name}));
                    $("#favIcon").attr("class","icon favselected");
                }
            });
        }

        function downloadFavAndCheckFav(favoriteData){
            WT.Service.FavoriteHandler.downloadFavorite(function(successObj){
                //Enable 
                WT.Service.FavoriteHandler.setFavDSM("WT-FAVDATA",successObj.value,function(success){
                    //data stored success     
                    WT.Global.cacheStorage.setItem("WT-favData", successObj.value);
                    //fetch favorite
                    //Check if already favorite before adding
                    WT.Service.FavoriteHandler.checkFav(favoriteData,function(successObj){
                    currentLoc.preFavLocId = favoriteData.locationDetail.location.locationId;
                        if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName) {
                            if(successObj === null){
                                $("#favIcon").attr("class","icon nonfav");
                            }else{
                                $("#favIcon").attr("class","icon favselected");
                            }
                            //Check if non-fav add otherwise donot do anything
                            if($(obj).hasClass("nonfav")){
                               //add favorite if not added already
                               addFav(favoriteData);
                            }
                        }
                    },function(){

                        currentLoc.loadFavFromCloud = true;
                        WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"", CI.Utils.Localization.translate("weat_Not_fav_added", {'PARAM0': favoriteData.locationDetail.location.name}));
                        $("#favIcon").attr("class","icon nonfav");
                    });
                },function(){
                    //Data set error
                });
            },function(){
                currentLoc.loadFavFromCloud = true;
                WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"", CI.Utils.Localization.translate("weat_Not_fav_added", {'PARAM0': favoriteData.locationDetail.location.name}));
                $("#favIcon").attr("class","icon nonfav");
            });
        }

        if(alreadyLogIn === "alreadyLoggedIn"){
            //check if fav
            favoriteData = JSON.parse(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
            if($(obj).hasClass("nonfav")){
                addFav(favoriteData);                
            }else if($(obj).hasClass("favselected")){
                deleteFav(favoriteData);
            }else{
                //add Log
            }
        }else{
            favoriteData = JSON.parse(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));

            //Check if already favorite before adding
            WT.Service.FavoriteHandler.checkFav(favoriteData,function(successObj){
            currentLoc.preFavLocId = favoriteData.locationDetail.location.locationId;
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.CURRLOC.screenName) {
                if(successObj === null){
                    $("#favIcon").attr("class","icon nonfav");
                }else{
                    $("#favIcon").attr("class","icon favselected");
                }
                //Check if non-fav add otherwise donot do anything
                if($(obj).hasClass("nonfav")){
                   //add favorite if not added already
                   addFav(favoriteData);
                }
            }
            },function(){
                    //TODO::disable click
                    //set flag to fetch from cloud if connectivity lest show unfilled icon
                    downloadFavAndCheckFav(favoriteData);
            });
        }
    };
    
    /*
     * Name: WT.Global.locForecastClick
     * Description: Public method which is used to redirect to 24 hour/ 5 day page when current location detail is clicked

     * Parameters:
     * @param :
     * None
     * Returns: None
     * Globals updated: None
    */

    this.locForecastClick = function () {
        // waiting for update to complete
        if (!WT.Currentloc.refreshInProgress && !($("#favIcon").hasClass("rotate"))) {
            WT.Route.location(WT.Constant.Route.FORECAST.screenName);
        }       

    };

    /*
     * Name: initialisation
     * Description: Public method which does the initialization during launch of current location.
     *      fetches previous screen details
     *      fetches current location details from local storage
     *      updateDetails to show current location details
     *      refreshIconClick is triggered for update of current location details
     * Parameters:None
     * Returns: None
     * Globals updated: None
     */

    this.initialisation = function () {

        WT.Currentloc.refreshInProgress = false;
        $("#currentRefIcon").removeClass("rotate");
        $("#favIcon").attr("class","icon nonfav");

        if (WT.Route.getPrevScreen() === "") {
            //App Launch
            currLocClass.firstTimeCachedLaunch = true;
            currLocClass.firstTimeDestLaunch = true;
            if (localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS)) {
                currLocClass.locationDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
                this.updateDetails(currLocClass.locationDetails);
                fetchFavorite(currLocClass.locationDetails);
            }
            this.refreshIconClick();
        } else if (WT.Route.getPrevScreen() === WT.Constant.Route.GENERICLOC.screenName) {
            //From Generic Current Location
            if (localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS)) {
                currLocClass.locationDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
                this.updateDetails(currLocClass.locationDetails);
                WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "currLocRefIcon");
                fetchFavorite(currLocClass.locationDetails);
            } else {
                this.refreshIconClick();
            }

        } else {
            if (localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS)) {
                currLocClass.locationDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
                var timeDiff = WT.Global.getCurrentTimeDiff((currLocClass.locationDetails.updatedTime).toString());
                this.updateDetails(currLocClass.locationDetails);
                fetchFavorite(currLocClass.locationDetails);
                if (currLocClass.locationDetails.updatedDate === WT.Global.getCurrentDate()) {
                    if (timeDiff > WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT) {
                        this.refreshIconClick();
                    } else {
                        var timeToUpdate = WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT - timeDiff;
                        WT.Service.AutoUpdate.startTimer(timeToUpdate, "currLocRefIcon");

                    }
                } else {
                    this.refreshIconClick();
                }
            } else {
                this.refreshIconClick();
            }
        }
    };

};