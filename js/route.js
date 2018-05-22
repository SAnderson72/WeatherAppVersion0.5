/*
 * File Name: route.js
 * Description: routing to each screen is WT app is handled in this module.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Sreejith P
 * Creation Date: 12 January, 2018
 *
 * MODIFICATION RECORDS:
 */

/*
 * @namespace
 * Javascript WT.Route object, which is used for initialization of routing between screens
 */
WT.Route = {};



/*
 * Name: WT.Route.location
 * Description: Public method which sends request to load respective screens,
 *              dynamic injection of script to body corresponding to partial,Once loaded should not try to load again
 *              injecting html into the mainview div element
 *              appending screenname to url
 *              sidebar required to hide and show
 *              used to get current screen name
 used to get side bar id
 * Parameters:
 * @param {string} - None
 * Returns: None
 * Globals updated: None
 */

WT.Route.location = function (screenName) {
    var sideBarId;
    
    //Unsubscribe events while routing
    WT.Service.Afw.unSubscribeConnectivityStatus(function () {
    });

    //Clear TImer
    clearTimeout(WT.Global.timerConnectSearchKB);
    clearTimeout(WT.Global.timerConnectSearchList);

    //Unbinding mouseup event
    $(document).unbind("mouseup");
    //show the respective screen while route
    switch (screenName) {
        case WT.Constant.Route.GENERICLOC.screenName:
            $("#mainView").removeClass("transformRemoval");
            WT.Route.location.prevScreen = WT.Route.location.currentScreen;
            sideBarId = WT.Constant.Route.GENERICLOC.sideBarId;
            WT.Route.location.currentScreen = WT.Constant.Route.GENERICLOC.screenName;
            WT.Route.loadJS(WT.Genericloc, WT.Constant.Route.GENERICLOC.jsPath, '/generic-location.js', function () {
                window.location.hash = WT.Route.location.currentScreen;

                WT.Route.animateOut(function () {
                    $("#container").attr("class", "container genericImg");
                    $("#mainView").load('views/' + WT.Constant.Route.GENERICLOC.screenHtml + '.html', function () {
                        //Fetch the current Screen
                        WT.Global.stopLoading();
                        WT.Route.animateIn();
                        WT.Genericloc = new genericLocClass();
                        WT.Genericloc.initialisation();
                    });
                });
            });
            break;
        case WT.Constant.Route.GENERICDEST.screenName:
            $("#mainView").removeClass("transformRemoval");
            WT.Route.location.prevScreen = WT.Route.location.currentScreen;
            sideBarId = WT.Constant.Route.GENERICDEST.sideBarId;
            WT.Route.location.currentScreen = WT.Constant.Route.GENERICDEST.screenName;
            WT.Route.loadJS([WT.Genericloc, WT.Genericdest], [WT.Constant.Route.GENERICLOC.jsPath, WT.Constant.Route.GENERICDEST.jsPath],
                    ['/generic-location.js', '/generic-destination.js'], function () {
                window.location.hash = WT.Route.location.currentScreen;
                WT.Route.animateOut(function () {
                    $("#container").attr("class", "container genericImg");
                    $("#mainView").load('views/' + WT.Constant.Route.GENERICDEST.screenHtml + '.html', function () {
                        //Fetch the current Screen
                        WT.Global.stopLoading();
                        WT.Route.animateIn();
                        WT.Genericdest = new genericDestClass();
                        WT.Genericdest.initialisation();
                    });
                });
            });

            break;
        case WT.Constant.Route.CURRLOC.screenName:
            $("#mainView").removeClass("transformRemoval");
            WT.Route.location.prevScreen = WT.Route.location.currentScreen;
            sideBarId = WT.Constant.Route.CURRLOC.sideBarId;
            WT.Route.location.currentScreen = WT.Constant.Route.CURRLOC.screenName;
            WT.Route.loadJS([WT.Currentloc, WT.LocWTDetails], [WT.Constant.Route.CURRLOC.jsPath, WT.Constant.Route.CURRLOC.jsPath],
                    ['/current-location.js', '/loc-wt-details.js'], function () {
                window.location.hash = WT.Route.location.currentScreen;
                WT.Route.animateOut(function () {
                    $("#mainView").load('views/' + WT.Constant.Route.CURRLOC.screenHtml + '.html', function () {
                        $("#mainView").attr("class", "main");
                        //Fetch the current Screen
                        WT.Global.stopLoading();
                        WT.Route.animateIn();
                        WT.Currentloc = new currLocClass();
                        WT.Currentloc.initialisation();
                    });
                });
            });
            break;
        case WT.Constant.Route.DESTINATION.screenName:
            $("#mainView").removeClass("transformRemoval");
            WT.Route.location.prevScreen = WT.Route.location.currentScreen;
            sideBarId = WT.Constant.Route.DESTINATION.sideBarId;
            WT.Route.location.currentScreen = WT.Constant.Route.DESTINATION.screenName;
            WT.Route.loadJS([WT.Destination, WT.LocWTDetails], [WT.Constant.Route.DESTINATION.jsPath, WT.Constant.Route.CURRLOC.jsPath],
                    ['/destination-details.js', '/loc-wt-details.js'], function () {
                window.location.hash = WT.Route.location.currentScreen;
                WT.Route.animateOut(function () {
                    $("#mainView").load('views/' + WT.Constant.Route.DESTINATION.screenHtml + '.html', function () {
                        $("#mainView").attr("class", "main");
                        //Fetch the current Screen
                        WT.Global.stopLoading();
                        WT.Route.animateIn();
                        WT.Destination = new destClass();
                        WT.Destination.initialisation();
                    });
                });
            });
            break;
        case WT.Constant.Route.DESTNOTAVAIL.screenName:
            $("#mainView").removeClass("transformRemoval");
            WT.Route.location.prevScreen = WT.Route.location.currentScreen;
            sideBarId = WT.Constant.Route.DESTNOTAVAIL.sideBarId;
            WT.Route.location.currentScreen = WT.Constant.Route.DESTNOTAVAIL.screenName;
            WT.Route.loadJS([WT.Destination, WT.LocWTDetails], [WT.Constant.Route.DESTNOTAVAIL.jsPath, WT.Constant.Route.CURRLOC.jsPath],
                    ['/destination-details.js', '/loc-wt-details.js'], function () {
                window.location.hash = WT.Route.location.currentScreen;
                WT.Route.animateOut(function () {
                    $("#mainView").load('views/' + WT.Constant.Route.DESTNOTAVAIL.screenHtml + '.html', function () {
                        $("#mainView").attr("class", "main");
                        //Fetch the current Screen
                        WT.Global.stopLoading();
                        WT.Route.animateIn();
                        WT.Destination = new destClass();
                        WT.Destination.initialisation();
                    });
                });
            });
            break;
        case WT.Constant.Route.FORECAST.screenName:
            $("#mainView").removeClass("transformRemoval");
            WT.Route.location.prevScreen = WT.Route.location.currentScreen;
            sideBarId = WT.Constant.Route.FORECAST.sideBarId;
            WT.Route.location.currentScreen = WT.Constant.Route.FORECAST.screenName;
            WT.Route.loadJS([WT.Forecastdetail, WT.LocWTDetails], [WT.Constant.Route.FORECAST.jsPath, WT.Constant.Route.CURRLOC.jsPath], ['/forecast-detail.js', '/loc-wt-details.js'], function () {
                window.location.hash = WT.Route.location.currentScreen;
                WT.Route.animateOut(function () {
                    $("#mainView").load('views/' + WT.Constant.Route.FORECAST.screenHtml + '.html', function () {
                        //Fetch the Forecast Screen
                        WT.Route.animateIn();
                        var forecastObj = new forcastDetailClass();
                        forecastObj.initialisation(WT.Route.location.prevScreen);
                    });
                });
            });
        break;
        //Search Keyboard
        case WT.Constant.Route.SEARCHKEYBOARD.screenName:
            $("#mainView").removeClass("transformRemoval");
            //Donot save keyboard as current screen again when back from keyboard
            if (WT.Route.location.currentScreen !== WT.Constant.Route.SEARCHKEYBOARD.screenName) {
                WT.Route.location.prevScreen = WT.Route.location.currentScreen;
            }
            sideBarId = WT.Constant.Route.SEARCHKEYBOARD.sideBarId;
            WT.Route.location.currentScreen = WT.Constant.Route.SEARCHKEYBOARD.screenName;
            WT.Route.loadJS(WT.Searchkeyboard, WT.Constant.Route.SEARCHKEYBOARD.jsPath, '/search.js',
                    function () {
                        WT.Route.animateOut(function () {
                            $("#container").attr("class", "container settings-page");
                            window.location.hash = WT.Route.location.currentScreen;
                            $("#mainView").html("");
                            //Fetch the current Screen
                            WT.Global.stopLoading();
                            WT.Route.animateIn();
                            WT.Searchkeyboard = new searchKeyboardClass();
                            WT.Searchkeyboard.initialisation();
                        });
                    });
        break;
        //Serach List
        case WT.Constant.Route.SEARCHLIST.screenName:
            $("#mainView").removeClass("transformRemoval");
            WT.Route.location.prevScreen = WT.Route.location.currentScreen;
            sideBarId = WT.Constant.Route.SEARCHLIST.sideBarId;
            WT.Route.location.currentScreen = WT.Constant.Route.SEARCHLIST.screenName;
            WT.Route.loadJS([WT.Searchlist, WT.scrollBar], [WT.Constant.Route.SEARCHLIST.jsPath, 'scroll'],
                    ['/search-list.js', '/scrollbar.js'], function () {
                window.location.hash = WT.Route.location.currentScreen;
                WT.Route.animateOut(function () {
                    $("#mainView").load('views/' + WT.Constant.Route.SEARCHLIST.screenHtml + '.html', function () {
                        //Fetch the current Screen
                        $("#mainView").attr("class", "main searchListPage");
                        WT.Global.stopLoading();
                        WT.Route.animateIn();
                        WT.Global.logger("Afw::route to list", CI.Utils.Define.LOGSeverity.INFO);
                        WT.Searchlist = new searchListClass();
                        WT.Searchlist.initialisation();
                    });
                });
            });
        break;
        //Search Details
        case WT.Constant.Route.SEARCHDETAILS.screenName:
            $("#mainView").removeClass("transformRemoval");
            WT.Route.location.prevScreen = WT.Route.location.currentScreen;
            sideBarId = WT.Constant.Route.SEARCHDETAILS.sideBarId;
            WT.Route.location.currentScreen = WT.Constant.Route.SEARCHDETAILS.screenName;
            WT.Route.loadJS([WT.SearchDetail, WT.LocWTDetails], [WT.Constant.Route.SEARCHDETAILS.jsPath, WT.Constant.Route.CURRLOC.jsPath],
                    ['/search-details.js', '/loc-wt-details.js'], function () {
                window.location.hash = WT.Route.location.currentScreen;
                WT.Route.animateOut(function () {
                    $("#container").attr("class", "container background-blur");
                    $("#mainView").load('views/' + WT.Constant.Route.SEARCHDETAILS.screenHtml + '.html', function () {
                        //Fetch the current Screen
                        $("#mainView").attr("class", "main");
                        WT.Global.stopLoading();
                        WT.Route.animateIn();
                        WT.Global.logger("Afw::route to SearchDetail screen", CI.Utils.Define.LOGSeverity.INFO);
                        WT.SearchDetail = new searchDetailClass();
                        WT.SearchDetail.initialisation();
                    });
                });
            });
        
        break;
        case WT.Constant.Route.SETTINGS.screenName:
            $("#mainView").removeClass("transformRemoval");
            if ((WT.Route.location.currentScreen !== WT.Constant.Route.SETTINGS.screenName) && (WT.Route.location.currentScreen !== WT.Constant.Route.LEGALINFO.screenName) && (WT.Route.location.currentScreen !== WT.Constant.Route.LEGALDETAILS.screenName)) {
                //Store Forecast Previous Screen
                if(WT.Route.location.currentScreen === WT.Constant.Route.FORECAST.screenName && WT.Route.location.prevScreen !== WT.Constant.Route.SETTINGS.screenName){
                    WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_PREV_SCREEN, WT.Route.location.prevScreen);
                }
                WT.Route.location.prevScreen = WT.Route.location.currentScreen;
            }
            WT.Route.location.currentScreen = WT.Constant.Route.SETTINGS.screenName;
            // do not load scrollbar here
            WT.Route.loadJS([WT.Settings], [WT.Constant.Route.SETTINGS.jsPath],
                    ['/settings.js'], function () {
                window.location.hash = WT.Route.location.currentScreen;
                WT.Route.animateOut(function () {
                    $("#container").attr("class", "container settings-page");
                    $("#mainView").load('views/' + WT.Constant.Route.SETTINGS.screenHtml + '.html', function () {
                        //create object and Initialize the Screen
                        WT.Global.stopLoading();
                        WT.Route.animateIn();
                        WT.Settings = new settingsClass();
                        WT.Settings.settingsInitialisation();
                    });
                });
            });
            break;

        case WT.Constant.Route.LEGALINFO.screenName:
            WT.Global.logger("Route::LEGALINFO", CI.Utils.Define.LOGSeverity.INFO);
            $("#mainView").removeClass("transformRemoval");
            WT.Route.location.currentScreen = WT.Constant.Route.LEGALINFO.screenName;
            window.location.hash = WT.Route.location.currentScreen;
            WT.Route.animateOut(function () {
                $("#container").attr("class", "container settings-page");
                $("#mainView").load('views/' + WT.Constant.Route.LEGALINFO.screenHtml + '.html', function () {
                    //TODO: create object and Initialize the Screen
                    WT.Route.animateIn();
                    WT.Global.timerlegalInfo = setTimeout(function () {
                    WT.Settings.legalInfoInitialisation();
                     }, WT.Constant.Api.DEFAULT_LEGAL_INFO_DISPLAY);
                   
                });
            });
            break;
            
        case WT.Constant.Route.LEGALDETAILS.screenName:
            $("#mainView").removeClass("transformRemoval");
            WT.Route.location.currentScreen = WT.Constant.Route.LEGALDETAILS.screenName;
            window.location.hash = WT.Route.location.currentScreen;
            WT.Route.loadJS([WT.scrollBar], ['scroll'], ['/scrollbar.js'], function () {
                WT.Route.animateOut(function () {
                    $("#container").attr("class", "container settings-page");
                    $("#mainView").load('views/' + WT.Constant.Route.LEGALDETAILS.screenHtml + '.html', function () {
                        WT.Route.animateIn();
                        $("#mainView").addClass("transformRemoval");                  
                        WT.Settings.legalDetailInitialisation();
                  
                    });
               });
        });
            break;


        case WT.Constant.Route.FAVOURITE.screenName:
            $("#mainView").removeClass("transformRemoval");
            WT.Route.location.currentScreen = WT.Constant.Route.FAVOURITE.screenName;
            window.location.hash = WT.Route.location.currentScreen;
            WT.Route.loadJS([WT.Favourite, WT.scrollBar],[WT.Constant.Route.FAVOURITE.jsPath,'scroll'],['/favourite-list.js','/scrollbar.js'], function () {
                WT.Route.animateOut(function () {
                    $("#mainView").load('views/' + WT.Constant.Route.FAVOURITE.screenHtml + '.html', function () {
                        $("#mainView").attr("class", "main favouriteListPage");
                        WT.Route.animateIn();
                        //$("#mainView").addClass("transformRemoval");
                        WT.Favourite = new favouriteListClass();
                        WT.Favourite.initialisation();
                    });
               });
            });
        break;    

        default:
            WT.Route.location.prevScreen = WT.Route.location.currentScreen;
            sideBarId = WT.Constant.Route.GENERICLOC.sideBarId;
            WT.Route.location.currentScreen = WT.Constant.Route.GENERICLOC.screenName;
            WT.Route.loadJS(WT.Genericloc, WT.Constant.Route.GENERICLOC.jsPath, '/generic-location.js', function () {
                window.location.hash = WT.Route.location.currentScreen;
                WT.Route.animateOut(function () {
                    $("#container").attr("class", "container background");
                    $("#mainView").load('views/' + WT.Constant.Route.GENERICLOC.screenHtml + '.html', function () {
                        //Fetch the current Screen
                        var genericLocObject = new genericLocClass();
                        genericLocObject.initialisation();
                    });
                });
            });

    }

    WT.Route.getCurrentScreen = function () {
        return WT.Route.location.currentScreen;
    };

    WT.Route.getSideBarId = function () {
        return sideBarId;
    };

    WT.Route.getPrevScreen = function () {
        return WT.Route.location.prevScreen;
    };

};


//Private Static Current Screen Name to get previous Screen
WT.Route.location.currentScreen = "";

//Private Static previous Screen Name to get previous Screen
WT.Route.location.prevScreen = "";

/*
 * Name: WT.Route.animateOut
 * Description: Functionality to  handle fade out and zoom in effect of current screen.
 *              When back button is pressed fade out and zoom out effect of current screen is handled
 * @param {string} - None
 * Returns: None
 * Globals updated: None
 */


WT.Route.animateOut = function (callBack) {
    //timelineMax Object creation
    var twLite = new TimelineMax();
    var divToAnimateOut = "#mainView";
    if (WT.Global.backTransition) {
        //When back button id from Settings full page should be animated
        if((WT.Route.location.prevScreen === WT.Constant.Route.SETTINGS.screenName) || 
            (WT.Route.location.prevScreen === WT.Constant.Route.FORECAST.screenName))
        {
            divToAnimateOut = "#view";
            TweenMax.from(".sidebar", 1, {autoAlpha:0 });
        }
        twLite.fromTo(divToAnimateOut, 0.3, {
            scale: 1,
            autoAlpha: 1
        },{
            scale: 0.9,
            autoAlpha: 0,
            force3D: false,
            immediateRender: false,
            onStart: function () {
                $(".background-blur").find('.main-wrapper').css('overflow','hidden');
                callBack();                
                $('.settings').css('opacity','0');
            },
               onComplete: function () {
                 $(".background-blur").find('.main-wrapper').css('overflow','visible'); 
            }
        });
    } else {
        twLite.fromTo("#mainView", 0.3, {
            scale: 1,
            autoAlpha: 1
        }, {
            scale: 1.05,
            autoAlpha: 0,
            force3D: false,
            immediateRender: false,
            onStart: function () {
                 $(".background-blur").find('.main-wrapper').css('overflow','hidden');
                callBack();
                $('.settings').css('opacity','0');
            },
              onComplete: function () {
                $(".background-blur").find('.main-wrapper').css('overflow','visible'); 
                
            }
        });
    }
};

/*
 * Name: WT.Route.animateOut
 * Description: Functionality to  handle fade in and zoom in effect of current screen on click event .
 *              When back button is pressed fade in and zoom out effect of current screen is handled
 * @param {string} - None
 * Returns: None
 * Globals updated:
 * WT.Global.backTransition
 */


WT.Route.animateIn = function () {
    var twLite = new TimelineMax();
    var divToAnimateIn = "#mainView";
    if (WT.Global.backTransition) {
        //When back button id from Settings full page should be animated
        if((WT.Route.location.prevScreen === WT.Constant.Route.SETTINGS.screenName) || 
            (WT.Route.location.prevScreen === WT.Constant.Route.FORECAST.screenName))
        {
            divToAnimateIn = "#view";
        }
        twLite.fromTo(divToAnimateIn, 0.3, {
            scale: 1.05,
            autoAlpha: 0
        }, {
            scale: 1,
            autoAlpha: 1,
            force3D: false,
            immediateRender: false,
            onStart: function () {                         
                $(".background-blur").find('.main-wrapper').css('overflow','hidden');                   
            },
            onComplete: function () {
                $('.transformRemoval').css('transform','none');
                $(".background-blur").find('.main-wrapper').css('overflow','visible'); 
            }

        });
        WT.Global.backTransition = false;
    } else {
        twLite.fromTo("#mainView", 0.3, {
            scale: 0.9,
            autoAlpha: 0
        }, {
            scale: 1,
            autoAlpha: 1,
            force3D: false,
            immediateRender: false,
            onStart: function () {
                $(".background-blur").find('.main-wrapper').css('overflow','hidden');   
            },
            onComplete: function () {
               $('.transformRemoval').css('transform','none');
               $(".background-blur").find('.main-wrapper').css('overflow','visible'); 
            }

        });
    }
};

/*
 * Name: WT.Route.loadJS
 * Description: Function for loading of script dynamically
 *
 * Parameters:
 * @param {string} - None
 * Returns: None
 * Globals updated: None
 */
WT.Route.loadJS = function (loadedObject, jsPath, jsToBeLoaded, callBack) {

    //Load Script Dynamically
    var loadScript = function (object, path, jsLoaded, bckCall) {
        if (object === undefined) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'js/modules/' + path + jsLoaded;
            document.querySelector("head").appendChild(script);
            //Callback to be called once script loaded
            script.onload = function () {
                bckCall();
            };
        } else {
            bckCall();
        }
    };

    var loadJavaScripts = function (objectlength) {
        if (objectlength < numOfJS) {
            loadScript(loadedObject[objectlength], jsPath[objectlength], jsToBeLoaded[objectlength],
                    function () {
                        objectlength = objectlength + 1;
                        loadJavaScripts(objectlength);
                    });
        } else {
            callBack();
        }
    };

    //check if multiple files need to be loaded
    if (loadedObject instanceof Array) {
        var numOfJS = loadedObject.length;
        loadJavaScripts(0);
    } else {
        loadScript(loadedObject, jsPath, jsToBeLoaded, function () {
            callBack();
        });
    }

};