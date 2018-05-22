/*
 * File Name: search-details.js
 * Description: Search List module to handle keyboard search result and launch WT-Detail Page.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Vinny V
 * Creation Date: 08 Februrary, 2018
 * MODIFICATION RECORDS:
 * 
 */

WT.SearchDetail = WT.SearchDetail || {};

//Global variable
WT.SearchDetail.refreshInProgress = false;

var searchDetailClass = function () {
    
    //Injecting current location class
    var locWTDetailObj = new locWTDetailClass();
    //Private Variable
    var searchDetail = this;

    //Global variable to store Search details
    searchDetailClass.locationDetails = {};
    searchDetailClass.loadFavFromCloud = false;
    searchDetailClass.preFavLocId = "";
    
    /*
     * Name: WT.Global.locForecastClick
     * Description: Public method which is used to redirect to 24 hour/ 5 day page when search detail is clicked
     * Parameters: None
     * @param : None
     * Returns: None
     * Globals updated: None
    */

    this.locForecastClick = function () {
       // waiting for update to complete
       if (!WT.SearchDetail.refreshInProgress && !($("#favIcon").hasClass("rotate"))) {
            WT.Route.location(WT.Constant.Route.FORECAST.screenName);
        }       
    }; 


    //TODO::Header
    this.favIconClick = function(obj,alreadyLogIn){
        
        //add favorite since common finction
        function addFav(favoriteData){
            $("#favIcon").attr("class","icon update rotate");
               //$("#favIcon").attr("class","icon favselected");
               WT.Service.FavoriteHandler.addFavorite(favoriteData,function(){
                    if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHDETAILS.screenName && $("#favIcon").hasClass("rotate")) {
                        $("#favIcon").attr("class","icon favselected");
                    }
               },function(error){
                    //TODO:: Show unable to connect
                    if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHDETAILS.screenName && $("#favIcon").hasClass("rotate")) {
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
                if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHDETAILS.screenName && $("#favIcon").hasClass("rotate")) {
                    $("#favIcon").attr("class","icon nonfav");
                }
            },function(){
                if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHDETAILS.screenName && $("#favIcon").hasClass("rotate")) {
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
                        if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHDETAILS.screenName) {
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
                        searchDetailClass.loadFavFromCloud = true;
                        WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"", CI.Utils.Localization.translate("weat_Not_fav_added", {'PARAM0': favoriteData.locationDetail.location.name}));
                        $("#favIcon").attr("class","icon nonfav");
                    });
                },function(){
                    //Data set error
                });
            },function(){
                searchDetailClass.loadFavFromCloud = true;
                WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"", CI.Utils.Localization.translate("weat_Not_fav_added", {'PARAM0': favoriteData.locationDetail.location.name}));
                $("#favIcon").attr("class","icon nonfav");
            });
        }

        //already logged in directly add or delete
        if(alreadyLogIn === "alreadyLoggedIn"){
            //check if fav
            favoriteData = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SEARCH_DETAILS);
            if($(obj).hasClass("nonfav")){
                addFav(favoriteData);                
            }else if($(obj).hasClass("favselected")){
                deleteFav(favoriteData);
            }else{
                //add Log
            }
        }else{
            favoriteData = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SEARCH_DETAILS);

            //Check if already favorite before adding
            WT.Service.FavoriteHandler.checkFav(favoriteData,function(successObj){
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHDETAILS.screenName) {
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
     * Name: checkUpdatedTime
     * Description: Public method which is called on updating search location details.
     *              Screen is dimmed if cached data is older than 1 hour.
     * Parameters:
     * @param : WTdata of Destination location
     * Returns: None
     * Globals updated: None
     */

    var checkUpdatedTime = function (searchDetails) {
        WT.Global.logger("WT::SearchDetail checkUpdatedTime", CI.Utils.Define.LOGSeverity.INFO);
        if (searchDetails.updatedDate !== WT.Global.getCurrentDate()){
            $(".wt-info.screen").addClass('one-hr-old');
        }else{
            var timeDifference = WT.Global.getCurrentTimeDiff(searchDetails.updatedTime);
            var timeDiffHour = timeDifference / WT.Constant.Api.ONE_HOUR_IN_MILLISECOND;
            if (timeDiffHour > 1) {
                $(".wt-info.screen").addClass('one-hr-old');
            } else {
                $(".wt-info.screen").removeClass('one-hr-old');
            }
        }
    };


    //TODO::Header
    var fetchFavorite = function(locObj){
        //Load Favorites
        WT.Service.FavoriteHandler.checkFav(locObj,function(successObj){
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHDETAILS.screenName) {
                if(successObj === null){
                    $("#favIcon").attr("class","icon nonfav");
                }else{
                    $("#favIcon").attr("class","icon favselected");
                }
            }
        },function(){
            
        });
    };

    /*
     * Name: updateSearchDetails
     * Description: Update search details
     *              10 minutes fade out
     *              update Time details and location details
     *
     * Parameters:
     * @param :{object} - location object from APPD
     * Returns:None
     * Globals updated:
     * locWTDetailObj.updateTimeDetails
     * locWTDetailObj.updateLocDetails
     * Local Storage Variables updated:None
     */

    this.updateSearchDetails = function (searchDetails) {
        WT.Global.logger("WT::SearchDetail updateSearchDetails", CI.Utils.Define.LOGSeverity.INFO);
        checkUpdatedTime(searchDetails);
        locWTDetailObj.updateTimeDetails(searchDetails);
        locWTDetailObj.updateLocDetails(searchDetails);
        if(searchDetailClass.loadFavFromCloud && WT.Service.FavoriteHandler.loggedIn){
            searchDetailClass.loadFavFromCloud = false;
            WT.Service.FavoriteHandler.downloadFavorite(function(successObj){
                //Enable 
                WT.Service.FavoriteHandler.setFavDSM("WT-FAVDATA",successObj.value,function(success){
                    //data stored success     
                    WT.Global.cacheStorage.setItem("WT-favData", successObj.value);
                },function(){
                    //Data set error
                });
                //fetch favorite
                fetchFavorite(searchDetails);
            },function(){
                
            });
        }
    };
    
    /*
     * Name: searchSuccCall
     * Description: get search success Call Back ,update the details in DOM
     *
     * Parameters:
     * @param : {object} - location object from APPD
     * Returns:None
     * Globals updated:
     *                 searchDetailClass.locationDetails
     *                 WT.SearchDetail.refreshInProgress
     *                 currLocRefIcon
     * Local Storage Variables updated:None
     */

    var searchSuccCall = function (searchDetails) {
        //Success Call Back
        WT.Global.logger("WT::SearchDetail searchSuccCall", CI.Utils.Define.LOGSeverity.INFO);
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHDETAILS.screenName &&
            $("#currLocRefIcon").hasClass("rotate")) {
            WT.SearchDetail.refreshInProgress = false;
            $("#currLocRefIcon").removeClass("rotate");
            searchDetailClass.locationDetails = searchDetails;
            searchDetail.updateSearchDetails(searchDetailClass.locationDetails);
            WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "currLocRefIcon");
        }


    };

    /*
     * Name: searchErrCall
     * Description: get search errr call back - show unable to connect
     *
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated:
     * WT.SearchDetail.refreshInProgress
     * Local Storage Variables updated:None
     */

    var searchErrCall = function () {
        //Error Call Back
        WT.Global.logger("WT::SearchDetail searchErrCall", CI.Utils.Define.LOGSeverity.INFO);
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHDETAILS.screenName &&
            $("#currLocRefIcon").hasClass("rotate")) {
                $("#currLocRefIcon").removeClass("rotate");
                $("#updateSpan").html(CI.Utils.Localization.translate("weat_Unable_connect"));
                checkUpdatedTime(searchDetailClass.locationDetails);
            setTimeout(function () {
                if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHDETAILS.screenName && WT.SearchDetail.refreshInProgress === true) {
                    WT.SearchDetail.refreshInProgress = false;
                    locWTDetailObj.updateTimeDetails(searchDetailClass.locationDetails);
                }
            }, WT.Constant.Api.DEFAULT_UPDATED_DISPLAY_TIMEOUT);

            WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "currLocRefIcon");
        }
    };

    /*
     * Name: connectivityCallBack
     * Description: connection success call offboard callback
     *              if not show unable to connect loading animation
     *
     * Parameters:
     * @param :None
     * Returns:None
     * Globals updated:None
     * Local Storage Variables updated:None
     */

    var connectivityCallBack = function (connStatus) {
        WT.Global.logger("WT::searchKeyboardClass:connectivityCallBack ", CI.Utils.Define.LOGSeverity.INFO,+"-"+connStatus);
        $("#updateSpan").html(CI.Utils.Localization.translate("weat_Updating"));
        if ((typeof connStatus === "string") && connStatus === WT.Constant.connectionParam.CONNECTION_AVAILABLE) {
            $("#currLocRefIcon").addClass("rotate");
            WT.Global.searchLocation(searchSuccCall, searchErrCall);
        } else {
            //this check to prevent background updation and unneccessary havoc
            $("#updateSpan").html(CI.Utils.Localization.translate("weat_Updating"));

            if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHDETAILS.screenName && $("#currLocRefIcon").hasClass("rotate")) {
                //subscribe Connectivity
                WT.Service.Afw.subscribeConnectivityStatus(function () {
                    $("#currLocRefIcon").trigger("mousedown");
                    $("#currLocRefIcon").trigger("mouseup");
                    WT.Service.Afw.unSubscribeConnectivityStatus(function () {
                    });
                }, function () {
                    //Do nothing as of now
                });

                $("#currLocRefIcon").removeClass("rotate");
                $("#updateSpan").html(CI.Utils.Localization.translate("weat_Unable_connect"));
                checkUpdatedTime(searchDetailClass.locationDetails);
                setTimeout(function () {
                    if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHDETAILS.screenName && WT.SearchDetail.refreshInProgress === true) {
                        WT.SearchDetail.refreshInProgress = false;
                        locWTDetailObj.updateTimeDetails(searchDetailClass.locationDetails);
                    }
                }, WT.Constant.Api.DEFAULT_UPDATED_DISPLAY_TIMEOUT);
            }

        }
    };
    /*
     * Name: manualUpdate
     * Description: Public method which shall be called on manualUpdate and autoUpdate of searchDetailPage
     *
     * Parameters:
     * @param
     * None
     * Returns:None
     * Globals updated:None
     * Local Storage Variables updated:None
     */

    this.manualUpdate = function () {
        WT.Global.logger("WT::SearchDetail::manualUpdate ", CI.Utils.Define.LOGSeverity.INFO);
        searchDetailClass.locationDetails = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SEARCH_DETAILS);
        if (!WT.SearchDetail.refreshInProgress) {
            //rotating animation
            $("#currLocRefIcon").addClass("rotate");
            WT.SearchDetail.refreshInProgress = true;
            WT.Service.Afw.getConnectivityStatus(connectivityCallBack);
        }
    };

    /*
     * Name: initialisation
     * Description: Public method which shall be called on initialisation of the search Detail screen.
     *
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     * Local Storage Variables updated: None
     */

    this.initialisation = function () {
        WT.SearchDetail.refreshInProgress = false;
        $("#favIcon").attr("class","icon nonfav");
        WT.Global.logger("WT::search-detail initialisation", CI.Utils.Define.LOGSeverity.INFO);

        if (WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SEARCH_DETAILS)) {
            searchDetailClass.locationDetails = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SEARCH_DETAILS);
            WT.Global.logger("WT::search-detail initialisation location Id"+"-"+JSON.stringify(searchDetailClass.locationDetails.locationDetail.location.locationId), CI.Utils.Define.LOGSeverity.INFO);
            var timeDiff = WT.Global.getCurrentTimeDiff(searchDetailClass.locationDetails.updatedTime);
            var timeToUpdate = WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT - timeDiff;
            this.updateSearchDetails(searchDetailClass.locationDetails);            
            fetchFavorite(searchDetailClass.locationDetails);
            WT.Service.AutoUpdate.startTimer(timeToUpdate, "currLocRefIcon");
            if(WT.Global.favDetailsScreen){
                WT.Sidemenu.highlight(WT.Constant.Route.FAVOURITE.sideBarId);
            }else {
                WT.Sidemenu.highlight(WT.Constant.Route.SEARCHKEYBOARD.sideBarId);
            }

        }
    };
};