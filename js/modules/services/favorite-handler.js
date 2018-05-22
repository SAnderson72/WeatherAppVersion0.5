/*jshint loopfunc:true */
/*
 * File Name: favorite-update.js
 * Description: Service module handles favorite data handling and calls
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Vinny V
 * Creation Date: 23 Februrary, 2018
  *
 * MODIFICATION RECORDS:
 * Multiple favorite deletion algorithm added by Pratheesh VS on 14 March 2018
 */
/*
 * Name: WT.Service.FavouriteUpdate
 * Description:@class
 *             Javascript WT.Service.FavouriteUpdate object, which is used for favorite related activities
 * Parameters:
 * @param :
 * None
 * Returns:
 * None
 * Globals updated:
 * None
 * Tables updated:
 * None
 */

WT.Service.FavoriteHandler= {};

//Global Variable
WT.Service.FavoriteHandler.loggedIn = false;


/*
 * Name: WT.Service.FavoriteHandler.checkFav
 * Description: Function used to check active user
 * Parameters:
 * @param :{object}   - location ID
 * @param :{function} - success function
 * @param :{function} - error function
 * Returns:
 * None
 * Globals updated:
 * None
 * Tables updated:
 * None
 */
WT.Service.FavoriteHandler.checkFav = function(locObj,onSuccess,onError){
    //Iterate the element retrieved
 
	

   function favInList(favObj){
		
        if(favObj.settings.length !== 0){       
            var newCityValue;
            for(var favValue in favObj.settings){
                var iterationFavObj = favObj.settings[favValue].value.split('_');
                if(iterationFavObj.length >= 5){
                    iterationFavObj.splice(0,5);
                    newCityValue = iterationFavObj.join('_');
                }
               if(newCityValue === locObj.locationDetail.location.locationId){
                    var cityData = favObj.settings[favValue].value;  
                    onSuccess(cityData);                  
                    favObj.settings[favValue].value = locObj.locationDetail.location.name + "_"+locObj.locationDetail.location.latitude+"_"+locObj.locationDetail.location.longitude +"_"+
                    locObj.locationDetail.today.temperature.minimum.value+"_"+locObj.locationDetail.today.temperature.maximum.value +"_"+
                    locObj.locationDetail.location.locationId;
                    //Static Analysis Fixes
					var favToUpload = {value:favObj};
                    WT.Service.FavoriteHandler.uploadFavorite(favToUpload,function(value,succRes){
                        WT.Global.logger("WT::CheckFavorite setFav DSM", CI.Utils.Define.LOGSeverity.INFO);
                        WT.Service.FavoriteHandler.setFavDSM("WT-FAVDATA",value,function(){
						
							WT.Global.logger("WT::CheckFavorite setFav cache", CI.Utils.Define.LOGSeverity.INFO);
                            WT.Global.cacheStorage.setItem("WT-favData", value);
                            
                        },function(){
							onError();
						});
                    },function(){
							onError();
					});
					
                    /*
                    WT.Service.FavoriteHandler.uploadFavorite(favObj,function(){
                        alert("fav temp updated");
                        onSuccess(cityData);
                    },function(){
                        alert("fav temp not updated");
                    });*/                        
                    break;
                }
                if(favObj.settings.length === (parseInt(favValue)+1)){
                    onSuccess(null);
                }
            }
        }else{
            onSuccess(null);
        }
    }

    //Check if already logged in
    if(WT.Service.FavoriteHandler.loggedIn){
            //Check if favData available in cache storage
        if(WT.Global.cacheStorage.getItem("WT-favData")){
            WT.Global.logger("WT::checkFav getcache", CI.Utils.Define.LOGSeverity.INFO);
            favInList(WT.Global.cacheStorage.getItem("WT-favData"));
        }else{
            //get Favorite from DSM
            WT.Global.logger("WT::checkFav getFavDSM", CI.Utils.Define.LOGSeverity.INFO);
            WT.Service.FavoriteHandler.getFavDSM("WT-FAVDATA",function(successObj){
                //Valid Data 
                WT.Global.cacheStorage.setItem("WT-favData", successObj.value);
                favInList(successObj.value);
            },function(errorObj){
                //No Valid Data 
                WT.Global.logger("WT::getFavDSM error", CI.Utils.Define.LOGSeverity.INFO);
                onError(errorObj);
            });
                
        }
    }else{
        onError();
    }
};

/*
 * Name: WT.Service.FavoriteHandler.getFavDSM
 * Description: Function used to check active user
 * Parameters:
 * None
 * Returns:
 * None
 * Globals updated:
 * None
 * Tables updated:
 * None
 */
WT.Service.FavoriteHandler.getFavDSM = function(storeDataName,onSuccess,onError){
    //get fav data storage management
    WT.Global.logger("WT::getFavDSM", CI.Utils.Define.LOGSeverity.INFO);
    CI.Utils.DataStorage.loadUserData(storeDataName,function(successObj){
        //success
        onSuccess(successObj);
    },function(errorObj){
        //No Valid Data 
        onError(errorObj);
    });
};

/*
 * Name: WT.Service.FavoriteHandler.setFavDSM
 * Description: Function used to check active user
 * Parameters:
 * None
 * Returns:
 * None
 * Globals updated:
 * None
 * Tables updated:
 * None
 */
WT.Service.FavoriteHandler.setFavDSM = function(storeDataName,storeObj,onSuccess,onError){
    //set fav data storage management

    WT.Global.logger("WT::setFavDSM", CI.Utils.Define.LOGSeverity.INFO);
    CI.Utils.DataStorage.setUserData(storeDataName,storeObj,function(successObj){
        //success
        onSuccess(successObj);
    },function(errorObj){
        //No Valid Data 
        onError(errorObj);
    });
};

/*
 * Name: WT.Service.FavoriteHandler.checkActiveUser
 * Description: Function used to check active user
 * Parameters:
 * None
 * Returns:
 * None
 * Globals updated:
 * WT.Service.FavoriteHandler.loggedIn
 * Tables updated:
 * None
 */
WT.Service.FavoriteHandler.checkActiveUser = function(){
    //Check if already logged in
    CI.Vehicle.Profiles.getActiveUser(function(outputObj){
        WT.Service.FavoriteHandler.loggedIn = true;
        WT.Service.FavoriteHandler.getFavDSM("WT-FAVDATATIME",function(successObj){
            var favLastUpdatedtime=new Date(successObj.value);
            var currentSystemTime=new Date();
            if(currentSystemTime.getDate() === favLastUpdatedtime.getDate()){
                var favUpdatedTimeDiff = (currentSystemTime.getTime() - favLastUpdatedtime.getTime()) / 1000;//give time diff in seconds
                if (favUpdatedTimeDiff > WT.Constant.Api.TWELVE_HOUR_IN_MILLISECOND) {
                    WT.Global.favUpdateBefore12Hour = true;
                   }
            }else{
                 WT.Global.favUpdateBefore12Hour = true;
            }            
        },function(errorObj){
            WT.Global.favUpdateBefore12Hour = true;
        });
    },
    function(errorObj){
         WT.Service.FavoriteHandler.loggedIn = false;
    });
};


/*
 * Name: WT.Service.FavoriteHandler.downloadFavorite
 * Description: Function used to download Favorite
 * Parameters:
 * @param :{function} - success function
 * @param :{function} - error function
 * Returns:
 * None
 * Globals updated:
 * None
 * Tables updated:
 * None
 */
WT.Service.FavoriteHandler.downloadFavorite = function(onSuccess,onError){
    var readyForDownload = function(){
        var apiUrl = '/ad/as/settings/'+ WT.Constant.Api.SETTINGS_VERSION +'/json?appId=' + WT.Constant.Api.APP_UUID + '&appVersion='+WT.Constant.Api.APP_VERSION;    
        //send to jlr backend
        WT.Service.Api.sendToJlrBackEnd(apiUrl,"GET",WT.Constant.Api.LOC_RETRY_COUNTER,{},
            function (successResponse) { 
                WT.Service.FavoriteHandler.getFavDSM("WT-FAVDATATIME",function(successObj){ 
                          alert(successObj.value);
                          var favLastUpdatedtime=new Date(successObj.value);
                          currentTime=new Date();
                          if(currentTime.getDate() !== favLastUpdatedtime.getDate()){
                            var timeDiff = (currentTime.getTime() - favLastUpdatedtime.getTime()) / 1000;//give time diff in seconds
                               if (timeDiff > 43200) {
                                WT.Global.favUpdateBefore12Hour = true;
                               }
                           }else{
                             WT.Global.favUpdateBefore12Hour = true;
                           }
                         // alert("-favlist--"+favtime.getTime());
                },function(errorObj){
                    WT.Global.favUpdateBefore12Hour = true;
                });
            //Success Call Back
			//Static Analysis Fixes
			favData = {value:successResponse};
            //var favData = new Object();
            //favData.value = successResponse;
            onSuccess(favData);    
        }, function (errorResponse) { 
            // Error Call Back
            onError(errorResponse);    
        });
    };
    
    //Check connectivity before upload
    WT.Service.Afw.getUserConnectivitySettings(function(connValue){
        if ((typeof connValue === "string") && connValue === WT.Constant.connectionParam.USER_CONNECTION_ENABLE) {
           WT.Service.Afw.getConnectivityStatus(function(connStatus){
                if((typeof connStatus === "string") && connStatus === WT.Constant.connectionParam.CONNECTION_AVAILABLE){ 
                    //Connection is fine to upload
                    readyForDownload();
                }else{
                    onError();
                }
           });
        } else {
            onError(); 
        }
    });
};

/*
 * Name: WT.Service.FavoriteHandler.uploadFavorite
 * Description: Function used to upload Favorite
 * Parameters:
 * @param :{object}   - data to upload
 * @param :{function} - success function
 * @param :{function} - error function
 * Returns:
 * None
 * Globals updated:
 * None
 * Tables updated:
 * None
 */
WT.Service.FavoriteHandler.uploadFavorite = function(dataToSend,onSuccess,onError){
    var readyForUpload = function(){
        var apiUrl = '/ad/as/settings/'+ WT.Constant.Api.SETTINGS_VERSION +'/json?appId=' + WT.Constant.Api.APP_UUID + '&appVersion='+WT.Constant.Api.APP_VERSION;    
        //send to jlr backend
        //For last Item we need to pass method as delete
        if(dataToSend.value.settings.length !== 0){
            WT.Service.Api.sendToJlrBackEnd(apiUrl,"POST",WT.Constant.Api.LOC_RETRY_COUNTER,dataToSend,
            function (successResponse) { 
                //Success Call Back
                WT.Service.Afw.sidePanelFavUpdate();
                onSuccess(dataToSend.value,successResponse);    
            }, function (errorResponse) { 
                // Error Call Back
                onError(errorResponse);    
            });
        }else{
            WT.Service.Api.sendToJlrBackEnd(apiUrl,"DELETE",WT.Constant.Api.LOC_RETRY_COUNTER,{},
            function (successResponse) { 
                //Success Call Back
                WT.Service.Afw.sidePanelFavUpdate();
                onSuccess(dataToSend.value,successResponse);    
            }, function (errorResponse) { 
                // Error Call Back
                onError(errorResponse);    
            });
        }
    };

    //Check connectivity before upload
    WT.Service.Afw.getUserConnectivitySettings(function(connValue){
        if ((typeof connValue === "string") && connValue === WT.Constant.connectionParam.USER_CONNECTION_ENABLE) {
           WT.Service.Afw.getConnectivityStatus(function(connStatus){
                if((typeof connStatus === "string") && connStatus === WT.Constant.connectionParam.CONNECTION_AVAILABLE){ 
                    //Connection is fine to upload
                    readyForUpload();
                }else{
                    onError();
                }
           });
        } else {
            onError(); 
        }
    });
};

/*
 * Name: WT.Service.FavoriteHandler.addFavorite
 * Description: Function used to add single favorite
 * Parameters:
 * @param :{object}   - location Details
 * @param :{function} - success function
 * @param :{function} - error function
 * Returns:
 * None
 * Globals updated:
 * "WT-favData","WT-FAVDATA"
 * Tables updated:
 * None
 */
WT.Service.FavoriteHandler.addFavorite = function(locObj,onSuccess,onError){
    //Static Analysis Fixes
	//var favDataToAdd = new Object();
    var addObjkey = "_"+locObj.locationDetail.location.latitude+"_"+locObj.locationDetail.location.longitude;
	var addObjValue = locObj.locationDetail.location.name +""+ addObjkey +"_"+
                         locObj.locationDetail.today.temperature.minimum.value+"_"+locObj.locationDetail.today.temperature.maximum.value +"_"+
                         locObj.locationDetail.location.locationId;
						 
	var favDataToAdd = {key:addObjkey,label:"My Favourite City",value:addObjValue,			    localizedLabelMap:{}};					 
    /*favDataToAdd.key = addObjkey;
    favDataToAdd.label = "My Favourite City"; 
    favDataToAdd.value = locObj.locationDetail.location.name +""+ addObjkey +"_"+
                         locObj.locationDetail.today.temperature.minimum.value+"_"+locObj.locationDetail.today.temperature.maximum.value +"_"+
                         locObj.locationDetail.location.locationId;
    favDataToAdd.localizedLabelMap = new Object();*/
    WT.Service.FavoriteHandler.getFavDSM("WT-FAVDATA",function(successObj){
        if(successObj.value.settings.length !== WT.Constant.Api.MAXIMUM_RESULTS){
            if(successObj.value.settings.length !== 0){
                for(var favValue in successObj.value.settings){
                    if(successObj.value.settings[favValue] === favDataToAdd){
                        break;
                    }
                    if(successObj.value.settings.length === (parseInt(favValue)+1)){
                        successObj.value.settings.push(favDataToAdd);
                        WT.Global.logger("WT::addFavorite startupload", CI.Utils.Define.LOGSeverity.INFO);                    
                    }
                }
        }else{
            successObj.value.settings.push(favDataToAdd);
        }
        WT.Service.FavoriteHandler.uploadFavorite(successObj,function(value,succRes){
                        WT.Global.logger("WT::addFavorite setFav DSM", CI.Utils.Define.LOGSeverity.INFO);
                        WT.Service.FavoriteHandler.setFavDSM("WT-FAVDATA",value,function(){
                            WT.Global.logger("WT::addFavorite setFav cache", CI.Utils.Define.LOGSeverity.INFO);
                            WT.Global.cacheStorage.setItem("WT-favData", value);
                            onSuccess();
                        },function(){
                            onError();
                        });
                    },function(){
                        onError();
                    });
        }else{
            onError("listFull");
        }
    },function(){
        onError();
    });
};

/*
 * Name: WT.Service.FavoriteHandler.deleteFavorite
 * Description: Function used to delete single favorite
 * Parameters:
 * @param :{object}   - location ID
 * @param :{function} - success function
 * @param :{function} - error function
 * Returns:
 * None
 * Globals updated:
 * "WT-favData","WT-FAVDATA"
 * Tables updated:
 * None
 */
WT.Service.FavoriteHandler.deleteFavorite = function(locId,onSuccess,onError){
    //Static Analysis Fixes
	if (WT.Global.deleteProgress === true)
    {
        WT.Global.dataToDelete.push(locId);
        return;
    }
	
    WT.Service.FavoriteHandler.getFavDSM("WT-FAVDATA",function(successObj){
        if(successObj.value.settings.length !== 0){     
           // var iterationFavObj = successObj.value.settings;   
            var newCityValue;
            for(var favValue in successObj.value.settings){
                var iterationFavObj = successObj.value.settings[favValue].value.split('_');
                if(iterationFavObj.length >= 5){
                    iterationFavObj.splice(0,5);
                    newCityValue = iterationFavObj.join('_');
                }
                if(newCityValue == locId){
                    successObj.value.settings.splice(parseInt(favValue),1);
                    WT.Global.logger("WT::deleteFavorite startupload", CI.Utils.Define.LOGSeverity.INFO);
                    WT.Global.deleteProgress = true;
                    WT.Service.FavoriteHandler.uploadFavorite(successObj,function(value,succRes){                        
                    WT.Global.logger("WT::deleteFavorite update DSM", CI.Utils.Define.LOGSeverity.INFO);
                        WT.Service.FavoriteHandler.setFavDSM("WT-FAVDATA",value,function(){
                            WT.Global.logger("WT::deleteFavorite update cache", CI.Utils.Define.LOGSeverity.INFO);
                            WT.Global.cacheStorage.setItem("WT-favData", value);
                            WT.Global.deleteProgress = false;
                            onSuccess();
                            //now handle multi item delete
                             if(WT.Global.dataToDelete.length)
                             {
                                // call multi delete fn with value
                                WT.Service.FavoriteHandler.deleteMultiFavorite(successObj);
                             }
                        },
						function(){
                            WT.Global.deleteProgress = false;
                            onError();
                        });
                    },function(){
                        WT.Global.deleteProgress = false;
                        onError();
                    });
                    break;
                }
                if(successObj.value.settings.length === (parseInt(favValue)+1)){
                   onError();
                }
            }
        }else{
                
        }
    },function(){
       // onError();
    });
};

/*
 * Name: WT.Service.FavoriteHandler.loginToProfile
 * Description:@class
 *             Javascript fuction , which is used for logging in profile to view/add/delete favorites 
 * Parameters:
 * @param :
 * None
 * Returns:
 * None
 * Globals updated:
 * None
 * Tables updated:
 * None
 */
WT.Service.FavoriteHandler.loginToProfile = function(favClick, loginSuccessCallbck){
    WT.Global.logger("WT::FavoriteHandler::loginToProfile", CI.Utils.Define.LOGSeverity.INFO); 
    var popUpMsg, popUpTitle;
    if(favClick){
        popUpMsg = CI.Utils.Localization.translate("weat_Login_view_fav"); 
        popUpTitle = CI.Utils.Localization.translate("weat_View_Fav");

    }else{
        popUpMsg = CI.Utils.Localization.translate("weat_Login_fav");
        popUpTitle = CI.Utils.Localization.translate("weat_Add_fav");
    }                  
    WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_DECISION, popUpTitle, popUpMsg,
    function(loginYes){
        WT.Global.logger("WT::FavoriteHandler::Login popup Yes clicked", CI.Utils.Define.LOGSeverity.INFO);                
        WT.Global.favoriteLogin=true;
        CI.Vehicle.Profiles.tryToLogin(
            function (loginSuccessObj){
                if(loginSuccessObj){ 
                    WT.Global.logger("WT::FavoriteHandler::User Logged in "+JSON.stringify (loginSuccessObj['user-id']), CI.Utils.Define.LOGSeverity.INFO);                
                    WT.Service.FavoriteHandler.loggedIn=true;
                    loginSuccessCallbck("firstLogin");
                }
            }, function(errorObj){
                WT.Global.logger("WT::FavoriteHandler::User Loggin unsuccessfull "+JSON.stringify (errorObj), CI.Utils.Define.LOGSeverity.INFO);                
                WT.Service.FavoriteHandler.loggedIn=false;
                WT.Global.favoriteLogin=false;
            });
    },function(loginNo){
        WT.Global.logger("WT::FavoriteHandler::Login popup No clicked "+JSON.stringify (loginNo), CI.Utils.Define.LOGSeverity.INFO);              
    });
};

/*
 * Name: WT.Service.FavoriteHandler.getOverview
 * Description:@class
 *             Single function to fetch weather overview for all fav locations 
 * Parameters:
 * @param :
 * None
 * Returns:
 * None
 * Globals updated:
 * None
 * Tables updated:
 * None
 */

WT.Service.FavoriteHandler.getOverview = function(locations,onSuccess,onError){
    WT.Service.Afw.getUserConnectivitySettings(function (connValue) {
        if ((typeof connValue === "string") && connValue === WT.Constant.connectionParam.USER_CONNECTION_ENABLE) {
            WT.Service.Afw.getConnectivityStatus(function (connStatus) {
                if ((typeof connStatus === "string") && connStatus === WT.Constant.connectionParam.CONNECTION_AVAILABLE){
                    WT.Global.logger("WT::getOverview:connectivityCallBack success", CI.Utils.Define.LOGSeverity.INFO);
                    WT.Global.startLoading(CI.Utils.Localization.translate("weat_Loading_weather"), "full-loading");
                    var apiUrl = '/ad/we/overview/'+ WT.Constant.Api.API_VERSION +'/json?appId=' + WT.Constant.Api.APP_UUID + '&appVersion='+WT.Constant.Api.APP_VERSION +'&locations='+locations+ "&locale=" +
                        WT.Service.Api.CurrentLanguage;  
                        //send to jlr backend
                        WT.Service.Api.sendToJlrBackEnd(apiUrl,"GET",WT.Constant.Api.LOC_RETRY_COUNTER,{},function (successResponse) { 
                           //Success Call Back
                           // var favData = new Object();
                           // favData.value = successResponse;
                           // onSuccess(favData); 
        //////////////////////////////////////////////////////////////
                            //WT.Global.stopLoading();
                            //successObj=successObj.value;
                            var successObj= successResponse;
                            //Static Analysis Fixes
							var favData = {value:{"settings":[]}};
							//Static Analysis Fixes
							//var favData = new Object();
                            //favData.value={"settings":[]};
                            for(var index in successObj){ 
                                    
								
                                    var addObjkey = "_"+successObj[index].latitude+"_"+successObj[index].longitude;
                                    var favDataValue = successObj[index].name +""+ addObjkey +"_"+
                                         successObj[index].temperature.minimum.value+"_"+successObj[index].temperature.maximum.value +"_"+
                                         successObj[index].locationId;
									var favDataToAdd = {key:addObjkey,label:"My Favourite City",value:favDataValue,localizedLabelMap:{}};
                                    favData.value.settings.push(favDataToAdd);
                            }
                            onSuccess(favData.value.settings);

                            WT.Service.FavoriteHandler.uploadFavorite(favData,function(value,succRes){  
                                WT.Global.logger("WT::getOverview:uploadFavorite update DSM", CI.Utils.Define.LOGSeverity.INFO);
                                WT.Service.FavoriteHandler.setFavDSM("WT-FAVDATA",value,function(){
                                    WT.Global.logger("WT::getOverview:setFavDSM update cache", CI.Utils.Define.LOGSeverity.INFO);
                                    WT.Global.cacheStorage.setItem("WT-favData", value);
                                    var favUpdatedTime = new Date();                               
                                    WT.Service.FavoriteHandler.setFavDSM("WT-FAVDATATIME",favUpdatedTime,function(successObj){
                                        WT.Global.logger("WT::getOverview:setFavDSM"+JSON.stringify(successObj), CI.Utils.Define.LOGSeverity.INFO);
                                        WT.Global.cacheStorage.setItem("WT-favDataTime", favUpdatedTime);
                                        WT.Global.favUpdateBefore12Hour = false;
                                    },function(errorObj){
                                        WT.Global.logger("WT::getOverview:getOverview:setFavTimeDSM error"+JSON.stringify(errorObj), CI.Utils.Define.LOGSeverity.INFO);                                   
                                    });
                                    //onSuccess();
                                },function(){                            
                                   WT.Global.logger("WT::getOverview:setFavDSM error"+JSON.stringify(errorObj), CI.Utils.Define.LOGSeverity.ERROR);
                                });
                            },function(errorObj){
                                WT.Global.logger("WT::getOverview:uploadFavorite error"+JSON.stringify(errorObj), CI.Utils.Define.LOGSeverity.ERROR);
                                WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), WT.Constant.screenNames.FULL_LOADING);
                                $("#nav-myloc").trigger("mousedown");
                                $("#nav-myloc").trigger("mouseup");
                            });                   
                        }, function (errorResponse) { 
                            // Error Call Back
                            onError(errorResponse);    
                        });
                    }else{
                        WT.Global.logger("WT::getOverview:connectivityCallBack unable to connect", CI.Utils.Define.LOGSeverity.INFO);
                        WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), "full-loading");                       
                    }
                });
        } else {
            //show pop-up that data connection disabled
            if (WT.Global.appShow === true) {
               WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"",CI.Utils.Localization.translate("weat_Data_noconnect"));
            }
            $("#nav-myloc").trigger("mousedown");
                    $("#nav-myloc").trigger("mouseup");
        }
    });
};
/*
 * Name: WT.Service.FavoriteHandler.deleteMultiFavorite
 * Description: Function used to delete multipple favorite
 * Parameters:
 * @param :{object}   - settings Object
 * @param :{function} - success function
 * @param :{function} - error function
 * Returns:
 * None
 * Globals updated:
 * "WT-favData","WT-FAVDATA"
 * Tables updated:
 * None
 */

WT.Service.FavoriteHandler.deleteMultiFavorite = function(successObj, onSuccess, onError){
    WT.Global.logger("WT::deleteMultiFavorite length is:"+successObj.value.settings.length);
    if(successObj.value.settings.length !== 0){
        var newCityValue;
        //Iterate reverse since splice is involved
        for(var favCount = successObj.value.settings.length; favCount--;){
                WT.Global.logger("WT::deleteMultiFavorite loop :"+successObj.value.settings[favCount].value, CI.Utils.Define.LOGSeverity.INFO);
                var iterationFavObj = successObj.value.settings[favCount].value.split('_');
                if(iterationFavObj.length >= 5){
                    iterationFavObj.splice(0,5);
                    newCityValue = iterationFavObj.join('_');
                }
                //WT.Global.logger("WT::deleteMultiFavorite queue is: "+WT.Global.dataToDelete, CI.Utils.Define.LOGSeverity.INFO);
                //WT.Global.logger("WT::deleteMultiFavorite elemet in settings is: "+newCityValue, CI.Utils.Define.LOGSeverity.INFO);
                if (WT.Global.dataToDelete.indexOf(newCityValue) > -1){
                    successObj.value.settings.splice(parseInt(favCount),1);
                    WT.Global.logger("WT::deleteMultiFavorite matched locationId is "+newCityValue, CI.Utils.Define.LOGSeverity.INFO);
                    //WT.Global.deleteProgress = true;
                }
            }
            WT.Global.logger("WT::deleteMultiFavorite Queue: "+WT.Global.dataToDelete, CI.Utils.Define.LOGSeverity.INFO);
            WT.Global.sentToDelete = WT.Global.dataToDelete;
            WT.Global.logger("WT::deleteMultiFavorite upload"+JSON.stringify(successObj), CI.Utils.Define.LOGSeverity.INFO);
            WT.Service.FavoriteHandler.uploadFavorite(successObj, function(retValue, succRes){                        
                    WT.Global.logger("WT::deleteMultiFavorite update DSM length is "+retValue.settings.length, CI.Utils.Define.LOGSeverity.INFO);
                        WT.Service.FavoriteHandler.setFavDSM("WT-FAVDATA",retValue,function(){
                            WT.Global.logger("WT::deleteMultiFavorite update cache", CI.Utils.Define.LOGSeverity.INFO);
                            WT.Global.cacheStorage.setItem("WT-favData", retValue);
                            // Check for any more item to be deleted
                             if(WT.Global.dataToDelete != WT.Global.sentToDelete)
                             {
                                WT.Global.logger("WT::deleteMultiFavorite multi delete inside deleteMultiFavorite", CI.Utils.Define.LOGSeverity.INFO);
                                for (var i=0; i<WT.Global.sentToDelete.length; i++) {
                                        //var index = undefined;
                                        //Static Analysis Fixes
										var index = null;
										while ((index = WT.Global.dataToDelete.indexOf(WT.Global.sentToDelete[i])) !== -1) {
                                        WT.Global.dataToDelete.splice(index, 1);
                                        }
                                    }                       
                                WT.Service.FavoriteHandler.deleteMultiFavorite(successObj);
                             }else{
                                   WT.Global.logger("WT::deleteMultiFavorite completed", CI.Utils.Define.LOGSeverity.INFO);
                                   WT.Global.dataToDelete =[];
                             }
                             // update UI
                        },function(){
                            WT.Global.logger("WT::deleteMultiFavorite : error in setFavDSM", CI.Utils.Define.LOGSeverity.INFO);
                            //onError();
                        });
                    },function(){
                        WT.Global.logger("WT::deleteMultiFavorite : error in uploadFavorite", CI.Utils.Define.LOGSeverity.INFO);
                        //onError();
                    });

    }

};