/*
 * File Name: search-list.js
 * Description: Search List module to handle displaying search result and launch WT-Detail Page.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Vinny V
 * Creation Date: 08 Februrary, 2018
 * MODIFICATION RECORDS:
 * 
 */

WT.SearchList = WT.SearchList || {};

var searchListClass = function () {

    //Global variable
    var searchList = this;
    var enableSearchListClick = true;
    searchListClass.responseInProgress = false;
    
    //Public variable for this class
    searchListClass.mouseDownY1 = 0;
    searchListClass.mouseDownY2 = 0;
    searchListClass.mouseDownX1 = 0;
    searchListClass.mouseDownX2 = 0;
    searchListClass.verticalSwipeDist = 0;
    searchListClass.horizontSwipeDist = 0;

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
     * Name: searchDetailSuccCall
     * Description: Callback method for Search Details success after data validation
     *              Place the details in cache and Route to search Details
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */
    var searchDetailSuccCall = function (searchDetails) {        
        var clickedLocationId = null;
        WT.Global.logger("List:searchDetailSuccCall:locationId: "+searchDetails.locationDetail.location.locationId, CI.Utils.Define.LOGSeverity.INFO);
        if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID)){
        clickedLocationId = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID);
        }        
        if ($("#loadingTitle").length && searchListClass.responseInProgress &&
        clickedLocationId == searchDetails.locationDetail.location.locationId){
            WT.Global.logger("searchListClass:searchDetailSuccCall route to detail page", CI.Utils.Define.LOGSeverity.INFO);
            WT.Global.favDetailsScreen = false;
            WT.Route.location(WT.Constant.Route.SEARCHDETAILS.screenName);
        }else{
            WT.Global.logger("searchListClass:searchDetailSuccCall (else) current page != list", CI.Utils.Define.LOGSeverity.INFO);
        }

    };

    /*
     * Name: searchDetailErrCall
     * Description: Search Details error call back after/before validation
     * shows unable to connect and Redirects back to list page.
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */
    var searchDetailErrCall = function () {
        //Check if the current page is search list
        if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHLIST.screenName) {

            WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), WT.Constant.screenNames.FULL_LOADING);
            WT.Global.timerConnectSearchList = setTimeout(function () {
                WT.Route.location(WT.Constant.Route.SEARCHLIST.screenName);
                WT.Global.stopLoading();
            }, WT.Constant.Api.DEFAULT_UPDATED_DISPLAY_TIMEOUT);

        } else {
            WT.Global.logger("searchListClass:searchDetailErrCall current page != list", CI.Utils.Define.LOGSeverity.INFO);
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
        if ((typeof connStatus === "string") && connStatus === "connectionAvailable") {
            //off-board call
            searchListClass.responseInProgress = true;
            WT.Global.startLoading(CI.Utils.Localization.translate("weat_Loading_weather"), WT.Constant.screenNames.FULL_LOADING);
            WT.Global.logger("searchListClass:connectionCallBack calls searchLocation()", CI.Utils.Define.LOGSeverity.INFO);
            WT.Global.searchLocation(searchDetailSuccCall, searchDetailErrCall);
        } else {
            searchListClass.responseInProgress = true;
            WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), WT.Constant.screenNames.FULL_LOADING);
            WT.Global.timerConnectSearchList = setTimeout(function () {
                //Check if the current page is search list
                if (WT.Route.getCurrentScreen() === WT.Constant.Route.SEARCHLIST.screenName) {
                    WT.Route.location(WT.Constant.Route.SEARCHLIST.screenName);
                    WT.Global.stopLoading();
                    WT.Global.logger("searchListClass:connectionCallBack current page == list", CI.Utils.Define.LOGSeverity.INFO);
                } else {
                    WT.Global.logger("searchListClass:connectionCallBack current page != list", CI.Utils.Define.LOGSeverity.INFO);
                    //Avoid response from framework if the current is not search list page
                }
            }, WT.Constant.Api.DEFAULT_UPDATED_DISPLAY_TIMEOUT);
        }
    };
    /*
     * Name: searchListDisplay
     * Description: Public method which shall be called display search list.
     *         Scroll is enabled based on length of list > 4
     *         Mouse up,Mouse down events are handled 
     *         Search Details is shown on click of a list item
     *
     * Parameters:
     * @param {Object} - searchListData which contains SearchList Details
     * @param {string} - listLength which contains SearchList length
     * searchListData
     * Returns: None
     * Globals updated:
     * Cache Storage variable wt-selectedLocationId is updated with location id of the selected list item
     */
    this.searchListDisplay = function (searchListData, listLength) {
        var listCounter = 0;
        var listname;
        var index;

        $("#search-title span").html(CI.Utils.Localization.translate("weat_Matches", {
            'PARAM0': listLength}));
		var searchListhtml = "";
		var scrollListhtml = "";
        for (listCounter = 0; listCounter < listLength; listCounter++) {
          
            listname = "list" + (listCounter+1);
			
			searchListhtml += '<li id="' + listname + '" class="list-element scrollListElement" ><div class="reaction-area"><div class="loc-id" >'+searchListData.locations[listCounter].locationId+'</div><div class="loc-name">'+(searchListData.locations[listCounter].name + (!searchListData.locations[listCounter].area ? '' : ', ') + searchListData.locations[listCounter].area)+'</div><div class="province">'+searchListData.locations[listCounter].countryName+'</div> </div></li>';
			
			scrollListhtml += '<li  id="list-element' + listCounter + '"></li>';
			
        }
		
		$("#scrollList").append(scrollListhtml);
		$('#search-list').append(searchListhtml);
		index = listCounter+1;
        if (index > 4) {
		    //Add class for scroll
            //Draggable.create(".list", {type: "scrollTop", throwProps: true});
            $(".searchHeaderTitle").removeClass("searchHeaderTitleScroll"); 
            $(".search-list").removeClass("with-out-scroll");
            $(".search-list").addClass("with-scroll");
            //injecting scroll bar
            var scrollBarObject = new scrollBarClass();
            scrollBarObject.initialisation(".list");
            WT.Global.logger("WT::searchListClass:searchListDisplay scroll enabled", CI.Utils.Define.LOGSeverity.INFO);
        }
        else {
            //Remove class for scroll
            $(".searchHeaderTitle").addClass("searchHeaderTitleScroll");
            $(".search-list").removeClass("with-scroll");
            $(".search-list").addClass("with-out-scroll");
            WT.Global.logger("WT::searchListClass:searchListDisplay scroll disabled", CI.Utils.Define.LOGSeverity.INFO);
        }

    /*
     * Name: $(".list-element").mousedown()
     * Description: Jquery mouse down event for list element click
     *       Get mouse down position, Active stated for element press
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */
        $(".list-element").mousedown(function (event) {
            enableSearchListClick = true;
            WT.Global.logger("WT::searchListClass:list-element mousedown triggered", CI.Utils.Define.LOGSeverity.INFO);
            searchListClass.mouseDownY1 = event.pageY;
            searchListClass.mouseDownX1 = event.pageX;
            $(".list-element").removeClass("active-element");
            $(this).addClass("active-element");
        });
     /*
      * Name: $(".list-element").mouseup()
      * Description: Jquery mouse down event for list element click
      *                   Getting mouse difference for correct click event of list item
      *                   Connectivity check for off-board call
      * Parameters:
      * @param :None
      * Returns:None
      * Globals updated:
      * wt-selectedLocationId - cache storage updated
      */
        $(".list-element").mouseup(function (event) {
            searchListClass.mouseDownY2 = event.pageY;
            searchListClass.mouseDownX2 = event.pageX;

            searchListClass.verticalSwipeDist = Math.abs(searchListClass.mouseDownY2 - searchListClass.mouseDownY1);
            searchListClass.horizontSwipeDist = Math.abs(searchListClass.mouseDownX2 - searchListClass.mouseDownX1);
            if ((searchListClass.verticalSwipeDist < WT.Constant.Swipe.CLICK_THRESHOLD)) {
                var selectedListId = $(this).attr("id");
                var locationId = $("#" + selectedListId + " .loc-id").text();
                WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID, locationId);
                WT.Global.logger("WT::searchListClass::list-element mouse-up locationId"+ " - " + locationId, CI.Utils.Define.LOGSeverity.INFO);
                
                //Check for click enable
                if (enableSearchListClick === true) {
                    //Connectivity check
                    WT.Global.logger("WT::searchListClass::list-element mouse-up locationId"+ " - " + locationId, CI.Utils.Define.LOGSeverity.INFO);
                    WT.Service.Afw.getConnectivityStatus(connectionCallBack);
                    //Have to include redirection to detail here
                }
            }

            $(".list-element").removeClass("active-element");
        });

    /*
     * Name: $(".list-element").mouseleave()
     * Description: Jquery mouse down event for list element click
     *                   Remove active state on mouse leave for list element
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */
        $(".list-element").mouseleave(function () {
            enableSearchListClick = false;
            $(".list-element").removeClass("active-element");
        });

    /*
     * Name: $(".list").scroll()
     * Description: Jquery mouse down event for list element click
     *                   Remove active state on scroll of list
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */

        $(".list").scroll(function () {
            enableSearchListClick = false;
            $(".list-element").removeClass("active-element");
        });

    };
    /*
     * Name: initialisation
     * Description: Public method which shall be called on initialisation of the search List screen.
     *  Cache storage variable wt-searchListDetails should contain search list details Connectivity Status
     *  check call back searchListDisplay is invoked to display search list
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */
    this.initialisation = function () {
        WT.Global.logger("WT::searchList:Initialisation entered ",CI.Utils.Define.LOGSeverity.INFO);
        WT.Global.cacheStorage.removeItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID);
        WT.Global.cacheStorage.removeItem(WT.Constant.cacheStorage.SEARCH_DETAILS);        
        if (WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SEARCH_LIST_DETAILS)) {           
            WT.Global.logger("WT::searchList: Initialisation SEARCH_LIST_DETAILS available",CI.Utils.Define.LOGSeverity.INFO);
            searchListClass.responseInProgress = false;
            var searchListData = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SEARCH_LIST_DETAILS);
            var listLength = searchListData.locations.length;
            searchList.searchListDisplay(searchListData, listLength);
            WT.Sidemenu.highlight(WT.Constant.Route.SEARCHLIST.sideBarId); 
            //Updatelist background when back from settings
            if(WT.Route.getPrevScreen() === WT.Constant.Route.SETTINGS.screenName){
                updateListBackground();
            }
        }
    };
};