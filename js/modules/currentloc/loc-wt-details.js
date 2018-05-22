/*
 * File Name: loc-WT-details.js
 * Description: Contains common functionalities for destinaltion, current location and search details module.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Deepika Basavaraju
 * Creation Date: 19 Jan 2018
 * Version : 1.0
 *
 * MODIFICATION RECORDS:
 /

/*
 * @namespace
 * Javascript WT.locWTDetails class, which is used for calling common functionalities for destinaltion, current location and search details module.
 */
WT.LocWTDetails = WT.LocWTDetails || {};

var locWTDetailClass = function () {

    var WTDetail = this;
    var wtKeyMinTemp = WT.Route.location.currentScreen + "_TEMP_MIN";
    var wtKeyMaxTemp = WT.Route.location.currentScreen + "_TEMP_MAX";
    var wtKeyTemperature = WT.Route.location.currentScreen + "_TEMPERATURE";
    //var updateLocDetailsTimer = "";
    /*
     * Name: updateTimeDetails
     * Description: Public method which is called for updating time details.
     *              If cached data is of current day's data updated time is shown
     *              If cached data is one day older updated yesterday is shown
     *              If cached data is more than  day older updated Data is shown
     * Parameters:
     * @param : WTdata of Current location
     * Returns: None
     * Globals updated: None
     */

    WTDetail.updateTimeDetails = function (locDetails) {
        if (locDetails.updatedDate === WT.Global.getCurrentDate()) {
            var updateTimeDisp = WT.Global.getTimeFormat(locDetails.updatedTime);
            $('#updateSpan').html(updateTimeDisp);
        } else if (locDetails.updatedDate === WT.Global.getYesterdayDate()) {
            $('#updateSpan').html(CI.Utils.Localization.translate("weat_updated_yersterday"));
            $(".wt-info.screen").addClass('one-hr-old');
        } else {
            $('#updateSpan').html(CI.Utils.Localization.translate("weat_updated_date", {'PARAM0': locDetails.updatedDate}));
            $(".wt-info.screen").addClass('one-hr-old');
        }
    };


    /*
     * Name: updateBackground
     * Description: Public method which is called to reflect background w.r.t feed data.
     *              
     * Parameters: {number} weatherIcon is used to map distinct weather states to graphics
     * Returns: None
     * Globals updated: None
     * 
     */
    WTDetail.updateBackground = function (weatherBg, updateThemeCallBack) {
        WT.Global.logger("WTDetail::updateBackground() Entered with Icon: "+weatherBg, CI.Utils.Define.LOGSeverity.TRACE);
        // iconTyppe is used to map distinct weather states to background graphics
        WT.Global.updateBackgroundTheme(weatherBg, function(currentTheme){
           // if(currentTheme !== WT.Global.currPrevTheme){
                $("#container").addClass(currentTheme);   
                WT.Global.currPrevTheme = currentTheme;
           // }
        });
    };
    
    /*
     * Name: fetchIconTheme
     * Description: Public method which is used to fetch icon class.
     *              
     * Parameters: 
     * @param:{number} weatherIcon is used to map distinct weather states to graphics
     * @param:{function} call back
     * Returns: None
     * Globals updated: None
     * 
     */
    WTDetail.fetchIconTheme = function(iconToFetch,iconCallBack){
        var iconToShow;
        switch (iconToFetch.toString()) {
            /*1:Sunny
             2:Mostly sunny
             30:Hot
             */
            case '1':
            case '2':
            case '30':
                iconToShow = "sunnyIcon";
                break;
                /*3:Partly Sunny 
                 4:Intermittent clouds
                 35:36:cloudy day/night TBD
                 */
            case '3':
            case '4':
                iconToShow = "sunnywithcloudIcon";
                break;
                /*5:Hazy
                 */
            case '5':
                iconToShow = "hazyIcon";
                break;
                /*6:mostly cloudy
                 7:cloudy
                 8:overcast 
                 
                 */
            case '6':
            case '7':
            case '8':
                iconToShow = "overcastIcon";
                break;
                /*14:Partly Sunny with showers
                 */
            case '14':
                iconToShow = "sunnywithrainIcon";
                break;
                /*
                 24:Ice
                 31:cold
                 */
            case '24':
            case '31':
                iconToShow = "iceIcon";
                break;
                /*25:sleet 
                 29:rain and snow
                 */
            case '29':
                iconToShow = "rainwithsnowIcon";
                break;
                /*
                 11:Fog
                 */
            case '11':
                iconToShow = "foggyIcon";
                break;
                /*12:showers
                 13:mostly cloudy with showers
                 18:rain
                 39:parlty showers
                 40:mostly cloudy with showwers     
                 */
            case '12':
            case '13':
            case '18':
                iconToShow = "rainIcon";
                break;
            case '39':
            case '40':
                iconToShow = " moonwithrainIcon";
                break;
                /*17:Partly Sunny with t/s
                 15:thunderstorms
                 16:Mostly cloudy with t/s
                 41:TBD
                 42:TBD
                 */
            case '15':
            case '16':
            case '17':
                iconToShow = "electricstormIcon";
                break;
            case '41':
            case '42':
                iconToShow = "moonwithstormIcon";
                break;
                /*
                 '19':flurries
                 '20':mostly cloudy with flurries
                 '22':snow
                 '23':mostly cloudy with snow
                 */
                /*Night snow TBD for 43 and 44*/
            case '43':
            case '44':
                iconToShow = "moonwithsnowIcon";
                break;
            case '19':
            case '20':
            case '22':
            case '23':
            case '25':
                iconToShow = "snowIcon";
                break;
                /*
                 '26':freezing rain
                 */
            case '26':
                iconToShow = "hailIcon";
                break;
                /* 21 : partly sunny with flurries*/
            case '21':
                iconToShow = "sunnywithsnowIcon";
                break;
                /*32:windy TBD day/night*/
            case '32':
                iconToShow = "windIcon";
                break;
                /*33 34:clear,mostly clear TBD day/night*/
            case '33':
            case '34':
                iconToShow = "moonIcon";
                break;
                /*35:partly cloudy 36:inter cloudy TBD DAY/NIGHT    
                 38:TBD*/
            case '35':
            case '36':
            case '38':
                iconToShow = "moonwithcloudIcon";
                break;
                /*mOON HAZY 37*/
            case '37':
                iconToShow = "hazywithmoonIcon";
                break;
            case 'Rain And Snow':
                iconToShow = "rainandsnowwithmoonIcon";
                break;
            case 'Foggy Night':
                iconToShow = "foggywithmoonIcon";
                break;
            case 'Hail Night':
                iconToShow = "hailwithmoonIcon";
                break;
            default:
                iconToShow = '';
                break;
        }

        iconCallBack(iconToShow);
    };

    WTDetail.updateIcon = function (weatherIcon){
        this.fetchIconTheme(weatherIcon,function(iconToDisplay){
                $("#themeImage").attr("class","themeImage content_left "+iconToDisplay+"");
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
    WTDetail.updateLocDetails = function (locDetails) {
        WT.Global.logger("WTDetail::updateLocDetails() calls updateBackground()", CI.Utils.Define.LOGSeverity.TRACE);
        var updateTimer = 0;
        //update background details
        WTDetail.updateBackground(locDetails.locationDetail.today.weatherIcon);

        //update icon details
        WTDetail.updateIcon(locDetails.locationDetail.today.weatherIcon);

        //clearTimeout(updateLocDetailsTimer);       

        $('#locationSpan').html(locDetails.locationDetail.location.name); 
        
        wtKeyTemperature=Math.round(locDetails.locationDetail.today.temperature.current.value)+"&#176;"+locDetails.locationDetail.today.temperature.current.unit;
        $('#currentTemp').html(wtKeyTemperature);  

        wtKeyMinTemp=Math.round(locDetails.locationDetail.today.temperature.minimum.value)+"&#176;"+locDetails.locationDetail.today.temperature.minimum.unit;
        $('#minTemp').html(wtKeyMinTemp); 

        wtKeyMaxTemp=Math.round(locDetails.locationDetail.today.temperature.maximum.value)+"&#176;"+locDetails.locationDetail.today.temperature.maximum.unit;
        $('#maxTemp').html(wtKeyMaxTemp);

        WT.Global.translateWeatherText("#weatherStatus span", locDetails.locationDetail.today.weatherIcon);      

    };    

};


