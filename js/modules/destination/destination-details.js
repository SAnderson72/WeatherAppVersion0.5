/*
 * File Name: destination-details.js
 * Description: Destination screen handled here
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Deepika Basavaraju
 * Creation Date: 31 Jan 2018
 * Version : 1.0
 *
 * MODIFICATION RECORDS:
 * /
 
/*
 * Name: WT.Destination
 * Description:  @namespace
 *               Javascript WT.Destination object, which is used for initialization of destination
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */
WT.Destination = {};

//Global varible
WT.Destination.refreshInProgress = false;

var destClass = function () {

    var destination = this;

//Injecting current location class
    var locWTDetailObj = new locWTDetailClass();

//Global varible to store destination details
    destClass.locationDetails = {};
    destClass.autoTriggerUpdate = false;
    destClass.loadFavFromCloud = false;
    /*
     * Name: checkUpdatedTime
     * Description: Public method which is called on updating current location details.
     *              Screen is dimmed if cached destination data is older than 10 minutes.
     * Parameters:
     * @param : WTdata of Destination location
     * Returns: None
     * Globals updated: None
     */

    var checkUpdatedTime = function (destDetails) {
        if (destDetails.updatedDate !== WT.Global.getCurrentDate()) {
            $(".wt-info.screen").addClass('one-hr-old');
        }else{
            var timeDifference = WT.Global.getCurrentTimeDiff(destDetails.updatedTime);
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
     * Name: setMessageDisplayTimer
     * Description: Public method to show updated WT date and time
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     * Tables updated: None
     */

    var setMessageDisplayTimer = function () {
        if (destination.messageDisplayTimer !== null) {
            clearTimeout(destination.messageDisplayTimer);
            destination.messageDisplayTimer = null;
        }
        destination.messageDisplayTimer = setTimeout(function () {
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName && WT.Destination.refreshInProgress === true) {
               WT.Destination.refreshInProgress = false;
               locWTDetailObj.updateTimeDetails(destClass.locationDetails);
            }
        }, WT.Constant.Api.DEFAULT_UPDATED_DISPLAY_TIMEOUT);
    };

    //TODO::Header
    var fetchFavorite = function(locObj){
        //Load Favorites
        WT.Service.FavoriteHandler.checkFav(locObj,function(successObj){
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName) {
                if(successObj === null){
                    $("#favIcon").attr("class","icon nonfav");
                }else{
                    $("#favIcon").attr("class","icon favselected");
                }
            }
        },function(){
            //TODO::disable click
            //set flag to fetch from cloud if connectivity lest show unfilled icon
            destClass.loadFavFromCloud = true;
        });
    };
    /*
     * Name: updateDestDetails
     * Description: Update destination details
     *              10 minutes fade out
     *              update Time details and location details
     *
     * Parameters:
     * @param :{object} - destination object from local storage
     * Returns: None
     * Globals updated: destClass.autoTriggerUpdate
     */

    this.updateDestDetails = function (destDetails) {

        checkUpdatedTime(destDetails);
        $("#nowSpan").html(CI.Utils.Localization.translate("weat_Now"));
        $("#ArrivalSpan").html(CI.Utils.Localization.translate("weat_Arrival"));
        if (destClass.autoTriggerUpdate) {
            $("#updateSpan").html(CI.Utils.Localization.translate("weat_Updating"));
            destClass.autoTriggerUpdate = false;
        } else {
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName && WT.Destination.refreshInProgress === false) {
               locWTDetailObj.updateTimeDetails(destDetails);
            }
        }
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName && WT.Destination.refreshInProgress === false) {
            this.updateLocDetails(destDetails);
        }

    };

    /*
     * Name: getDestSuccCall
     * Description: get Destination success Call Back ,update the details in DOM
     *
     * Parameters:
     * @param : {object} - destination object from APPC
     * Returns: None
     * Globals updated: destClass.autoTriggerUpdate
     */

    var getDestSuccCall = function (destDetails) {
        //Success Call Back
        //this check to prevent background updation and unneccessary havoc
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName && $("#currLocRefIcon").hasClass("rotate")) {
            WT.Destination.refreshInProgress = false;
            $("#currLocRefIcon").removeClass("rotate");
            destClass.locationDetails = destDetails;
            if (WT.Route.getCurrentScreen() === "destination") {
                destination.updateDestDetails(destDetails);
                if(destClass.loadFavFromCloud && WT.Service.FavoriteHandler.loggedIn){
                    destClass.loadFavFromCloud = false;
                    WT.Service.FavoriteHandler.downloadFavorite(function(successObj){
                    //Enable 
                    WT.Service.FavoriteHandler.setFavDSM("WT-FAVDATA",successObj.value,function(success){
                        //data stored success     
                        WT.Global.cacheStorage.setItem("WT-favData", successObj.value);
                        },function(){
                            //Data set error
                        });
                        //fetch favorite
                        fetchFavorite(destClass.locationDetails);
                    },function(){
                    //Error from fav call enable fav
                
                    });
                }
            }

            WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "currLocRefIcon");
        }
    };

    /*
     * Name: getDestErrCall
     * Description: get destination errr call back - show unable to connect
     *
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: WT.Destination.refreshInProgress
     */

    var getDestErrCall = function () {
        //Error Call Back
        //this check to prevent background updation and unneccessary havoc
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName && $("#currLocRefIcon").hasClass("rotate")) {
            $("#currLocRefIcon").removeClass("rotate");
            $("#updateSpan").html(CI.Utils.Localization.translate("weat_Unable_connect"));
            checkUpdatedTime(destClass.locationDetails);
            setMessageDisplayTimer();
            WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "currLocRefIcon");
        }
    };

    /*
     * Name: WT.Destination.connectivityCallBack
     * Description: connection success call offboard callback
     *              if not show unable to connect
     *
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated:
     * WT.Destination.autoTriggerUpdate
     */

    var connectivityCallBack = function (connStatus) {
        if ((typeof connStatus === "string") && connStatus === WT.Constant.connectionParam.CONNECTION_AVAILABLE) {
            //offboard call
            WT.Global.getDestination(WT.Constant.Api.LOC_RETRY_COUNTER, getDestSuccCall,
                    getDestErrCall);
        } else {
            //this check to prevent background updation and unneccessary havoc
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName && $("#currLocRefIcon").hasClass("rotate")) {
                //subscribe Connectivity
                WT.Service.Afw.subscribeConnectivityStatus(function () {
                    //$("#currLocRefIcon").trigger("click");
                    $("#currLocRefIcon").trigger("mousedown");
                    $("#currLocRefIcon").trigger("mouseup");
                    WT.Service.Afw.unSubscribeConnectivityStatus(function () {
                    });
                }, function () {
                    //Do nothing as of now
                });

                $("#currLocRefIcon").removeClass("rotate");
                $("#updateSpan").html(CI.Utils.Localization.translate("weat_Unable_connect"));
                checkUpdatedTime(destClass.locationDetails);
                setMessageDisplayTimer();
            }
        }
    };

    /*
     * Name: userConnectivityCallBack
     * Description: userConnectivity call back call connectivity
     *              if not show connection disabled
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated:
     * WT.Destination.autoTriggerUpdate
     */

    var userConnectivityCallBack = function (connValue) {
        $("#updateSpan").html(CI.Utils.Localization.translate("weat_Updating"));
        if ((typeof connValue === "string") && connValue === WT.Constant.connectionParam.USER_CONNECTION_ENABLE) {
            $("#currLocRefIcon").addClass("rotate");
            WT.Service.Afw.getConnectivityStatus(connectivityCallBack);
        } else {
            //this check to prevent background updation and unneccessary havoc
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName && WT.Destination.refreshInProgress === true) {
                $("#updateSpan").html(CI.Utils.Localization.translate("weat_Data_noconnect_disabled"));
                checkUpdatedTime(destClass.locationDetails);
                setMessageDisplayTimer();
            }
        }
    };

    /*
     * Name: manualUpdate
     * Description: Public method which shall be called on manualUpdate and autoUpdate of destination
     *              Summary :
     *                 User connectivity check call back
     * Parameters:
     * @param : {object} - destination object from APPC
     * Returns: None
     * Globals updated: None
     */


    this.manualUpdate = function () {

        WT.Global.logger("destClass::manualUpdate", CI.Utils.Define.LOGSeverity.TRACE);
        destClass.locationDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS));
        if (!WT.Destination.refreshInProgress) {
            //need to be updated for rotating animation
            WT.Destination.refreshInProgress = true;
            WT.Service.Afw.sidePanelTriggerEvent();
            WT.Service.Afw.getUserConnectivitySettings(userConnectivityCallBack);
        }
    };

    /*
     * Name: updateBackground
     * Description: Public method which is called to reflect background w.r.t feed data.
     *              
     * Parameters:
     * @paarm : {number} weatherIcon is used to map distinct weather states to graphics
     * Returns: None
     * Globals updated: None
     * 
     */
    this.updateBackground = function (weatherIcon) {
        WT.Global.logger("WTDetail::updateBackground() Entered with Icon: "+weatherIcon, CI.Utils.Define.LOGSeverity.TRACE);
        // iconTyppe is used to map distinct weather states to background graphics
        WT.Global.updateBackgroundTheme(weatherIcon, function(current_theme){
            $("#container").addClass(current_theme+"_dest");   
        });
    };

    /*
     * Name: updateIcon
     * Description: Public method which is called to reflect icon w.r.t feed data.
     *              
     * Parameters:  
     * @paarm : {number} weatherIcon is used to map distinct weather states to graphics
     * @param : {function} call back to customize the icon
     * Returns: None
     * Globals updated: None
     * 
     */
    this.updateIcon = function (weatherIcon, id){
        locWTDetailObj.fetchIconTheme(weatherIcon,function(iconToDisplay){
                $(id).attr("class","startDestTempLeft "+iconToDisplay+"");
        }); 
    };
    /*
     * Name: updateLocDetails
     * Description: Public method which is called on updating static texts
     *              corresponding to current location details.
     * Parameters:
     * @param : WTdata of Current location
     * Returns: None
     * Globals updated: None
     */
    this.updateLocDetails = function (locDetails) {
        WT.Global.logger("WTDestDetail::updateLocDetails() calls updateBackground()", CI.Utils.Define.LOGSeverity.TRACE);
        var updateTimer = 0;
        //update background details
        this.updateBackground(locDetails.locationDetail.today.weatherIcon);
        //update icon details
        this.updateIcon(locDetails.locationDetail.today.weatherIcon,"#destThemeIcon");
        $('#locationSpan').html(locDetails.locationDetail.location.name); 

        wtKeyTemperature=Math.round(locDetails.locationDetail.today.temperature.current.value)+"&#176;"+locDetails.locationDetail.today.temperature.current.unit;
        $('#currentTemp').html(wtKeyTemperature);  

        WT.Global.translateWeatherText("#weatherStatus span", locDetails.locationDetail.today.weatherIcon);  
        if(locDetails.locationDetail.futureHour){
            arrivalTempValue = locDetails.locationDetail.futureHour.temperature.forecast.value;
            arrivalWeatherIcon = locDetails.locationDetail.futureHour.weatherIcon;
        }else{
            arrivalTempValue = locDetails.locationDetail.today.temperature.current.value;
            arrivalWeatherIcon = locDetails.locationDetail.today.weatherIcon;
        }
        wtKeyTemperature=Math.round(arrivalTempValue)+"&#176;"+locDetails.locationDetail.today.temperature.current.unit;
        $('#currentTemp_arrival').html(wtKeyTemperature);

        this.updateIcon(arrivalWeatherIcon,"#destArriveThemeIcon");  

        WT.Global.translateWeatherText("#weatherStatus_arrival span", arrivalWeatherIcon);      

    };  


    //TODO::Header
    this.favIconClick = function(obj,alreadyLogIn){
        
        //add favorite since common finction
        function addFav(favoriteData){
            $("#favIcon").attr("class","icon update rotate");
               //$("#favIcon").attr("class","icon favselected");
               WT.Service.FavoriteHandler.addFavorite(favoriteData,function(){
                    if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName && $("#favIcon").hasClass("rotate")) {
                        $("#favIcon").attr("class","icon favselected");
                    }
               },function(error){
                    //TODO:: Show unable to connect
                    if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName && $("#favIcon").hasClass("rotate")) {
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
                if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName && $("#favIcon").hasClass("rotate")) {
                    $("#favIcon").attr("class","icon nonfav");
                }
            },function(){
                if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName && $("#favIcon").hasClass("rotate")) {
                    WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"", CI.Utils.Localization.translate("weat_Not_fav_del", {'PARAM0': favoriteData.locationDetail.location.name}));
                    $("#favIcon").attr("class","icon favselected");
                }
            });
        }

        //download fav and check if fav
        function downloadFavAndCheckFav(favoriteData){
            WT.Service.FavoriteHandler.downloadFavorite(function(successObj){
                //Enable 
                WT.Service.FavoriteHandler.setFavDSM("WT-FAVDATA",successObj.value,function(success){
                    //data stored success     
                    WT.Global.cacheStorage.setItem("WT-favData", successObj.value);
                    //fetch favorite
                    //Check if already favorite before adding
                    WT.Service.FavoriteHandler.checkFav(favoriteData,function(successObj){
                        if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName) {
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
                        destClass.loadFavFromCloud = true;
                        WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"", CI.Utils.Localization.translate("weat_Not_fav_added", {'PARAM0': favoriteData.locationDetail.location.name}));
                        $("#favIcon").attr("class","icon nonfav");
                    });
                },function(){
                    //Data set error
                });
            },function(){
                destClass.loadFavFromCloud = true;
                WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"", CI.Utils.Localization.translate("weat_Not_fav_added", {'PARAM0': favoriteData.locationDetail.location.name}));
                $("#favIcon").attr("class","icon nonfav");
            });
        }

        if(alreadyLogIn === "alreadyLoggedIn"){
            //check if fav
           favoriteData = JSON.parse(localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS));
            if($(obj).hasClass("nonfav")){
                addFav(favoriteData);                
            }else if($(obj).hasClass("favselected")){
                deleteFav(favoriteData);
            }else{
                //add Log
            }
        }else{
            favoriteData = JSON.parse(localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS));

            //Check if already favorite before adding
            WT.Service.FavoriteHandler.checkFav(favoriteData,function(successObj){
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTINATION.screenName) {
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

    /* Name: WT.Destination.locForecastClick
     * Description: Public method which is used to redirect to 24 hour/ 5 day page when destination location detail is clicked

     * Parameters:
     * @param :
     * None
     * Returns: None
     * Globals updated: None
     */

    this.locForecastClick = function () {
        // waiting for update to complete
        if (!WT.Destination.refreshInProgress && !($("#favIcon").hasClass("rotate"))) {
            WT.Route.location(WT.Constant.Route.FORECAST.screenName);
        }       

    };
    /*
     * Name: WT.Destination.initialisation
     * Description: Public method which shall be called on initialisation of the destination screen.
     *              Summary :
     *               Should contain default configuartion whether to launch destination not avaiable
     *                or destination available screen
     *                Static data localisation and binding to view
     *               call the updation functionality
     *
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */


    this.initialisation = function () {

        if (WT.Route.getCurrentScreen() === WT.Constant.Route.DESTNOTAVAIL.screenName) {
            $("#nodestination").html(CI.Utils.Localization.translate("weat_Dest_msg"));
            //back ground
            if(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS)){
                var locationDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
                this.updateBackground(locationDetails.locationDetail.today.weatherIcon);
            }else{
                //Show grtadient image
                $("#container").attr("class", "container dest-background");
            }
            
        } else {
            //destination Launch
            WT.Destination.refreshInProgress = false;
            $("#currentRefIcon").removeClass("rotate");
            $("#favIcon").attr("class","icon nonfav");

            $("#nowSpan").html(CI.Utils.Localization.translate("weat_Now"));
            if (WT.Route.getPrevScreen() === WT.Constant.Route.GENERICDEST.screenName) {
                //when launching from generic destination launch
                destClass.locationDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS));
                this.updateDestDetails(destClass.locationDetails);
                fetchFavorite(destClass.locationDetails);
                WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "currLocRefIcon");
            } else {
                //from other screens
                if (localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS)) {
                    destClass.locationDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS));
                    var timeDiff = WT.Global.getCurrentTimeDiff(destClass.locationDetails.updatedTime);
                    if (destClass.locationDetails.updatedDate === WT.Global.getCurrentDate()) {
                        if (timeDiff > WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT) {
                            destClass.autoTriggerUpdate = true;
                            this.updateDestDetails(destClass.locationDetails);
                            fetchFavorite(destClass.locationDetails);
                            this.manualUpdate();
                        } else {
                            var timeToUpdate = WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT - timeDiff;
                            this.updateDestDetails(destClass.locationDetails);
                            fetchFavorite(destClass.locationDetails);
                            WT.Service.AutoUpdate.startTimer(timeToUpdate, "currLocRefIcon");
                        }
                    } else {
                        this.updateDestDetails(destClass.locationDetails);
                        fetchFavorite(destClass.locationDetails);
                        this.manualUpdate();
                    }
                } else {
                    this.manualUpdate();
                }
            }
        }
    };

};



