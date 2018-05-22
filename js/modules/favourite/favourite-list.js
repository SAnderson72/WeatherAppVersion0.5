/*
 * File Name: favourite-list.js
 * Description: Favourite screen handled here
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Deepika Basavaraju
 * Creation Date: 02 Feb 2018
 * Version : 1.0
 *
 * MODIFICATION RECORDS:
 * /
 
/*
 * Name: WT.FavouriteList
 * Description:  @namespace
 *               Javascript WT.FavouriteList object, which is used for initialization of favourite list page
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */
WT.FavouriteList = WT.FavouriteList || {};

var favouriteListClass = function () {
    var enableFavListClick = true;
    var enableFavicon = false;
    //Public variable for favlist class
    favouriteListClass.mouseDownY1 = 0;
    favouriteListClass.mouseDownY2 = 0;
    favouriteListClass.mouseDownX1 = 0;
    favouriteListClass.mouseDownX2 = 0;
    favouriteListClass.verticalSwipeDist = 0;
    favouriteListClass.horizontSwipeDist = 0;
    favouriteListClass.responseInProgress = false;
    
    this.favouriterotate = function(index){
        if(enableFavicon){
        $("#favselectedIcon" + index).removeClass("favIcons");
        $("#favselectedIcon" + index).removeClass("favselected");
        $("#favselectedIcon" + index).addClass("update");
        $("#favselectedIcon" + index).addClass("rotate");
        var locId = ($("#list"+index+" .loc-id").text());
        var locName = ($("#list"+index+" .loc-data").text());
        WT.Service.FavoriteHandler.deleteFavorite(locId,function(){
            //check multi item delete is happening in background
            if(WT.Global.dataToDelete.length === 0){  
               $("#favselectedIcon" + index).removeClass("rotate");                               
               $("#fav-list").html("");
               FavouriteListDisplay(WT.Global.cacheStorage.getItem("WT-favData").settings, WT.Global.cacheStorage.getItem("WT-favData").settings.length);
            }else{
                setTimeout(function(){
                    $("#favselectedIcon" + index).removeClass("rotate");                               
                    $("#fav-list").html("");
                    FavouriteListDisplay(WT.Global.cacheStorage.getItem("WT-favData").settings, WT.Global.cacheStorage.getItem("WT-favData").settings.length);
                }, 1000);
            }
        },function(){
            if(WT.Global.dataToDelete.length === 0){
                $("#favselectedIcon" + index).removeClass("rotate");
                $("#favselectedIcon" + index).addClass("favselected");
            }else{
                for(var element =0; element<10; element++)
               {
                   $("#favselectedIcon" + element).removeClass("rotate");
                   $("#favselectedIcon" + element).addClass("favselected");
               }
               WT.Global.dataToDelete=[];
            }
            //WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"", CI.Utils.Localization.translate("weat_Not_fav_del", {'PARAM0': locName}));
        });
        };
    };

    var updateFavBackground = function(){
        
        //Update Background
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.FAVOURITE.screenName) {
            if(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS)){
                var locationDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
                WT.Global.updateBackgroundTheme(locationDetails.locationDetail.today.weatherIcon, function(current_theme){
                    $("#container").addClass(current_theme+"_dest");   
                });
            }else{
                //Show grtadient image
                $("#container").attr("class", "container dest-background");
            }
        }
    };
/*
     * Name: favDetailSuccCall
     * Description: Callback method for Search Details success after data validation
     *              Place the details in cache and Route to search Details
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */
    var favDetailSuccCall = function (searchDetails){        
        var clickedLocationId = null;
        WT.Global.logger("favouriteListClass:favDetailSuccCall:locationId: "+searchDetails.locationDetail.location.locationId, CI.Utils.Define.LOGSeverity.INFO);
        if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID)){
            clickedLocationId = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID);
        }        
        if ($("#loadingTitle").length && clickedLocationId == searchDetails.locationDetail.location.locationId){
            WT.Global.logger("favouriteListClass:favDetailSuccCall route to detail page", CI.Utils.Define.LOGSeverity.INFO);
            WT.Global.favDetailsScreen = true;
            WT.Route.location(WT.Constant.Route.SEARCHDETAILS.screenName);
        }else{
            WT.Global.logger("favouriteListClass:favDetailSuccCall (else) current page != list", CI.Utils.Define.LOGSeverity.INFO);
        }
    };

    /*
     * Name: favDetailErrCall
     * Description: Search Details error call back after/before validation
     * shows unable to connect and Redirects back to list page.
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */
    var favDetailErrCall = function () {
        //Check if the current page is search list
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.FAVOURITE.screenName) {
            WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), WT.Constant.screenNames.FULL_LOADING);
            WT.Global.timerConnectSearchList = setTimeout(function () {
                WT.Route.location(WT.Constant.Route.FAVOURITE.screenName);
                WT.Global.stopLoading();
            }, WT.Constant.Api.DEFAULT_UPDATED_DISPLAY_TIMEOUT);
        } else {
            WT.Global.logger("favouriteListClass:favDetailErrCall current page != list", CI.Utils.Define.LOGSeverity.INFO);
            //Avoid response from framework if the current is not search list page
        }
    };
     /*
     * Name: connectionCallBack
     * Description: Connection available check, Make
     *        an Off-board call only if connection is successful 
     *        Else redirect back to list page
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */
    var connectionCallBack = function (connStatus) {
        favouriteListClass.responseInProgress = true;
        if ((typeof connStatus === "string") && connStatus === "connectionAvailable") {
            //off-board call            
            WT.Global.startLoading(CI.Utils.Localization.translate("weat_Loading_weather"), WT.Constant.screenNames.FULL_LOADING);
            WT.Global.logger("favouriteListClass:connectionCallBack calls searchLocation()", CI.Utils.Define.LOGSeverity.INFO);
            WT.Global.searchLocation(favDetailSuccCall, favDetailErrCall);
        } else {
            WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), WT.Constant.screenNames.FULL_LOADING);
            WT.Global.timerConnectSearchList = setTimeout(function () {
                //Check if the current page is search list
                if (WT.Route.getCurrentScreen() === WT.Constant.Route.FAVOURITE.screenName) {
                    WT.Route.location(WT.Constant.Route.FAVOURITE.screenName);
                    WT.Global.stopLoading();
                    WT.Global.logger("favouriteListClass:connectionCallBack current page == list", CI.Utils.Define.LOGSeverity.INFO);
                } else {
                    WT.Global.logger("favouriteListClass:connectionCallBack current page != list", CI.Utils.Define.LOGSeverity.INFO);
                    //Avoid response from framework if the current is not search list page
                }
            }, WT.Constant.Api.DEFAULT_UPDATED_DISPLAY_TIMEOUT);
        }
    };

    /*
     * Name: FavouriteListDisplay
     * Description: Public method which shall be called display favourite list.
     *         Scroll is enabled based on length of list > 5
     *         Mouse up,Mouse down events are handled 
     *         Favourite Details is shown on click of a list item
     *
     * Parameters:
     * @param {Object} - FavouriteListData which contains FavouriteList Details
     * @param {string} - listLength which contains FavouriteList length
     * favListData
     * Returns: None
     * Globals updated:
     * Cache Storage variable wt-selectedLocationId is updated with location id of the selected list item
     */
        this.favIcondown = function(index){
           // mousedownPosY = e.pageY; mousedownPosX = e.pageX;
            $("#favselectedIcon" + index).addClass("favIcons");
            //$("#favouriteIcon" + index).addClass("favIcons");
            enableFavicon = true;
        };
        this.favIconleave = function(index){
            $("#favselectedIcon" + index).removeClass("favIcons");
            enableFavicon = false;
        };
      
    var FavouriteListDisplay = function (FavListData, listLength) {
        var listCounter = 0;
        var listname;
        var index = 0;
		var favlisthtml = "";
        for(var index in FavListData){
            favItemDetails = FavListData[index].value.split('_');
            locationName = favItemDetails[0] ;
            locMinTemp = Math.round(favItemDetails[3]) ;
            locMaxTemp = Math.round(favItemDetails[4]) ;
            //fetching loc  id
            if(favItemDetails.length >= WT.Constant.FAV_LIST_LENGTH){
                favItemDetails.splice(0,WT.Constant.FAV_LIST_LENGTH);
                locationId = favItemDetails.join('_');
            }
            index = parseInt(index) + 1;
            listname = "list" + index;
			favlisthtml += '<li id="' + listname + '" class="favListElements scrollListElement"><div class="reaction-area"><div class="loc-id">'+locationId+'</div><div id="favselectedIcon'+index+'" class="icon favselected favLineSeperator" onmousedown="WT.Favourite.favIcondown('+index+')" onmouseout="WT.Favourite.favIconleave('+index+')" onmouseup="WT.Favourite.favouriterotate('+index+')"><i></i></div><div class="favList-element"><div class="loc-data font30" >'+locationName+'</div><div class="loc-temp font30">'+locMinTemp + "&#176;"+'</div><div class="loc-fahren font30">'+locMaxTemp + "&#176;"+'</div></div></div></li>';
           
        }
		$('#fav-list').append(favlisthtml);
        if(listLength == 0){
            $("#noFav").css("display","block");
            $("#favourite-list").css("display","none");
        }else if (listLength > WT.Constant.FAV_LIST_LENGTH) {
            $("#favourite-list").css("display","block");
            //Add class for scroll
            $(".favourite-list").removeClass("with-out-scroll");
            $(".loc-data").removeClass("fav-with-out-scroll");
            $(".favourite-list").addClass("with-scroll");
            //injecting scroll bar
            var scrollBarObject = new scrollBarClass();
            scrollBarObject.initialisation(".list");
            WT.Global.logger("WT::FavouriteListClass:FavouriteListDisplay scroll enabled", CI.Utils.Define.LOGSeverity.INFO);
        }else{
            $("#favourite-list").css("display","block");
            //Remove class for scroll
            $(".favourite-list").removeClass("with-scroll");
            $(".favourite-list").addClass("with-out-scroll");
            $(".loc-data").addClass("fav-with-out-scroll");
            WT.Global.logger("WT::FavouriteListClass:FavouriteListDisplay scroll disabled", CI.Utils.Define.LOGSeverity.INFO);
        }

    /*
     * Name: $(".favList-element").mousedown()
     * Description: Jquery mouse down event for list element click
     *       Get mouse down position, Active stated for element press
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */
        $(".favList-element").mousedown(function (event) { 
            var favIconHighlight = $(this).parent().closest('div').children().eq(1).attr('id');
            enableFavListClick = true;
            WT.Global.logger("WT::FavouriteListClass:list-element mousedown triggered", CI.Utils.Define.LOGSeverity.INFO);
            favouriteListClass.mouseDownY1 = event.pageY;
            favouriteListClass.mouseDownX1 = event.pageX;
            $(".list-element").removeClass("active-element");
            $("#" + favIconHighlight).addClass('favDayIconselected');
            $(this).addClass("active-element");

        });
     /*
      * Name: $(".favListElements").mouseup()
      * Description: Jquery mouse down event for list element click
      *                   Getting mouse difference for correct click event of list item
      *                   Connectivity check for off-board call
      * Parameters:
      * @param :None
      * Returns:None
      * Globals updated:
      * wt-selectedLocationId - cache storage updated
      */
        $(".favListElements").mouseup(function (event) {
            favouriteListClass.mouseDownY2 = event.pageY;
            favouriteListClass.mouseDownX2 = event.pageX;

            favouriteListClass.verticalSwipeDist = Math.abs(favouriteListClass.mouseDownY2 - favouriteListClass.mouseDownY1);
            favouriteListClass.horizontSwipeDist = Math.abs(favouriteListClass.mouseDownX2 - favouriteListClass.mouseDownX1);

            if ((favouriteListClass.verticalSwipeDist < WT.Constant.Swipe.CLICK_THRESHOLD)) {

                var selectedListId = $(this).attr("id");
                var locationId = $("#" + selectedListId + " .loc-id").text();
                WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID, locationId);
                WT.Global.logger("WT::favouriteListClass::list-element mouse-up locationId"+ " - " + locationId, CI.Utils.Define.LOGSeverity.INFO);
                
                //Check for click enable
                if (enableFavListClick === true) {
                    //Connectivity check
                    WT.Global.logger("WT::favouriteListClass::list-element mouse-up locationId"+ " - " + locationId, CI.Utils.Define.LOGSeverity.INFO);
                    WT.Service.Afw.getConnectivityStatus(connectionCallBack);
                    //Have to include redirection to detail here
                }
            }    
            $(".favList-element").removeClass("active-element");               
        });
    

    /*
     * Name: $(".favList-element").mouseleave()
     * Description: Jquery mouse down event for list element click
     *                   Remove active state on mouse leave for list element
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */
        $(".favList-element").mouseup(function () {
                $(".favList-element").removeClass("active-element");        
                var favIconHighlight = $(this).parent().closest('div').children().eq(1).attr('id');
                $("#" + favIconHighlight).removeClass('favDayIconselected');
        });

    /*
     * Name: $(".favList-element").mouseleave()
     * Description: Jquery mouse down event for list element click
     *                   Remove active state on mouse leave for list element
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */
        
        $(".favList-element").mouseleave(function () {
            enableFavListClick = false;
            $(".favList-element").removeClass("active-element");
            var favIconHighlight = $(this).parent().closest('div').children().eq(1).attr('id');
            $("#" + favIconHighlight).removeClass('favDayIconselected');
        });

    /*
     * Description: Jquery mouse down event for list element click
     *                   Remove active state on scroll of list
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */

        $(".favList-elementt").scroll(function () {
            enableFavListClick = false;
            $(".favList-element").removeClass("active-element");
        });
    };

    /*
     * Name: initialisation
     * Description: Public method which shall be called on initialisation of the favourite List screen.
     *  Cache storage variable wt-searchListDetails should contain favourite list details Connectivity Status
     *  check call back favouriteListDisplay is invoked to display favourite list
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */
    this.initialisation =  function () {
        $("#noFavMsgTxt").html(CI.Utils.Localization.translate("weat_No_fav_loc"));
        var formatFavList =function(successObj){
            if(successObj){                
                for(var index in successObj){                        
                    var favItemDetails = successObj[index].value.split('_');                        
                    if(favItemDetails.length >= WT.Constant.FAV_LIST_LENGTH){
                        favItemDetails.splice(0,WT.Constant.FAV_LIST_LENGTH);
                        locationId = locationId + favItemDetails.join('_')+";";
                    }
                }
                console.log("favItems  = " + JSON.stringify(successObj)); 
                updateFavBackground();
                FavouriteListDisplay(successObj, successObj.length);
            }else{
                FavouriteListDisplay(successObj, successObj.length);
            }
        }
        var favListOverview =function(successObj){
            var favItem = successObj.settings;
            if(favItem.length){
               //fetching loc  id
                for(var index in favItem){
                   var favItemDetails = favItem[index].value.split('_');
                   if(favItemDetails.length >= WT.Constant.FAV_LIST_LENGTH){
                       favItemDetails.splice(0,WT.Constant.FAV_LIST_LENGTH);
                       locationId = locationId + favItemDetails.join('_')+";";
                    }
                    locationList = locationId.substring(0, locationId.length - 1);
                }
            
                WT.Service.FavoriteHandler.getOverview(locationList,function(successObj){
                    WT.Global.stopLoading();
                    formatFavList(successObj);   
                    WT.Global.langChange = false;           
                },function(errorObj){
                     WT.Global.logger("WT::getOverview error"+JSON.stringify(errorObj), CI.Utils.Define.LOGSeverity.ERROR);
                     WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), WT.Constant.screenNames.FULL_LOADING);
                    $("#nav-myloc").trigger("mousedown");
                    $("#nav-myloc").trigger("mouseup");
                });
            }else{
                formatFavList(successObj.settings);
            }
        }

        if(WT.Global.langChange === true || WT.Global.favUpdateBefore12Hour === true){
            // show loading, load data from dsm , get loc id, make overviwe call
            var locationId = "";
            //FavListData = WT.Global.cacheStorage.getItem("WT-favData");
            WT.Service.FavoriteHandler.getFavDSM("WT-FAVDATA",function(successObj){ 
                WT.Global.logger("WT::FavListData language change success"+JSON.stringify(successObj), CI.Utils.Define.LOGSeverity.INFO);            
                favListOverview(successObj.value);
                WT.Global.cacheStorage.removeItem("WT-favData");
            },function(){
                WT.Service.FavoriteHandler.downloadFavorite(function(successObj){
                    WT.Global.logger("WT::downloadFavorite language change success"+JSON.stringify(successObj), CI.Utils.Define.LOGSeverity.INFO);            
                    WT.Global.cacheStorage.setItem("WT-favData", successObj.value);
                    WT.Global.stopLoading();
                    favListOverview(successObj.value);
                },function(errorObj){
                    WT.Global.logger("WT::downloadFavorite language change error"+JSON.stringify(errorObj), CI.Utils.Define.LOGSeverity.ERROR);            
                    WT.Global.stopLoading();                
                    WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), WT.Constant.screenNames.FULL_LOADING);
                    $("#nav-myloc").trigger("mousedown");
                    $("#nav-myloc").trigger("mouseup");
                });                               
            });
        }else{
            if(WT.Global.cacheStorage.getItem("WT-favData")){
                formatFavList(WT.Global.cacheStorage.getItem("WT-favData").settings);        
            }else{  
                WT.Service.FavoriteHandler.getFavDSM("WT-FAVDATA",function(successObj){ 
                    WT.Global.cacheStorage.setItem("WT-favData", successObj.value);
                    formatFavList(successObj.value.settings);      
                },function(errorObj){
                    WT.Global.startLoading(CI.Utils.Localization.translate("weat_Loading_weather"), WT.Constant.screenNames.FULL_LOADING);
                    WT.Service.FavoriteHandler.downloadFavorite(function(successObj){
                        WT.Global.stopLoading();
                        formatFavList(successObj.value.settings);
                    },function(errorObj){
                        WT.Global.logger("WT::downloadFavorite No language change error"+JSON.stringify(errorObj), CI.Utils.Define.LOGSeverity.ERROR);            
                        WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), WT.Constant.screenNames.FULL_LOADING);
                        $("#nav-myloc").trigger("mousedown");
                        $("#nav-myloc").trigger("mouseup");
                    }); 
                }); 
            }
        }
    };
};    







