
/*
 * File Name: side-menu.js
 * Description: side menu navigation feature of WT app is handled in this module.
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Sreejith P
 * Creation Date: 12 January, 2018
 *
 * MODIFICATION RECORDS:
 */

WT.Sidemenu = {};


/*
 * Name: WT.Sidemenu.highlight
 * Description: Public method for side menu highlight
 *              Summary :
 *                 the desired sidemenu need to be highlight on routing
 *
 * Parameters:
 * @param : currentSideMenu integer value of side menu to be highlighted
 * Returns: None
 * Globals updated: None
 */

WT.Sidemenu.highlight = function (currentSideMenu) {
    switch (currentSideMenu) {
        case 1:
            //Highlight current location
            //remove other class if already selected
            $("#nav-myloc").addClass("selected");
            $("#nav-fav").removeClass("selected");
            $("#nav-find").removeClass("selected");
            $("#nav-dest").removeClass("selected");
            break;
        case 2:
            //Highlight Favorites
            //remove other class if already selected
            $("#nav-myloc").removeClass("selected");
            $("#nav-fav").addClass("selected");
            $("#nav-find").removeClass("selected");
            $("#nav-dest").removeClass("selected");
            break;       
        case 3:
            //Highlight Find 
            //remove other class if already selected
            $("#nav-myloc").removeClass("selected");
            $("#nav-fav").removeClass("selected");
            $("#nav-find").addClass("selected");
            $("#nav-dest").removeClass("selected");
            break;
        case 4:
            //Highlight destination
            //remove other class if already selected
            $("#nav-myloc").removeClass("selected");
            $("#nav-fav").removeClass("selected");
            $("#nav-find").removeClass("selected");
            $("#nav-dest").addClass("selected");
            break;
        default:
            //Generic Location is default screen
            $("#nav-myloc").addClass("selected");
            $("#nav-fav").removeClass("selected");
            $("#nav-find").removeClass("selected");
            $("#nav-dest").removeClass("selected");
            break;
    }
};

/*
 * Name: WT.Sidemenu.curLocClick
 * Description:  Public method for side menu current location click
 *             Summary :
 *               the desired screen(either current location or generic screen)
 *               shall be shown on side menu location click
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: WT.Global.speechInput
 */

WT.Sidemenu.curLocClick = function () {
    var enableCurrentLocationClick = true;
    var currentSideMenu;

    WT.Global.logger("side-menu.js::curLocClick - Mousedown", CI.Utils.Define.LOGSeverity.INFO);

    //Enable current location click to false
    $("#nav-myloc").mouseleave(function () {
        enableCurrentLocationClick = false;
        WT.Global.logger("side-menu.js::curLocClick - Mouseleave", CI.Utils.Define.LOGSeverity.INFO);
    });

    //Enable current location click to true
    $("#nav-myloc").mouseup(function () {

        if (enableCurrentLocationClick) {
            enableCurrentLocationClick = false;
            if(WT.Global.speechInput){
                WT.Global.speechInput = false;
            }
            WT.Global.logger("side-menu.js::curLocClick - Mouseup", CI.Utils.Define.LOGSeverity.INFO);
            if (localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS)) {
                currentSideMenu = WT.Constant.Route.CURRLOC.sideBarId;
                if(WT.Route.location.currentScreen !== WT.Constant.Route.CURRLOC.screenName){
                    WT.Route.location(WT.Constant.Route.CURRLOC.screenName);
                }
                
            } else {
                currentSideMenu = WT.Constant.Route.GENERICLOC.sideBarId;
                if (WT.Route.location.currentScreen !== WT.Constant.Route.GENERICLOC.screenName) {
                    WT.Route.location(WT.Constant.Route.GENERICLOC.screenName);
                }
            }
            WT.Sidemenu.highlight(currentSideMenu);

        } else {

            WT.Global.logger("side-menu.js::curLocClick - Mouseup disabled", CI.Utils.Define.LOGSeverity.INFO);

        }

    });
};


/*
 * Name: WT.Sidemenu.favoriteClick
 * Description: Public method for search click
 *              Summary :
 *                  the desired screen(either favourite or No favourite message)
 *                  shall be shown on side menu favourite click
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated:
 * PRE_FILLED_KB_DATA
 */

WT.Sidemenu.favoriteClick = function () {
    var enablefavoriteClick = true;
    var loginSuccessCallBack =function(){          
        if (WT.Route.location.currentScreen !== WT.Constant.Route.FAVOURITE.screenName){
            WT.Sidemenu.highlight(WT.Constant.Route.FAVOURITE.sideBarId);        
            WT.Route.location(WT.Constant.Route.FAVOURITE.screenName);            
        }       
    };
     //Enable search click to false
    $("#nav-fav").mouseleave(function () {
        enablefavoriteClick = false;
        WT.Global.logger("side-menu.js::favoriteClick - Mouseleave", CI.Utils.Define.LOGSeverity.INFO);
    }); 
   
    $("#nav-fav").mouseup(function () {
        //var currentSideMenu = WT.Constant.Route.FAVOURITE.sideBarId;
        if (enablefavoriteClick) {
            enablefavoriteClick = false;
            WT.Global.logger("side-menu.js::favoriteClick - Mouseup", CI.Utils.Define.LOGSeverity.INFO);
            if(!WT.Service.FavoriteHandler.loggedIn){
                if(!WT.Global.favoriteLogin){
                    WT.Service.FavoriteHandler.loginToProfile(true, loginSuccessCallBack);
                }
                else{
                    WT.Sidemenu.curLocClick();
                }
            }else{
                loginSuccessCallBack();
            }
        } else {
            WT.Global.logger("side-menu.js::favoriteClick - Mouseup disabled", CI.Utils.Define.LOGSeverity.INFO);

        }
    });
};

/*
 * Name: WT.Sidemenu.destinationClick
 * Description:  Public method for side menu destination location click
 *             Summary :
 *               the desired screen(either destination or No destination message)
 *               shall be shown on side menu location click
 *
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: WT.Global.speechInput
 */

WT.Sidemenu.destinationClick = function () {
    var enableDestinationClick = true;
    var currentSideMenu;

    WT.Global.logger("side-menu.js::destClick - Mousedown", CI.Utils.Define.LOGSeverity.INFO);

    //Enable current location click to false
    $("#nav-dest").mouseleave(function () {
        enableDestinationClick = false;
        WT.Global.logger("side-menu.js::destClick - Mouseleave", CI.Utils.Define.LOGSeverity.INFO);
    });

    //Enable current location click to true
    $("#nav-dest").mouseup(function () {

        if (enableDestinationClick) {
            enableDestinationClick = false;
            if(WT.Global.speechInput){
                WT.Global.speechInput = false;
            }
            WT.Global.logger("side-menu.js::destinationClick - Mouseup", CI.Utils.Define.LOGSeverity.INFO);
            if (localStorage.getItem(WT.Constant.localStorage.DEST_NAV_DETAILS)) {
                //Destination
                if (localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS)) {
                    currentSideMenu = WT.Constant.Route.DESTINATION.sideBarId;
                    if(WT.Route.location.currentScreen !== WT.Constant.Route.DESTINATION.screenName){
                        WT.Route.location(WT.Constant.Route.DESTINATION.screenName);
                    } 
                } else {
                    //Generic Destination Screen
                    currentSideMenu = WT.Constant.Route.GENERICDEST.sideBarId;
                    if (WT.Route.location.currentScreen !== WT.Constant.Route.GENERICDEST.screenName) {
                        WT.Route.location(WT.Constant.Route.GENERICDEST.screenName);
                    }
                }
            } else {
                //Destination Not Available
                currentSideMenu = WT.Constant.Route.DESTNOTAVAIL.sideBarId;
                if (WT.Route.location.currentScreen !== WT.Constant.Route.DESTNOTAVAIL.screenName) {
                    WT.Route.location(WT.Constant.Route.DESTNOTAVAIL.screenName);
               }
            }

            WT.Sidemenu.highlight(currentSideMenu);

        } else {

            WT.Global.logger("side-menu.js::destClick - Mouseup disabled", CI.Utils.Define.LOGSeverity.INFO);

        }

    
});
};

/*
 * Name: WT.Sidemenu.searchClick
 * Description: Public method for search click
 *              Summary :
 *                 go to search keyboard with cached data only when traversed from list page
 *                 enableSearchClick flag is being used to achieve NGI button functionality on search Icon
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated:
 * PRE_FILLED_KB_DATA
 */

WT.Sidemenu.searchClick = function () {
    var enableSearchClick = true;
    WT.Global.logger("side-menu.js::searchClick - Mousedown", CI.Utils.Define.LOGSeverity.INFO);

    
    //Enable search click to false
    $("#nav-find").mouseleave(function () {
        enableSearchClick = false;
        WT.Global.logger("side-menu.js::searchClick - Mouseleave", CI.Utils.Define.LOGSeverity.INFO);
    });

    $("#nav-find").mouseup(function () {
        if (enableSearchClick) {
            enableSearchClick = false;
            if(WT.Global.speechInput){
                WT.Global.speechInput = false;
            }
            WT.Global.logger("side-menu.js::searchClick - Mouseup", CI.Utils.Define.LOGSeverity.INFO);
            if (!CI.UI.Common.Keyboard.isOpened){
                //clear prefilled data if not list page
                if (WT.Route.location.currentScreen !== WT.Constant.Route.SEARCHLIST.screenName){
                    WT.Global.cacheStorage.removeItem(WT.Constant.cacheStorage.PRE_FILLED_KB_DATA);
                }
                WT.Route.location(WT.Constant.Route.SEARCHKEYBOARD.screenName);
            }
        } else {

            WT.Global.logger("side-menu.js::searchClick - Mouseup disabled", CI.Utils.Define.LOGSeverity.INFO);

        }

    });
};




/*
* Name: mousedown
* Description: This function adds active state of button click during mousedown
* Parameters:
* @param :  None
* Returns: None
* Globals updated: None
*/
$(".reaction-area").mousedown(function () {
    $(this).addClass("active");
});
/*
* Name: mousedown
* Description: This function removes the active state of button click during mouseup
* Parameters:
* @param :  None
* Returns: None
* Globals updated: None
*/
$(".reaction-area").mouseup(function () {
    $(this).removeClass("active");
});
/*
* Name: mouseleave
* Description: This function removes the active state of button click during mouseup
* Parameters:
* @param :  None
* Returns: None
* Globals updated: None
*/
$(".reaction-area").mouseleave(function () {
    $(this).removeClass("active");
});

