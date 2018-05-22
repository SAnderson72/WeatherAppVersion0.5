/*
 * File Name: footer-handler.js
 * Description: footer-handler module handles back button and footer settings key functionality on each page.
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Pratheesh VS
 * Creation Date: 29 January, 2018
 * Version : 1.0
 *
 * MODIFICATION RECORDS:
 * 
 */

/*
 * Name: WT.FooterHandler
 * Description: Global object which does the footer initialization for weather application.
 *      listens for footer key trigger
 *      navigate to previous page
 *      store current page url for future use
 * Parameters:
 * @param :None
 * Returns:None
 * Globals updated:None
 */

WT.FooterHandler = WT.FooterHandler || {};

/*
 * Name:  WT.FooterHandler.backButton
 * Description: Called when back button is pressed
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */

WT.FooterHandler.backButton = function () {
    // fetch current and previous pages
    var currentScreen = WT.Route.getCurrentScreen();
    var prevScreen = WT.Route.getPrevScreen();
    WT.Global.logger('FooterHandler::backButton callback triggered ' +currentScreen, CI.Utils.Define.LOGSeverity.INFO);
    
    //Back transition animation flag
    WT.Global.backTransition = true;
    if (currentScreen === WT.Constant.Route.SEARCHKEYBOARD.screenName)
    {
        //stop loading and redirect to keyboard page
        WT.Global.stopLoading();
        WT.Route.location(WT.Constant.Route.SEARCHKEYBOARD.screenName);
        return true;
    }else if ((currentScreen === WT.Constant.Route.FAVOURITE.screenName) && WT.Global.animationInProgress){
        //stop loading and redirect to keyboard page
        WT.Global.stopLoading();
        $("#nav-myloc").trigger("mousedown");
        $("#nav-myloc").trigger("mouseup");
        return true;
    }else if ((currentScreen === WT.Constant.Route.SEARCHLIST.screenName) && WT.Global.animationInProgress){
        //stop loading and redirect to keyboard page
        WT.Global.stopLoading();
        WT.Route.location(WT.Constant.Route.SEARCHLIST.screenName);
        return true;
    }else if (currentScreen === WT.Constant.Route.SETTINGS.screenName) {
        //redirect to Current Location when launched through Speech
        $("#container").removeClass("settings-page");            
        if (prevScreen === "") {
            //$("#nav-myloc").trigger("click");
            $("#nav-myloc").trigger("mousedown");
            $("#nav-myloc").trigger("mouseup");
        }
        //redirect to previous screen when in settings
        else {
            WT.Route.location(prevScreen);
        }
        return true;
    }else if (currentScreen === WT.Constant.Route.LEGALINFO.screenName || currentScreen === WT.Constant.Route.LEGALDETAILS.screenName ) {
        //redirect to settings when in legal info or legal details
        WT.Route.location(WT.Constant.Route.SETTINGS.screenName);
        return true;
    }else if (currentScreen === WT.Constant.Route.FORECAST.screenName ) {
        $("#container").removeClass("forecast-page");
        if(prevScreen !== WT.Constant.Route.SETTINGS.screenName){           
            WT.Route.location(prevScreen);            
        }else{
            if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_PREV_SCREEN)){
                WT.Route.location(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_PREV_SCREEN));
            }else{
                //Default Page
                $("#nav-myloc").trigger("mousedown");
                $("#nav-myloc").trigger("mouseup");
            }
        }
        return true;
    }else {
        //redirect to CI menu
        return false;
    }    
   
};

/*
 * Name:  WT.FooterHandler.settings
 * Description: Called when settings pressed
 *              Route to settings
 * Parameters:
 * @param : None
 * Returns: None
 * Globals updated: None
 */

WT.FooterHandler.settings = function () {
    WT.Global.logger('FooterHandler::settings triggered', CI.Utils.Define.LOGSeverity.INFO);
    if (WT.Route.getCurrentScreen() !== WT.Constant.Route.SETTINGS.screenName) {
        WT.Route.location(WT.Constant.Route.SETTINGS.screenName);
    }
    
};


/*
 * Name:  footer listener
 * Description: Registering footer settings and back key call back
 * Parameters:
 * @param {event} : CI.System.Core.setBackKeyCallback
 * @param {event} : CI.System.Core.setFooterHandler Callback
 * Returns: None
 * Globals updated: None
 */

CI.System.Core.ready(function () {
    // handle back button 
    CI.System.Core.setBackKeyCallback(WT.FooterHandler.backButton);
    // handling footer settings key
    CI.System.Core.setFooterKeyCallback(WT.FooterHandler.settings);
});
