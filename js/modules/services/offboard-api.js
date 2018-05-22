/**
 * File Name: offboard-api.js
 * Description: Service module handles off-board API calls, connection retry and AFW error handling.
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Sreejith P
 * Creation Date: 11 January, 2018
 *
 * MODIFICATION RECORDS:

 **/

//Weather Service Object
WT.Service = WT.Service || {};
//Weather Service API Object
WT.Service.Api = {};

//Weather Service API Object for Current Language (English by default)
//The below object will be updated based on system language in WT.Service.Afw.getSystemLanguage during App launch.

WT.Service.Api.CurrentLanguage = WT.Constant.Api.DEFAULT_LANGUAGE;

/**
 * Name: WT.Service.Api.getLocationWTData
 * Description: Public method which makes a call to fetch current location details.
 *      script to make a off-board call for current location
 * Parameters:
 * @param {string} - queryStrings Query string (JSON object with additional parameters)
 * @param {function} - getLocationDataSuccess Success call back function
 * @param {function} - getLocationDataError Error call back function
 * Returns:
 * @success - {Object} Weather JSON object
 * @error - {Object} Error object response
 * Globals updated:
 * None
 * Tables updated:
 * None
 */

WT.Service.Api.getLocationWTData = function (queryStrings, getLocationDataSuccess, getLocationDataError) {

//Set current screen as screen name
	queryStrings.screen = WT.Route.location.currentScreen;
	var apiURL = "/ad/we/today/" + WT.Constant.Api.API_VERSION + "/json?lat=" + queryStrings.latitude + "&long=" + queryStrings.longitude + "&locale=" +
	WT.Service.Api.CurrentLanguage + "&temperatureUnits="+ WT.Constant.TEMP_UNIT +"&delta="+WT.Constant.DELTA+"&appId=" + WT.Constant.Api.APP_UUID + "&appVersion=" + WT.Constant.Api.APP_VERSION +
	"&measurement=" + WT.Constant.DISTANCE_UNIT + "&includeHourly=" + true + "&includeDaily=" +true;
	var retryCounter = queryStrings.retries;
	WT.Global.logger("Service::getLocationData calling sendToJlrBackEnd", CI.Utils.Define.LOGSeverity.INFO);
	WT.Service.Api.sendToJlrBackEnd(apiURL, "GET", retryCounter, queryStrings,
		function (successResponse) { //Success Call Back
			getLocationDataSuccess(successResponse); //Success Response
		}, function (errorResponse) { // Error Call Back
		getLocationDataError(errorResponse); //Success Response
	});
};
/**
 * Name: WT.Service.Api.sendToJlrBackEnd
 * Description: Public method which sends request to make an off-board calls using CI.System.Notifier.sendToJLRBackend.
 *      script makes an off-board call to the URL passed
 *      On success response call the success call back function
 *      On failure response or during any error scenarios calls the error call back function
 * Parameters:
 * @param {string} - apiUrl API URL
 * @param {string} - method API call method (GET/POST)
 * @param {integer} - retryCounter maximum retry
 * @param {string} - queryStrings Query string (JSON object with additional parameters)
 * @param {function} - sendToJlrBackEndSuccess Success call back function
 * @param {function} - sendToJlrBackEndError Error call back function
 * Returns:
 * @success - {Object} Weather JSON object
 * @error - {Object} Error object response
 * Globals updated: None
 * Tables updated: None
 */

WT.Service.Api.sendToJlrBackEnd = function (apiUrl, method, retryCounter, queryStrings, sendToJlrBackEndSuccess, sendToJlrBackEndError) {
	//Check request has already send
	if (queryStrings.screen === undefined || WT.Global.cacheStorage.getItem(queryStrings.screen) === undefined || WT.Global.cacheStorage.getItem(queryStrings.screen) === 1){
		//Set request send false
		WT.Global.cacheStorage.setItem(queryStrings.screen, 0);
		if (retryCounter > 0) {
			retryCounter--;
		//var header = {"x-ci-deviceid": "TSTJATELX351TEL02", "x-ci-authentication": "5116b652-7c6f-4154-95f9-d056962a98f0"}; //Only to be used in SDK
		//Note: headers key has to be removed from sendToJLRBackend when using in RIG
		CI.System.Notifier.sendToJLRBackend({
			path: apiUrl,
			method: method,
			data: queryStrings.value,
			timeout: WT.Constant.Api.REQUEST_TIMEOUT//,
			//headers:header
		},
			function (offboardSuccessResponse, textStatus, jqXHR) {
				//Set request send true
				WT.Global.cacheStorage.setItem(queryStrings.screen, 1);
				if (!jQuery.isEmptyObject(offboardSuccessResponse)) {
					WT.Global.logger("Service::sendToJlrBackEnd - Valid Success response", CI.Utils.Define.LOGSeverity.INFO);
					sendToJlrBackEndSuccess(offboardSuccessResponse);
				} else {
					WT.Global.logger("Service::sendToJlrBackEnd- Empty Success response " + apiUrl, CI.Utils.Define.LOGSeverity.ERROR);
					sendToJlrBackEndError({error: CIErrors.CONNECTION_ERROR}); //Error Call Back
				}
			},
			function (offboardErrorResponse) {
				//Set request send true
				WT.Global.cacheStorage.setItem(queryStrings.screen, 1);
				WT.Global.logger("Service::sendToJlrBackEnd-Error- " + JSON.stringify(offboardErrorResponse), CI.Utils.Define.LOGSeverity.ERROR);
				if (offboardErrorResponse.error !== undefined && (offboardErrorResponse.error.code === CIErrors.AUTHENTICATION_TOKEN_INVALID.code || offboardErrorResponse.error.code === CIErrors.VEHICLE_AUTH_INVALID_CREDENTIALS_ERROR.code || CIErrors.isCertificateError(offboardErrorResponse.error.code))) {
					WT.Global.logger("Service::sendToJlrBackEnd- Non Retry Error - " + JSON.stringify(offboardErrorResponse), CI.Utils.Define.LOGSeverity.ERROR);
					sendToJlrBackEndError(offboardErrorResponse); //Error Response

				} else {
					WT.Service.Api.sendToJlrBackEnd(apiUrl, method, retryCounter, queryStrings, sendToJlrBackEndSuccess, sendToJlrBackEndError); //Retry
				}

			});
		} else {
			//Set request send true
			WT.Global.cacheStorage.setItem(queryStrings.screen, 1);
			WT.Global.logger("Service::sendToJlrBackEnd -retries finished and Timer Cleared", CI.Utils.Define.LOGSeverity.INFO);
			sendToJlrBackEndError({error: CIErrors.CONNECTION_ERROR}); //Error Call Back
		}

	} else{
		WT.Global.logger("Service::sendToJlrBackEnd - API call rejected (Request in-progress) - " + apiUrl, CI.Utils.Define.LOGSeverity.INFO);
	}

};

/**
 * Name: WT.Service.Api.getWTSearchList
 * Description: Public method to fetch search list with or without latitude and longitude.
 *      script to make a off-board call for search list
 *
 * Parameters:
 * @param {string} - queryStrings Query string (JSON object with additional parameters)
 * @param {function} - searchListSuccess Success call back function
 * @param {function} - searchListError Error call back function
 * Returns:
 * @success - {Object} Weather Search List JSON object
 * @error - {Object} Error object response
 * Tables updated: None
 *
 */

WT.Service.Api.getWTSearchList = function (queryStrings, searchListSuccess, searchListError) {
    //Check if search key is avaiable
    if (typeof queryStrings.searchKey !== 'undefined') {

        var apiURL = "";
        //Check if latitude and longitude exists.
        if (typeof queryStrings.latitude !== 'undefined' && typeof queryStrings.longitude !== 'undefined') {
            //URL with latitude and longitude
            apiURL = "/ad/we/locations/" + WT.Constant.Api.API_VERSION + "/json/" + queryStrings.searchKey + "?myLat=" + queryStrings.latitude + "&myLong=" + queryStrings.longitude + "&locale=" +
            WT.Service.Api.CurrentLanguage + "&appId=" + WT.Constant.Api.APP_UUID + "&appVersion=" + WT.Constant.Api.APP_VERSION + "&maxResults=" + WT.Constant.Api.MAXIMUM_RESULTS;
            WT.Global.logger("Service::searchListRequest - API URL with latitude and longitude", CI.Utils.Define.LOGSeverity.INFO);
        } else {
            //URL without latitude and longitude
            apiURL = "/ad/we/locations/" + WT.Constant.Api.API_VERSION + "/json/" + queryStrings.searchKey + "?locale=" +
            WT.Service.Api.CurrentLanguage + "&appId=" + WT.Constant.Api.APP_UUID + "&appVersion=" + WT.Constant.Api.APP_VERSION + "&maxResults=" + WT.Constant.Api.MAXIMUM_RESULTS;
            WT.Global.logger("Service::searchListRequest - API URL without latitude and longitude", CI.Utils.Define.LOGSeverity.INFO);
        }

        //Make a backend Call
        var retryCounter = queryStrings.retries;
        WT.Global.logger("Service::getLocationData calling sendToJlrBackEnd", CI.Utils.Define.LOGSeverity.INFO);
        WT.Service.Api.sendToJlrBackEnd(apiURL, "GET", retryCounter, queryStrings,
        function (successResponse) { //Success Call Back
            searchListSuccess(successResponse); //Success Response
        }, function (errorResponse) { // Error Call Back
            searchListError(errorResponse); //Success Response
        });
    } else {
        //If search keyword doesnot exist log search key missing message and return connection error.
        WT.Global.logger("Service::searchListRequest searchKey missing", CI.Utils.Define.LOGSeverity.INFO);
        searchListError({error: CIErrors.CONNECTION_ERROR}); //Error Call Back
    }
};

/**
* Name: WT.Service.Api.getWTDataByLocationId
* Description: Public method to fetch location weather using location ID.
*      script to make a off-board call for WT using location ID
*
* Parameters:
* @param {string} - queryStrings Query string (JSON object with additional parameters)
* @param {function} - locatioIdSearchSuccess Success call back function
* @param {function} - locatioIdSearchError Error call back function
* Returns:
* @success - {Object} Weather JSON object
* @error - {Object} Error object response
* Tables updated: None
*/

WT.Service.Api.getWTDataByLocationId = function (queryStrings, locatioIdSearchSuccess, locatioIdSearchError) {

    //Check if locationId is available
    if (typeof queryStrings.locationId !== 'undefined') {
        //Set location ID as screen name
        //queryStrings.screen = queryStrings.locationId;
        var apiURL = "/ad/we/today/" + WT.Constant.Api.API_VERSION + "/json?locationId=" + queryStrings.locationId + "&locale=" +
	WT.Service.Api.CurrentLanguage + "&temperatureUnits="+ WT.Constant.TEMP_UNIT +"&appId=" + WT.Constant.Api.APP_UUID + "&appVersion=" + WT.Constant.Api.APP_VERSION +
	"&measurement=" + WT.Constant.DISTANCE_UNIT + "&includeHourly=" + true + "&includeDaily=" +true;
        //Make a backend Call
        WT.Global.logger("Api::getWTDataByLocationId calling sendToJlrBackEnd", CI.Utils.Define.LOGSeverity.INFO);
        WT.Service.Api.sendToJlrBackEnd(apiURL, "GET", queryStrings.retries, queryStrings,
        function (successResponse) { //Success Call Back
            WT.Global.logger("Api::getWTDataByLocationId sendToJlrBackEnd success callback", CI.Utils.Define.LOGSeverity.INFO);
            locatioIdSearchSuccess(successResponse); //Success Response
        }, function (errorResponse) { // Error Call Back
           WT.Global.logger("Api::getWTDataByLocationId sendToJlrBackEnd error callback", CI.Utils.Define.LOGSeverity.INFO);
           locatioIdSearchError(errorResponse); //Success Response
        });
    } else {
        //Log locationId missing and return connection error.
        WT.Global.logger("Api::getWTDataByLocationId locationId missing", CI.Utils.Define.LOGSeverity.ERROR);
        locatioIdSearchError({error: CIErrors.CONNECTION_ERROR}); //Error Call Back
    }
};