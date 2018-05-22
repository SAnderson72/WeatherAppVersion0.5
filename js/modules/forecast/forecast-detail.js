
/*
 * File Name: Forecast-detail.js
 * Description: Launch module to handle app initialization and launch process.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Vinny V
 * Creation Date: 31 Jan 2018
 * Version : 1.0
 *
 * MODIFICATION RECORDS:
 * /


/*
 * @namespace
 * Javascript WT.Forecastdetail object, which is used for initialization of Forecast Detail
 */
 
WT.Forecastdetail = WT.Forecastdetail || {};

//Global varible
WT.Forecastdetail.currentTab = "";
var tabExpand24Hr = false;
var tabExpand5Day = false;
var swipeTrigger = false;
var eachSlideWidth = 0;
var vehicleType;

    /*
    * Name: WT.Forecastdetail.click24hrFirstTab
    * Description: This function opens/close the 24hr page first tab and populate the data
    * Parameters:
    * @param :  None
    * Returns: None
    * Globals updated: None
    */
    WT.Forecastdetail.click24hrFirstTab = function(){
        if($(".tfhColoumFirst").is(':animated') || swipeTrigger === true){
        return false;
        }
        $(".tfhColoumFirst .coloum_right").hide();
        $(".twentyFourHourlist .border").css({"margin": "0"});
        if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DISPLAY_VARIANT) === WT.Constant.Api.VARIANT_TEN){
            
            if(tabExpand24Hr){
                tabExpand24Hr = false;
                $(".tfhColoumFirst").animate({width: '140px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "0"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst .border").animate({top: '20px', bottom: '20px'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").css({opacity: '1', "pointer-events": "auto"});
                
                
            }else{
                tabExpand24Hr = true; 
                $(".tfhColoumFirst").animate({width: '560px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst .border").animate({top: '117px', bottom: '117px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "420px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").css({opacity: '0.4',"pointer-events": "none"});
                setTimeout(function(){$(".tfhColoumFirst .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_ANIMATION_TIMER);
                $(".tfhColoumThird .border").css({"margin-left": "-1px"});
            }
        }else{
            if(tabExpand24Hr){
                tabExpand24Hr = false;
                $(".tfhColoumFirst").animate({width: '126px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "0"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst .border").animate({top: '10px', bottom: '0'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").css({opacity: '1', "pointer-events": "auto"});
                
                
            }else{
                tabExpand24Hr = true; 
                $(".tfhColoumFirst").animate({width: '508px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst .border").animate({top: '110px', bottom: '78px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "381px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").css({opacity: '0.4',"pointer-events": "none"});
                setTimeout(function(){$(".tfhColoumFirst .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_ANIMATION_TIMER);
                $(".tfhColoumThird .border").css({"margin-left": "-1px"});
            }
        }
    };
    
    /*
    * Name: WT.Forecastdetail.click24hrSecondTab
    * Description: This function opens/close the 24hr page second tab and populate the data
    * Parameters:
    * @param :  None
    * Returns: None
    * Globals updated: None
    */
    WT.Forecastdetail.click24hrSecondTab = function(){

        if($(".tfhColoumSecond").is(':animated') || swipeTrigger === true){
           return false;
        }
        $(".tfhColoumSecond .coloum_right").hide();
        $(".twentyFourHourlist .border").css({"margin": "0"});
         if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DISPLAY_VARIANT) === WT.Constant.Api.VARIANT_TEN){
            if(tabExpand24Hr){
                tabExpand24Hr = false;
                $(".tfhColoumSecond").animate({width: '140px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "0"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumSecond .border").animate({top: '20px', bottom: '20px'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").css({opacity: '1',"pointer-events": "auto"});
                
                
            }else{
                tabExpand24Hr = true;
                $(".tfhColoumSecond").animate({width: '560px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "420px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumSecond .border").animate({top: '117px', bottom: '117px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").css({opacity: '0.4',"pointer-events": "none"});
                setTimeout(function(){$(".tfhColoumSecond .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_ANIMATION_TIMER);
                $(".tfhColoumThird .border").css({"margin-left": "-1px"});
            }
        }else{
            if(tabExpand24Hr){
                tabExpand24Hr = false;
                $(".tfhColoumSecond").animate({width: '127px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "0"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumSecond .border").animate({top: '10px', bottom: '0'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").css({opacity: '1',"pointer-events": "auto"});
                
                
            }else{
                tabExpand24Hr = true;
                $(".tfhColoumSecond").animate({width: '508px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "381px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumSecond .border").animate({top: '110px', bottom: '78px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").css({opacity: '0.4',"pointer-events": "none"});
                setTimeout(function(){$(".tfhColoumSecond .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_ANIMATION_TIMER);
                $(".tfhColoumThird .border").css({"margin-left": "-1px"});
            }
        }
    };
    /*
    * Name: WT.Forecastdetail.click24hrThirdTab
    * Description: This function opens/close the 24hr page third tab and populate the data
    * Parameters:
    * @param :  None
    * Returns: None
    * Globals updated: None
    */
    WT.Forecastdetail.click24hrThirdTab = function(){
        
        if($(".tfhColoumThird").is(':animated') || swipeTrigger === true){
           return false;
        }
        $(".tfhColoumThird .coloum_right").hide();
        $(".twentyFourHourlist .border").css({"margin": "0"});
        if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DISPLAY_VARIANT) === WT.Constant.Api.VARIANT_TEN){
            if(tabExpand24Hr){
                tabExpand24Hr = false;
                $(".tfhColoumThird .border").animate({top: '20px', bottom: '20px'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumThird").animate({width: '140px', opacity: '1', "margin-left":'0'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").css({opacity: '1', "pointer-events": "auto"});
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "0"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            }else{
                tabExpand24Hr = true;
                $(".tfhColoumThird .border").animate({top: '117px', bottom: '117px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumThird").animate({width: '560px', opacity: '1', "margin-left":'-140px'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond").animate({"margin-left":'-140px'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFour,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "280px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").css({opacity: '0.4',"pointer-events": "none"});
                setTimeout(function(){$(".tfhColoumThird .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_ANIMATION_TIMER);
                //$(".tfhColoumFive .border").css({"margin-right": "1px"});
                //$(".tfhColoumFirst .border").css({"margin-left": "1px"});
            }
        }else{
            if(tabExpand24Hr){
                tabExpand24Hr = false;
                $(".tfhColoumThird .border").animate({top: '10px', bottom: '0'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumThird").animate({width: '127px', opacity: '1', "margin-left":'0'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").css({opacity: '1', "pointer-events": "auto"});
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "0"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            }else{
                tabExpand24Hr = true;
                $(".tfhColoumThird .border").animate({top: '110px', bottom: '78px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumThird").animate({width: '508px', opacity: '1', "margin-left":'-127px'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond").animate({"margin-left":'-127px'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFour,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "254px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumFour,.tfhColoumFive,.tfhColoumSix").css({opacity: '0.4',"pointer-events": "none"});
                setTimeout(function(){$(".tfhColoumThird .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_ANIMATION_TIMER);
                $(".tfhColoumFive .border").css({"margin-right": "1px"});
                $(".tfhColoumFirst .border").css({"margin-left": "1px"});
            }
        }
    };
    /*
    * Name: WT.Forecastdetail.click24hrFourthTab
    * Description: This function opens/close the 24hr page fourth tab and populate the data
    * Parameters:
    * @param :  None
    * Returns: None
    * Globals updated: None
    */
    WT.Forecastdetail.click24hrFourthTab = function(){
        
        if($(".tfhColoumFour").is(':animated') || swipeTrigger === true){
           return false;
        }
        $(".tfhColoumFour .coloum_right").hide();
        $(".twentyFourHourlist .border").css({"margin": "0"});
        if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DISPLAY_VARIANT) === WT.Constant.Api.VARIANT_TEN){
            if(tabExpand24Hr){
                tabExpand24Hr = false;
                setTimeout(function (){$(".tfhColoumThird .border").show();$(".tfhColoumFour .border").hide();}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFour .border").animate({top: '20px', bottom: '20'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFour").animate({"margin-left": "0px",width: '140px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "0px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFive,.tfhColoumSix").css({opacity: '1', "pointer-events": "auto"});
            }else{
                tabExpand24Hr = true;
                $(".tfhColoumThird .border").hide();
                $(".tfhColoumFour .border").show();
                $(".tfhColoumFour").animate({"margin-left": "-280px", width: '560px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFour .border").animate({top: '117px', bottom: '117px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird").animate({"margin-left": "-280px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFive,.tfhColoumSix").animate({"margin-left": "140px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFive,.tfhColoumSix").css({"pointer-events": "none", opacity: '0.4'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                setTimeout(function(){$(".tfhColoumFour .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_ANIMATION_TIMER);
                //$(".tfhColoumSix .border").css({"margin-right": "1px"});
                //$(".tfhColoumSecond .border").css({"margin-left": "2px"});
            }
        }else{
            if(tabExpand24Hr){
                tabExpand24Hr = false;
                setTimeout(function (){$(".tfhColoumThird .border").show();$(".tfhColoumFour .border").hide();}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFour .border").animate({top: '10px', bottom: '0'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFour").animate({"margin-left": "0px",width: '127px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFive,.tfhColoumSix").animate({"margin-left": "0px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFive,.tfhColoumSix").css({opacity: '1', "pointer-events": "auto"});
            }else{
                tabExpand24Hr = true;
                $(".tfhColoumThird .border").hide();
                $(".tfhColoumFour .border").show();
                $(".tfhColoumFour").animate({"margin-left": "-254px", width: '508px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFour .border").animate({top: '110px', bottom: '78px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird").animate({"margin-left": "-254px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFive,.tfhColoumSix").animate({"margin-left": "127px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFive,.tfhColoumSix").css({"pointer-events": "none", opacity: '0.4'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                setTimeout(function(){$(".tfhColoumFour .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_ANIMATION_TIMER);
                $(".tfhColoumSix .border").css({"margin-right": "1px"});
                $(".tfhColoumSecond .border").css({"margin-left": "2px"});
            }
        }       
    };
    /*
    * Name: WT.Forecastdetail.click24hrFifthTab
    * Description: This function opens/close the 24hr page fifth tab and populate the data
    * Parameters:
    * @param :  None
    * Returns: None
    * Globals updated: None
    */
    WT.Forecastdetail.click24hrFifthTab = function(){
        if($(".tfhColoumFive").is(':animated') || swipeTrigger === true){
            return false;
        }
       $(".tfhColoumFive .coloum_right").hide();
       $(".twentyFourHourlist .border").css({"margin": "0"});
       if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DISPLAY_VARIANT) === WT.Constant.Api.VARIANT_TEN){
            if(tabExpand24Hr){
                tabExpand24Hr = false;
                $(".tfhColoumFive").animate({"margin-left": "0px",width: '140px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFive .border").animate({top: '20px', bottom: '20px'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour").animate({"margin-left": "0px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumSix").css({opacity: '1', "pointer-events": "auto"});
            }else{
                tabExpand24Hr = true;
                $(".tfhColoumFive").animate({marginLeft: "-420px", width: '560px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFive .border").animate({top: '117px', bottom: '117px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour").animate({"margin-left": "-420px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumSix").css({"pointer-events": "none", opacity: '0.4'});    
                setTimeout(function(){$(".tfhColoumFive .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_ANIMATION_TIMER);
                //$(".tfhColoumThird .border").css({"margin-left": "2px"});
            }
        }else{
            if(tabExpand24Hr){
                tabExpand24Hr = false;
                $(".tfhColoumFive").animate({"margin-left": "0px",width: '127px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFive .border").animate({top: '10px', bottom: '0'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour").animate({"margin-left": "0px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumSix").css({opacity: '1', "pointer-events": "auto"});
            }else{
                tabExpand24Hr = true;
                $(".tfhColoumFive").animate({marginLeft: "-381px", width: '508px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFive .border").animate({top: '110px', bottom: '78px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour").animate({"margin-left": "-381px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumSix").css({"pointer-events": "none", opacity: '0.4'});    
                setTimeout(function(){$(".tfhColoumFive .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_ANIMATION_TIMER);
                $(".tfhColoumThird .border").css({"margin-left": "2px"});
            }
        }        
    };
    /*
    * Name: WT.Forecastdetail.click24hrSixthTab
    * Description: This function opens/close the 24hr page sixth tab and populate the data
    * Parameters:
    * @param :  None
    * Returns: None
    * Globals updated: None
    */
    WT.Forecastdetail.click24hrSixthTab = function(){
        if($(".tfhColoumSix").is(':animated') || swipeTrigger === true ){
            return false;
        }
       $(".tfhColoumSix .coloum_right").hide();
       $(".twentyFourHourlist .border").css({"margin": "0"});
       if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DISPLAY_VARIANT) === WT.Constant.Api.VARIANT_TEN){
            if(tabExpand24Hr){
                tabExpand24Hr = false;
                $(".tfhColoumSix").animate({marginLeft: "0px",width: '140px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumSix .border").animate({top: '20px', bottom: '20px'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive").animate({"margin-left": "0"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive").css({opacity: '1', "pointer-events":"auto"});

            }else{
                tabExpand24Hr = true;
                $(".tfhColoumSix").animate({"margin-left": "-420px", width: '560px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER); 
                $(".tfhColoumSix .border").animate({top: '117px', bottom: '117px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive").css({"pointer-events":"none"});
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive").animate({"margin-left": "-420px", opacity:'0.4'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                setTimeout(function(){$(".tfhColoumSix .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_ANIMATION_TIMER);
                //$(".tfhColoumThird .border").css({"margin-left": "2px"});
            }
        }else{
            if(tabExpand24Hr){
                tabExpand24Hr = false;
                $(".tfhColoumSix").animate({marginLeft: "0px",width: '126px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumSix .border").animate({top: '10px', bottom: '0'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive").animate({"margin-left": "0"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive").css({opacity: '1', "pointer-events":"auto"});

            }else{
                tabExpand24Hr = true;
                $(".tfhColoumSix").animate({"margin-left": "-382px", width: '508px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER); 
                $(".tfhColoumSix .border").animate({top: '110px', bottom: '78px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive").css({"pointer-events":"none"});
                $(".tfhColoumFirst,.tfhColoumSecond,.tfhColoumThird,.tfhColoumFour,.tfhColoumFive").animate({"margin-left": "-381px", opacity:'0.4'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
                setTimeout(function(){$(".tfhColoumSix .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_ANIMATION_TIMER);
                $(".tfhColoumThird .border").css({"margin-left": "2px"});
            }
        }        
    };    
    /*
    * Name: WT.Forecastdetail.clickFiveDayFirstTab
    * Description: This function opens/close the 5day page first tab and populate the data
    * Parameters:
    * @param :  None
    * Returns: None
    * Globals updated: None
    */
    WT.Forecastdetail.clickFiveDayFirstTab = function(){
        if ($(".fiveDayFirstColoum").is(':animated') || swipeTrigger === true) {
            return false;
        }
        $(".fiveDayFirstColoum .coloum_right").hide();
        $(".fiveDaylist .border").css({"margin": "0"});
        if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DISPLAY_VARIANT) === WT.Constant.Api.VARIANT_TEN){
        if(tabExpand5Day){
            tabExpand5Day = false;
            $(".fiveDayFirstColoum").animate({width: '168', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum .border").animate({top: '20px', bottom: '20px'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").css({opacity: '1',"pointer-events": "auto"});
            $(".fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").animate({"margin-left": "0"});
            
        }else{
            tabExpand5Day = true;
            $(".fiveDayFirstColoum").animate({width: '504px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum .border").animate({top: '117px', bottom: '117px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").css({opacity: '0.4',"pointer-events": "none"});
            $(".fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").animate({"margin-left": "336px"});
            setTimeout(function(){$(".fiveDayFirstColoum .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayThirdColoum .border").css({"margin-left": "-1px"});
        }
    }else{
        if(tabExpand5Day){
            tabExpand5Day = false;
            $(".fiveDayFirstColoum").animate({width: '152', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum .border").animate({top: '10px', bottom: '0'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").css({opacity: '1',"pointer-events": "auto"});
            $(".fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").animate({"margin-left": "0"});
            
        }else{
            tabExpand5Day = true;
            $(".fiveDayFirstColoum").animate({width: '456px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum .border").animate({top: '110px', bottom: '78px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").css({opacity: '0.4',"pointer-events": "none"});
            $(".fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").animate({"margin-left": "304px"});
            setTimeout(function(){$(".fiveDayFirstColoum .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayThirdColoum .border").css({"margin-left": "-1px"});
        }
    }
        
    };
    /*
    * Name: WT.Forecastdetail.clickFiveDaySecondTab
    * Description: This function opens/close the 5day page second tab and populate the data
    * Parameters:
    * @param :  None
    * Returns: None
    * Globals updated: None
    */
    WT.Forecastdetail.clickFiveDaySecondTab = function(){
        if ($(".fiveDaySecondColoum").is(':animated') || swipeTrigger === true) {
            return false;
        }
        $(".fiveDaySecondColoum .coloum_right").hide();
        $(".fiveDaylist .border").css({"margin": "0"});
        if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DISPLAY_VARIANT) === WT.Constant.Api.VARIANT_TEN){
        if(tabExpand5Day){
            tabExpand5Day = false;
            $(".fiveDaySecondColoum").animate({width: '168px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDaySecondColoum .border").animate({top: '20px', bottom: '20px'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").animate({"margin-left": "0"});
            $(".fiveDayFirstColoum,.fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").css({opacity: '1',"pointer-events": "auto"});
        }else{
            tabExpand5Day = true;
            $(".fiveDaySecondColoum").animate({width: '504px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDaySecondColoum .border").animate({top: '117px', bottom: '117px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").css({opacity: '0.4',"pointer-events": "none"});
            $(".fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").animate({"margin-left": "336px"});
            setTimeout(function(){$(".fiveDaySecondColoum .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayThirdColoum .border").css({"margin-left": "-1px"});
        }
    }else{
        if(tabExpand5Day){
            tabExpand5Day = false;
            $(".fiveDaySecondColoum").animate({width: '152px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDaySecondColoum .border").animate({top: '10px', bottom: '0'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").animate({"margin-left": "0"});
            $(".fiveDayFirstColoum,.fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").css({opacity: '1',"pointer-events": "auto"});
        }else{
            tabExpand5Day = true;
            $(".fiveDaySecondColoum").animate({width: '456px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDaySecondColoum .border").animate({top: '110px', bottom: '78px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").css({opacity: '0.4',"pointer-events": "none"});
            $(".fiveDayThirdColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").animate({"margin-left": "304px"});
            setTimeout(function(){$(".fiveDaySecondColoum .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayThirdColoum .border").css({"margin-left": "-1px"});
        }
    }
    };
    /*
    * Name: WT.Forecastdetail.clickFiveDayThirdTab
    * Description: This function opens/close the 5day page third tab and populate the data
    * Parameters:
    * @param :  None
    * Returns: None
    * Globals updated: None
    */
    WT.Forecastdetail.clickFiveDayThirdTab = function(){
        if ($(".fiveDayThirdColoum").is(':animated') || swipeTrigger === true) {
            return false;
        }
        $(".fiveDayThirdColoum .coloum_right").hide();
        if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DISPLAY_VARIANT) === WT.Constant.Api.VARIANT_TEN){
        if(tabExpand5Day){
            tabExpand5Day = false;
            $(".fiveDayThirdColoum .border").animate({top: '20px', bottom: '20px'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayThirdColoum").animate({width: '168px', opacity: '1', "margin-left":"0"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").css({opacity: '1',"pointer-events": "auto"});
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").animate({"margin-left":"0"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
        }else{
            tabExpand5Day = true;
            $(".fiveDayThirdColoum").animate({"margin-left": "-168px", width: '504px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayThirdColoum .border").animate({top: '117px', bottom: '117px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum").animate({"margin-left": "-168px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFourthColoum,.fiveDayFifthColoum").animate({"margin-left": "168px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").css({opacity: '0.4',"pointer-events": "none"});   
            setTimeout(function(){ $(".fiveDayThirdColoum .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
        }
    }else{
        if(tabExpand5Day){
            tabExpand5Day = false;
            $(".fiveDayThirdColoum .border").animate({top: '10px', bottom: '0'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayThirdColoum").animate({width: '152px', opacity: '1', "margin-left":"0"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").css({opacity: '1',"pointer-events": "auto"});
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").animate({"margin-left":"0"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
        }else{
            tabExpand5Day = true;
            $(".fiveDayThirdColoum").animate({"margin-left": "-152px", width: '456px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayThirdColoum .border").animate({top: '110px', bottom: '78px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum").animate({"margin-left": "-152px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFourthColoum,.fiveDayFifthColoum").animate({"margin-left": "152px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayFourthColoum,.fiveDayFifthColoum").css({opacity: '0.4',"pointer-events": "none"});   
            setTimeout(function(){ $(".fiveDayThirdColoum .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
        }
    }        
    };
    /*
    * Name: WT.Forecastdetail.clickFiveDayFourthTab
    * Description: This function opens/close the 5day page fourth tab and populate the data
    * Parameters:
    * @param :  None
    * Returns: None
    * Globals updated: None
    */
    WT.Forecastdetail.clickFiveDayFourthTab = function(){
        if ($(".fiveDayFourthColoum").is(':animated') || swipeTrigger === true) {
            return false;
        }
        $(".fiveDayFourthColoum .coloum_right").hide();
        if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DISPLAY_VARIANT) === WT.Constant.Api.VARIANT_TEN){
        if(tabExpand5Day){
            tabExpand5Day = false;
            setTimeout(function (){$(".fiveDayThirdColoum .border").show(); $(".fiveDayFourthColoum .border").hide();}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER)
            $(".fiveDayFourthColoum .border").animate({top: '20px', bottom: '20px'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayFourthColoum").animate({marginLeft: "0px",width: '168px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum").animate({marginLeft: "0px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFifthColoum").css({"pointer-events": "auto", opacity: '1'});
            
        }else{
            tabExpand5Day = true;
            $(".fiveDayThirdColoum .border").hide();
            $(".fiveDayFourthColoum .border").show();
            $(".fiveDayFourthColoum").animate({"margin-left": "-336px", width: '504px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum").animate({"margin-left": "-336px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER); 
            $(".fiveDayFourthColoum .border").animate({top: '117px', bottom: '117px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFifthColoum").css({"pointer-events": "none", opacity: '0.4'});
            setTimeout(function(){$(".fiveDayFourthColoum .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
        }
    }else{
        if(tabExpand5Day){
            tabExpand5Day = false;
            setTimeout(function (){$(".fiveDayThirdColoum .border").show(); $(".fiveDayFourthColoum .border").hide();}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER)
            $(".fiveDayFourthColoum .border").animate({top: '10px', bottom: '0'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayFourthColoum").animate({marginLeft: "0px",width: '152px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum").animate({marginLeft: "0px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFifthColoum").css({"pointer-events": "auto", opacity: '1'});
            
        }else{
            tabExpand5Day = true;
            $(".fiveDayThirdColoum .border").hide();
            $(".fiveDayFourthColoum .border").show();
            $(".fiveDayFourthColoum").animate({"margin-left": "-304px", width: '456px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum").animate({"margin-left": "-304px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER); 
            $(".fiveDayFourthColoum .border").animate({top: '110px', bottom: '78px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFifthColoum").css({"pointer-events": "none", opacity: '0.4'});
            setTimeout(function(){$(".fiveDayFourthColoum .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
        }
    }
    };

    /*
    * Name: WT.Forecastdetail.clickFiveDayFifthTab
    * Description: This function opens/close the 5day page fifth tab and populate the data
    * Parameters:
    * @param :  None
    * Returns: None
    * Globals updated: None
    */
    WT.Forecastdetail.clickFiveDayFifthTab = function(){
         if ($(".fiveDayFifthColoum").is(':animated') || swipeTrigger === true) {
            return false;
        }
        $(".fiveDayFifthColoum .coloum_right").hide();
        if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.DISPLAY_VARIANT) === WT.Constant.Api.VARIANT_TEN){
        if(tabExpand5Day){
            tabExpand5Day = false;
            $(".fiveDayFifthColoum").animate({"margin-left": "0px",width: '168px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFifthColoum .border").animate({top: '20px', bottom: '20px'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum").animate({"margin-left": "0px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum").css({"pointer-events":"auto", opacity: '1'});
        }else{
            tabExpand5Day = true;
            $(".fiveDayFifthColoum").animate({"margin-left": "-336px", width: '504px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFifthColoum .border").animate({top: '117px', bottom: '117px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum").css({"pointer-events":"none", opacity:'0.4'});
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum").animate({"margin-left": "-336px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            setTimeout(function(){$(".fiveDayFifthColoum .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
        }
    }else{
        if(tabExpand5Day){
            tabExpand5Day = false;
            $(".fiveDayFifthColoum").animate({"margin-left": "0px",width: '152px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFifthColoum .border").animate({top: '10px', bottom: '0'}, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum").animate({"margin-left": "0px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum").css({"pointer-events":"auto", opacity: '1'});
        }else{
            tabExpand5Day = true;
            $(".fiveDayFifthColoum").animate({"margin-left": "-304px", width: '456px', opacity: '1'}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            $(".fiveDayFifthColoum .border").animate({top: '110px', bottom: '78px' }, WT.Constant.Api.FORECAST_LINE_EXPANSION_TIMER);
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum").css({"pointer-events":"none", opacity:'0.4'});
            $(".fiveDayFirstColoum,.fiveDaySecondColoum,.fiveDayThirdColoum,.fiveDayFourthColoum").animate({"margin-left": "-304px"}, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
            setTimeout(function(){$(".fiveDayFifthColoum .coloum_right").fadeIn(); }, WT.Constant.Api.FORECAST_TAB_EXPANSION_TIMER);
        }
    }
    };

var forcastDetailClass = function(){
    var forcastObj = this;
    //location detail object
    var locWTDetailObj = new locWTDetailClass();
    /*
    * Name: mousedown
    * Description: This function adds active state of button click during mousedown
    * Parameters:
    * @param :  None
    * Returns: None
    * Globals updated: None
    */

    $(".tabreaction-area").mousedown(function () {
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
    $(".tabreaction-area").mouseup(function () {
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
    $(".tabreaction-area").mouseleave(function () {
        $(this).removeClass("active");
    });
        
   /*
    * Name: fetchTempColor
    * Description:Private method which populates the temperature circle
    *             Summary :
    *                This function fetch the correct asset for display for temperature
    * Parameters:
    * @param : {float/number} - temperature value
    * @param : {string} - temperature unit
    * @param : {number} - list number
    * None
    * Returns:
    * None
    * Globals updated:
    * None
    * Tables updated:
    * None
    */

    var fetchTempColor = function(temperature,tempUnit,listElement){
        var tempRounded,tempCircleColor;

        //Color code shown with respect to celcius :: So if FArenheit convert to celcius
        if(tempUnit === WT.Constant.Api.TEMP_FAREN){
            tempRounded = Math.round((temperature-32)/1.8);
        }else{
            tempRounded = temperature;
        }

        //Add class with respect to temperature
        if(tempRounded >= 50){
            tempCircleColor = "plus50deg";
        }else if(tempRounded < 50 && tempRounded >= 45){
            //Need to add image
            tempCircleColor = "plus45deg";
        }else if(tempRounded < 45 && tempRounded >= 40){
            //Need to add image
            tempCircleColor = "plus40deg";
        }else if(tempRounded < 40 && tempRounded >= 35){
            //Need to add image
            tempCircleColor = "plus35deg";
        }else if(tempRounded < 35 && tempRounded >= 30){
            //Need to add image
            tempCircleColor = "plus30deg";
        }else if(tempRounded < 30 && tempRounded >= 25){
            //Need to add image
            tempCircleColor = "plus25deg";
        }else if(tempRounded < 25 && tempRounded >= 20){
            //Need to add image
            tempCircleColor = "plus20deg";
        }else if(tempRounded < 20 && tempRounded >= 15){
            //Need to add image
            tempCircleColor = "plus15deg";
        }else if(tempRounded < 15 && tempRounded >= 10){
            //Need to add image
            tempCircleColor = "plus10deg";
        }else if(tempRounded < 10 && tempRounded >= 5){
            //Need to add image
            tempCircleColor = "plus5deg";
        }else if(tempRounded < 5 && tempRounded >= 0){
            //Need to add image
            tempCircleColor = "plus0deg";
        }else if(tempRounded < 0 && tempRounded >= -5){
            //Need to add image
            tempCircleColor = "minus-5deg";
        }else if(tempRounded < -5 && tempRounded >= -10){
            //Need to add image
            tempCircleColor = "minus-10deg";
        }else if(tempRounded < -10 && tempRounded >= -15){
            //Need to add image
            tempCircleColor = "minus-15deg";
        }else if(tempRounded < -15 && tempRounded >= -20){
            tempCircleColor = "minus-20deg";
        }else if(tempRounded < -20 && tempRounded >= -25){
            tempCircleColor = "minus-25deg";
        }else if(tempRounded < -25 && tempRounded >= -30){
            tempCircleColor = "minus-30deg";
        }else if(tempRounded < -30 && tempRounded >= -35){
            tempCircleColor = "minus-35deg";
        }else if(tempRounded < -35 && tempRounded >= -40){
            tempCircleColor = "minus-40deg";
        }else if(tempRounded < -40 && tempRounded >= -45){
            tempCircleColor = "minus-45deg";
        }else if(tempRounded <= -50){
            tempCircleColor = "minus-50deg";
        }else{

        }
        $("#twentyFourHourColumn li:nth-child("+listElement+") .tempIcon i").addClass(tempCircleColor);
    };

    /*
    * Name: fetchWindDirection
    * Description:Private method which populates the wind direction
    *             Summary :
    *                This function fetch the correct degree for display of wind
    * Parameters:
    * @param : {number} - wind value
    * @param : {number} - list number
    * None
    * Returns:
    * None
    * Globals updated:
    * None
    * Tables updated:
    * None
    */
    var fetchWindDirection = function(windDegree,listElement){
        var direction;
        if((windDegree === 0) || (windDegree > 315 && windDegree <= 360)){
           direction = "degree0";
        }else if(windDegree > 0 && windDegree <= 45){
           direction = "degree45";
        }else if(windDegree > 45 && windDegree <= 90){
            direction = "degree90";
        }else if(windDegree > 90 && windDegree <= 135){
            direction = "degree135";
        }else if(windDegree > 135 && windDegree <= 180){
            direction = "degree180";
        }else if(windDegree > 180 && windDegree <= 225){
            direction = "degree225";
        }else if(windDegree > 225 && windDegree <= 270){
            direction = "degree270";
        }else if(windDegree > 270 && windDegree <= 315){
            direction = "degree315";
        }else {
            //Degree doenot match 0 to 360 degrees
        }
        $("#twentyFourHourColumn li:nth-child("+listElement+") .windDirection i").addClass(direction);
    };

    /*
    * Name: updateIcon
    * Description:Public method which populates the weather Icon
    *             Summary :
    *                This function fetch the weather icon
    * Parameters:
    * @param : {number} - weather icon
    * @param : {number} - list number
    * None
    * Returns:
    * None
    * Globals updated:
    * None
    * Tables updated:
    * None
    */
    var updateIcon = function (weatherIcon,listElement,listId,listClass){
        //Fetch icon theme from location details
        locWTDetailObj.fetchIconTheme(weatherIcon,function(iconToDisplay){
            $(""+listId+" li:nth-child("+listElement+") "+listClass+" i").addClass(iconToDisplay);
        }); 
    };

    //TODO::Header
    var fetchFavorite = function(locObj){
        //Load Favorites
        WT.Service.FavoriteHandler.checkFav(locObj,function(successObj){
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.FORECAST.screenName) {
                if(successObj === null){
                    $("#favIcon").attr("class","icon nonfav");
                }else{
                    $("#favIcon").attr("class","icon favselected");
                }

            }
        },function(){
                //TODO::disable click
                //set flag to fetch from cloud if connectivity lest show unfilled icon
                if(WT.Service.FavoriteHandler.loggedIn){
                     WT.Service.FavoriteHandler.downloadFavorite(function(successObj){
                    //Enable 
                    WT.Service.FavoriteHandler.setFavDSM("WT-FAVDATA",successObj.value,function(success){
                        //data stored success     
                        WT.Global.cacheStorage.setItem("WT-favData", successObj.value);
                        },function(){
                            //Data set error
                        });
                        //fetch favorite
                        var forcastData = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
                        fetchFavorite(forcastData);
                    },function(){
                    //Error from fav call enable fav
                    });
                }
        });
    };

    //TODO::Header
    this.favIconClick = function(obj,alreadyLogIn){
        //add favorite since common finction
        function addFav(favoriteData){
            $("#favIcon").attr("class","icon update rotate");
               //$("#favIcon").attr("class","icon favselected");
               WT.Service.FavoriteHandler.addFavorite(favoriteData,function(){
                    if (WT.Route.getCurrentScreen() === WT.Constant.Route.FORECAST.screenName && $("#favIcon").hasClass("rotate")) {
                        $("#favIcon").attr("class","icon favselected");
                    }
               },function(error){
                    if (WT.Route.getCurrentScreen() === WT.Constant.Route.FORECAST.screenName && $("#favIcon").hasClass("rotate")) {
                        if(error === "listFull"){
                             WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"",CI.Utils.Localization.translate("weat_Fav_full_msg"));
                             $("#favIcon").attr("class","icon nonfav");
                        }else{
                            WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"",CI.Utils.Localization.translate("weat_Not_fav_added", {'PARAM0': favoriteData.locationDetail.location.name}));
                            $("#favIcon").attr("class","icon nonfav");
                        }
                    }
               });
        };

        //Delete Fav
        function deleteFav(favoriteData){
            $("#favIcon").attr("class","icon update rotate");
            WT.Service.FavoriteHandler.deleteFavorite(favoriteData.locationDetail.location.locationId,function(){
                if (WT.Route.getCurrentScreen() === WT.Constant.Route.FORECAST.screenName && $("#favIcon").hasClass("rotate")) {
                    $("#favIcon").attr("class","icon nonfav");
                }
            },function(){
                if (WT.Route.getCurrentScreen() === WT.Constant.Route.FORECAST.screenName && $("#favIcon").hasClass("rotate")) {
                    WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"", CI.Utils.Localization.translate("weat_Not_fav_del", {'PARAM0': favoriteData.locationDetail.location.name}));
                    $("#favIcon").attr("class","icon favselected");
                }
            });
        };

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
                        if (WT.Route.getCurrentScreen() === WT.Constant.Route.FORECAST.screenName) {
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
                        WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"", CI.Utils.Localization.translate("weat_Not_fav_added", {'PARAM0': favoriteData.locationDetail.location.name}));
                        $("#favIcon").attr("class","icon nonfav");
                    });
                },function(){
                    //Data set error
                });
            },function(){
                WT.Service.Afw.showPopUp(WT.Constant.popUpParam.POPUP_TYPE_TIMER,"", CI.Utils.Localization.translate("weat_Not_fav_added", {'PARAM0': favoriteData.locationDetail.location.name}));
                $("#favIcon").attr("class","icon nonfav");
            });
        };

        var favoriteData;
        //Chack if object or string
        if(typeof WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA) !== "object"){
            favoriteData = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
        }else{
            favoriteData = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA);
        }

        if(alreadyLogIn === "alreadyLoggedIn"){
            //check if fav
            if($(obj).hasClass("nonfav")){
                addFav(favoriteData);                
            }else if($(obj).hasClass("favselected")){
                deleteFav(favoriteData);
            }else{
                //add Log
            }
        }else{
            //Check if already favorite before adding
            WT.Service.FavoriteHandler.checkFav(favoriteData,function(successObj){
            //currentLoc.preFavLocId = favoriteData.locationDetail.location.locationId;
            if (WT.Route.getCurrentScreen() === WT.Constant.Route.FORECAST.screenName) {
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
    * Name: populate24Hour
    * Description:Public method which shows 24 hour information
    *             Summary :
    *                This function accessed in initialisation or partial
    *                to animate the 24hour screen
    * Parameters:
    * None
    * None
    * Returns:
    * None
    * Globals updated:
    * None
    * Tables updated:
    * None
    */
    forcastObj.populate24Hour = function(){
        $('.sliding-container').css(vehicleType,'0');
        $("#twentyFourHourTab").addClass("selected");
        $("#fiveDayTab").removeClass("selected");
    };

   /*
    * Name: populate24HourContent
    * Description:Public method which populates the five day data
    *             Summary :
    *                This function accessed in initialisation or partial
    *                populate respective 24 hour information
    *                Get icon details from location details
    *                Keep in cache to record whether 24 hour is displayed for back button
    * Parameters:
    * None
    * None
    * Returns:
    * None
    * Globals updated:
    * None
    * Tables updated:
    * None
    */
    forcastObj.populate24HourContent = function(){
     // if(WT.Forecastdetail.currentTab === WT.Constant.Route.FORECAST.tabTwentyFour){
        WT.Forecastdetail.currentTab = WT.Constant.Route.FORECAST.tabTwentyFour;
        var forcastData;
		//Chack if object or string
		if(typeof WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA) !== "object"){
			forcastData = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
			fetchFavorite(forcastData);
		}else{
			forcastData = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA);
			fetchFavorite(forcastData);
		}

		//Display first Column as Today Data
		var tempValue = Math.round(forcastData.locationDetail.today.temperature.current.value);
		$("#forecastlocation-name span").html(forcastData.locationDetail.location.name);
		$("#twentyFourHourColumn li:nth-child(1) .tempIcon span").html(tempValue  + "&#176;");
		//Fetch Temperature today Color
		fetchTempColor(tempValue,forcastData.locationDetail.today.temperature.current.unit,1);
		//Display Weather today Icon
		updateIcon(forcastData.locationDetail.today.weatherIcon,1,"#twentyFourHourColumn",".hourlyIcon");
		//Display Time Details today (Now Text)
		$("#twentyFourHourColumn li:nth-child(1) .timePeriod span").html(CI.Utils.Localization.translate("weat_Now"));   
		//Fetch Wind Direction today
		fetchWindDirection(forcastData.locationDetail.today.wind.direction.degrees,1,"#twentyFourHourColumn",".hourlyIcon"); 
		//Display Wind Text today
		$("#twentyFourHourColumn li:nth-child(1) .windDirection span").html(Math.round(forcastData.locationDetail.today.wind.speed.value));
		//Populating the 24hr tab expanded data for first tab
		WT.Global.translateWeatherText("#twentyFourHourColumn li:nth-child(1) .tempTitle span", forcastData.locationDetail.today.weatherIcon);
		$("#twentyFourHourColumn li:nth-child(1) .changeRain .changeRainTxt").html(CI.Utils.Localization.translate("weat_Chance_of_rain"));
		$("#twentyFourHourColumn li:nth-child(1) .changeRain .changeRainValue").html(forcastData.locationDetail.today.pop+" %");
		$("#twentyFourHourColumn li:nth-child(1) .cloudDetail .cloudDetailTxt").html(CI.Utils.Localization.translate("weat_CloudCover"));
		$("#twentyFourHourColumn li:nth-child(1) .cloudDetail .cloudDetailValue").html(forcastData.locationDetail.today.cloudCover+" %");
		$("#twentyFourHourColumn li:nth-child(1) .visDetail .visDetailTxt").html(CI.Utils.Localization.translate("weat_Visibility"));
		//$("#twentyFourHourColumn li:nth-child(1) .visDetail .visDetailValue").html(forcastData.locationDetail.today.visibility.value+" "+forcastData.locationDetail.today.visibility.unit);
        if (WT.Constant.DISTANCE_UNIT == WT.Constant.Api.DIST_METRIC) {
            $("#twentyFourHourColumn li:nth-child(1) .visDetail .visDetailValue").html(CI.Utils.Localization.translate("weat_NO_km", {'PARAM0': Math.round(forcastData.locationDetail.today.visibility.value)+" "}));
        }else if (WT.Constant.DISTANCE_UNIT == WT.Constant.Api.DIST_IMPERIAL) {
            $("#twentyFourHourColumn li:nth-child(1) .visDetail .visDetailValue").html(CI.Utils.Localization.translate("weat_NO_miles", {'PARAM0': Math.round(forcastData.locationDetail.today.visibility.value)+" "}));
        }
		//Fetch rest 5 items in data to be displayed
		for(var twentyHr=0;twentyHr<5;twentyHr++){
			//Populate the HTML elements
			//Display rounded temp value
			var tempValue = Math.round(forcastData.locationDetail.hourly[twentyHr].temperature.forecast.value);
			$("#twentyFourHourColumn li:nth-child("+(twentyHr+2)+") .tempIcon span").html(tempValue  + "&#176;");
			//Fetch Temperature Color
			fetchTempColor(tempValue,forcastData.locationDetail.hourly[twentyHr].temperature.forecast.unit,(twentyHr+2));
			//Display Weather Icon
			updateIcon(forcastData.locationDetail.hourly[twentyHr].weatherIcon,(twentyHr+2),"#twentyFourHourColumn",".hourlyIcon");
			//Display Time Details
			var displayHourlyTime = forcastData.locationDetail.hourly[twentyHr].forecastTime.split("T")[1].split(":");
			$("#twentyFourHourColumn li:nth-child("+(twentyHr+2)+") .timePeriod span").html(displayHourlyTime[0]+"."+displayHourlyTime[1]);   
			//Fetch Wind Direction
			fetchWindDirection(forcastData.locationDetail.hourly[twentyHr].wind.direction.degrees,(twentyHr+2)); 
			//Display Wind Text
			$("#twentyFourHourColumn li:nth-child("+(twentyHr+2)+") .windDirection span").html(Math.round(forcastData.locationDetail.hourly[twentyHr].wind.speed.value));
			//Populating the 24hr tab expanded data for 2 to 6
			WT.Global.translateWeatherText("#twentyFourHourColumn li:nth-child("+(twentyHr+2)+") .tempTitle span", forcastData.locationDetail.hourly[twentyHr].weatherIcon);
			$("#twentyFourHourColumn li:nth-child("+(twentyHr+2)+") .changeRain .changeRainTxt").html(CI.Utils.Localization.translate("weat_Chance_of_rain"));
			$("#twentyFourHourColumn li:nth-child("+(twentyHr+2)+") .changeRain .changeRainValue").html(forcastData.locationDetail.hourly[twentyHr].pop+" %");
			$("#twentyFourHourColumn li:nth-child("+(twentyHr+2)+") .cloudDetail .cloudDetailTxt").html(CI.Utils.Localization.translate("weat_CloudCover"));
			$("#twentyFourHourColumn li:nth-child("+(twentyHr+2)+") .cloudDetail .cloudDetailValue").html(forcastData.locationDetail.hourly[twentyHr].cloudCover+" %");
			$("#twentyFourHourColumn li:nth-child("+(twentyHr+2)+") .visDetail .visDetailTxt").html(CI.Utils.Localization.translate("weat_Visibility"));
			//$("#twentyFourHourColumn li:nth-child("+(twentyHr+2)+") .visDetail .visDetailValue").html(forcastData.locationDetail.hourly[twentyHr].visibility.value+" "+forcastData.locationDetail.hourly[twentyHr].visibility.unit);
                if (WT.Constant.DISTANCE_UNIT == WT.Constant.Api.DIST_METRIC) {
                    $("#twentyFourHourColumn li:nth-child("+(twentyHr+2)+") .visDetail .visDetailValue").html(CI.Utils.Localization.translate("weat_NO_km", {'PARAM0': Math.round(forcastData.locationDetail.hourly[twentyHr].visibility.value)+" "}));
                }else if (WT.Constant.DISTANCE_UNIT == WT.Constant.Api.DIST_IMPERIAL) {
                    $("#twentyFourHourColumn li:nth-child("+(twentyHr+2)+") .visDetail .visDetailValue").html(CI.Utils.Localization.translate("weat_NO_miles", {'PARAM0': Math.round(forcastData.locationDetail.hourly[twentyHr].visibility.value)+" "}));
                }
		}
		if (forcastData.updatedDate === WT.Global.getCurrentDate()) {
            var timeDiff = WT.Global.getCurrentTimeDiff((forcastData.updatedTime).toString());
            if (timeDiff > WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT) {
                forcastObj.forcastAutoUpdate();
            } else {
                var timeToUpdate = WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT - timeDiff;
                WT.Service.AutoUpdate.startTimer(timeToUpdate, "forcastRefIcon");
            }
        } else {
            forcastObj.forcastAutoUpdate();
        }
    };

   /*
    * Name: populateFiveDay
    * Description:Public method which populates the five day data
    *             Summary :
    *                This function accessed in partial or on initialisation
    *                populate respective 5 day information
    *                Get icon details from location details
    *                Keep in cache to record whether five day is displayed for back button
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
    forcastObj.populateFiveDayContent = function(){

            //Favorite Check
            var forcastData;
            if(typeof WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA) !== "object"){
                forcastData = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
                fetchFavorite(forcastData);
            }else{
                forcastData = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA);
                fetchFavorite(forcastData);
            }
            for(var day=0; day<5; day++){
                if(day == 0){
                    $("#fiveDayColumn li:nth-child("+(day+1)+") .days span").html(CI.Utils.Localization.translate("weat_Today"));
                }
                else{
                    $("#fiveDayColumn li:nth-child("+(day+1)+") .days span").html(forcastData.locationDetail.daily[day].forecastDay);
                }

                $("#fiveDayColumn li:nth-child("+(day+1)+") .daysTemp span").html(Math.round(forcastData.locationDetail.daily[day].temperature.maximum.value) + "&#176;");
                $("#fiveDayColumn li:nth-child("+(day+1)+") .windDir span").html(Math.round(forcastData.locationDetail.daily[day].temperature.minimum.value) + "&#176;"); 
                //Display Icon
                updateIcon(forcastData.locationDetail.daily[day].weatherIcon,(day+1),"#fiveDayColumn",".daysIcon");
                //Populating the 5day tab expanded data
                WT.Global.translateWeatherText("#fiveDayColumn li:nth-child("+(day+1)+") .tempTitle span", forcastData.locationDetail.daily[day].weatherIcon);
                $("#fiveDayColumn li:nth-child("+(day+1)+") .changeRain .changeRainTxtFiveDay").html(CI.Utils.Localization.translate("weat_Chance_of_rain"));
                $("#fiveDayColumn li:nth-child("+(day+1)+") .changeRain .changeRainValue").html(forcastData.locationDetail.daily[day].pop+" %");
                $("#fiveDayColumn li:nth-child("+(day+1)+") .cloudDetail .cloudDetailTxtFiveDay").html(CI.Utils.Localization.translate("weat_CloudCover"));
                $("#fiveDayColumn li:nth-child("+(day+1)+") .cloudDetail .cloudDetailValue").html(forcastData.locationDetail.daily[day].cloudCover+" %");
                $("#fiveDayColumn li:nth-child("+(day+1)+") .visDetail .visDetailTxtFiveDay").html(CI.Utils.Localization.translate("weat_Wind_speed"));
                //$("#fiveDayColumn li:nth-child("+(day+1)+") .visDetail .visDetailValue").html(forcastData.locationDetail.daily[day].wind.speed.value+forcastData.locationDetail.daily[day].wind.speed.unit);
                if (WT.Constant.DISTANCE_UNIT == WT.Constant.Api.DIST_METRIC) {
                    $("#fiveDayColumn li:nth-child("+(day+1)+") .visDetail .visDetailValue").html(CI.Utils.Localization.translate("weat_NO_km/h", {'PARAM0': Math.round(forcastData.locationDetail.daily[day].wind.speed.value)+" "}));
                }else if (WT.Constant.DISTANCE_UNIT == WT.Constant.Api.DIST_IMPERIAL) {
                    $("#fiveDayColumn li:nth-child("+(day+1)+") .visDetail .visDetailValue").html(CI.Utils.Localization.translate("weat_NO_mph", {'PARAM0': Math.round(forcastData.locationDetail.daily[day].wind.speed.value)+" "}));
                }
            }
    };
   /*
    * Name: populateFiveDay
    * Description:Public method which populates the five day data
    *             Summary :
    *                This function accessed in partial or on initialisation
    *                populate respective 5 day information
    *                Get icon details from location details
    *                Keep in cache to record whether five day is displayed for back button
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
    forcastObj.populateFiveDay = function(){
        WT.Forecastdetail.currentTab = WT.Constant.Route.FORECAST.tabFiveDay;
        $('.sliding-container').css(vehicleType,-eachSlideWidth);
        $("#twentyFourHourTab").removeClass("selected");
        $("#fiveDayTab").addClass("selected"); 
    };
   
    /*
    * Name: swipeAnimation
    * Description:Public method which handle 5Days / 24Hrs screen swipe functionality
    * Parameters:
    * @param :  None
    * Returns: None
    * Globals updated: eachSlideWidth
    */
    forcastObj.swipeAnimation = function() {       
        var mousedown = false;
        var slideContainerWidth = $(".sliding-container").width();
        eachSlideWidth = slideContainerWidth / 2;
        var marginThreshold = eachSlideWidth / 4;
        var mouseDownpos, mouseUpPos, mouseMovePos, mousePosDiff, presentSliderOffset, newSliderOffset
        var swipeSpeed = undefined;
        var animate5DayObj,animate24hObj;

        if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.STEERING_POSITION) === WT.Constant.Api.CONFIGURATION_RHD){
            vehicleType = 'right';
            animate5DayObj = {'right': -eachSlideWidth};
            animate24hObj = {'right': 0};
        }else{
            vehicleType = 'left';
            animate5DayObj = {'left': -eachSlideWidth};
            animate24hObj = {'left': 0};
        }

        var startContainerDrag = function(){
            //get the MOUSEDOWN position
            mousedown = true;
            $('.sliding-container').on('mousemove', onContainerDrag); 
            // set single fire stop functions
            $('.sliding-container').on('mouseup', stopContainerDrag);
            $('.sliding-container').on('mouseleave',stopContainerDrag);
            mouseDownpos = parseInt(event.pageX);
            presentSliderOffset = parseInt($('.sliding-container').css(vehicleType));
            swipeSpeed = setTimeout(function() {swipeSpeed = undefined; }, 250); // set the swipe timer
            console.log(presentSliderOffset);
            swipeTrigger = false;
        };

        var onContainerDrag = function(){
            if (mousedown === true) {
                console.log('mousemove');
                //get the MOUSEUP Position
                mouseMovePos = parseInt(event.pageX);                
                //calculate the difference in MOSUE DOWN and MOVE positions and move the sliding window in sync with hand gesture
                mousePosDiff = parseInt(mouseMovePos - mouseDownpos);
                //update slider position
                newSliderOffset = presentSliderOffset + mousePosDiff;
                if (newSliderOffset >= -eachSlideWidth && newSliderOffset <= 0) {
                    swipeTrigger = true;
                    $('.sliding-container').attr('style', ''+vehicleType+':' + newSliderOffset + 'px');
                }
            }
        };

        var animate5DayScreen = function(){
            $('.sliding-container').animate(animate5DayObj,function(){
                $("#twentyFourHourTab").removeClass("selected");
                $("#fiveDayTab").addClass("selected");
            });
        };

        var animate24hScreen = function(){
            $('.sliding-container').animate(animate24hObj,function(){
                $("#fiveDayTab").removeClass("selected");
                $("#twentyFourHourTab").addClass("selected");
            });
        };

        var stopContainerDrag = function(){
            mousedown = false;
            $('.sliding-container').off('mousemove'); 
            // set single fire stop functions
            $('.sliding-container').off('mouseup');
            $('.sliding-container').off('mouseleave');
            
            //calculate the difference in MOSUE DOWN and UP positions and Align the sliding window so that it will display either 24hr or 5day
            if (swipeTrigger === true) {
                //Fastness of swipe;
                if(swipeSpeed){
                    if(mousePosDiff < 0){
                        animate5DayScreen();
                    }else{
                        animate24hScreen();
                    }
                }else{
                    if(mousePosDiff > -marginThreshold){
                        animate24hScreen();
                    }else if(mousePosDiff < marginThreshold){
                        animate5DayScreen();
                    }else{
                        return false;
                    }
               }
                mouseDownpos = parseInt(event.pageX);
                presentSliderOffset = parseInt($('.sliding-container').css(vehicleType));
            } else {
                return false;
                swipeTrigger = false;
            }
        };

        $('.sliding-container').on('mousedown', startContainerDrag);
        swipeTrigger = false;
    };

    /*
     * Name: updateForecatBackground
     * Description: Forecast background to update
     * Parameters:
     * @param {number} : Weather Icon Number
     * Returns: None
     * Globals updated: None
     */
    this.updateForecatBackground = function(weatherIcon){
        //Update Background
        WT.Global.updateBackgroundTheme(weatherIcon, function(current_theme){
            $("#container").attr("class", "container  forecast-page " + current_theme + "_dest");
        });
    };

    /*
     * Name: currLocSuccess
     * Description: Current location Success Call back do off board call
     *
     * Parameters:
     * @param : {object} : current location object from framework
     * Returns: None
     * Globals updated: None
     * Local Storage Variables updated: None
     */
    var currLocSuccess = function (locationData) {
        WT.Global.logger("Forecast::getCurrentLocation" + JSON.stringify(locationData), CI.Utils.Define.LOGSeverity.TRACE);
        WT.Service.Api.getLocationWTData({latitude: locationData.latitude, longitude: locationData.longitude,
            retries: WT.Constant.Api.LOC_RETRY_COUNTER},
        locationDataSuccess, locationDataError);
    };

    /*
     * Name: currLocError
     * Description: Current location error Call back show unable to connect
     *
     * Parameters:
     * @param :
     * Returns: None
     * Globals updated: None
     * Local Storage Variables updated: None
     */
    var currLocError = function () {
        WT.Global.logger("Forecast::getCurrentLocation error", CI.Utils.Define.LOGSeverity.TRACE);
        WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), "full-loading");
        //Check current screen
        var currentScreen = WT.Route.getCurrentScreen();
        if(currentScreen === WT.Constant.Route.FORECAST.screenName){
            setTimeout(function(){
                WT.Global.stopLoading();
                WT.Global.speechInput = false;
                if(currentScreen === WT.Constant.Route.FORECAST.screenName){
                    CI.System.Core.sendRequestToStop();
                }
            }, 5000);
        }
    };
    /*
     * Name: locationDataSuccess
     * Description: Off Board success Call back validate received data
     *
     * Parameters:
     * @param : {object} : off board object from Appc
     * Returns: None
     * Globals updated: None
     */
    var locationDataSuccess = function (succResponse) {
        WT.Global.validateResponseData(succResponse, validateDataSuccess, validateDataError);
    };

    /*
     * Name: locationDataError
     * Description: Off Board error Call back show unable to connect
     *
     * Parameters:
     * @param : 
     * Returns: None
     * Globals updated: None
     * Local Storage Variables updated: None
     */
    var locationDataError = function (errResponse) {
        WT.Global.logger("Forecast::location live data error", CI.Utils.Define.LOGSeverity.TRACE);
        WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), "full-loading");
        //Check current screen
        var currentScreen = WT.Route.getCurrentScreen();
        if(currentScreen === WT.Constant.Route.FORECAST.screenName){
            setTimeout(function(){
                WT.Global.stopLoading();
                WT.Global.speechInput = false;
                if(currentScreen === WT.Constant.Route.FORECAST.screenName){
                    CI.System.Core.sendRequestToStop();
                }
            }, 5000);
        } 
    };
     /*
     * Name: validateDataSuccess
     * Description: Validation Success Call back to update details of current location
     *
     * Parameters:
     * @param :
     * Returns: None
     * Globals updated: refreshInProgress
     * Local Storage Variables updated:
     */
    var validateDataSuccess = function (locDetails) {
        WT.Global.logger("WT::ForecastDetail validateDataSuccess"+JSON.stringify(locDetails), CI.Utils.Define.LOGSeverity.INFO);
        localStorage.setItem(WT.Constant.localStorage.CURRENT_WT_DETAILS, JSON.stringify(locDetails));
        WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_DATA,JSON.stringify(locDetails));
        
        var locationDetails = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
        forcastObj.updateForecatBackground(locationDetails.locationDetail.today.weatherIcon);
        $("#forecastlocation-name span").html(locationDetails.locationDetail.location.name);
        
        //Check current screen
        var currentScreen = WT.Route.getCurrentScreen();
        WT.Global.logger("WT::ForecastDetail validateDataSuccess populateTwentyFourHour"+currentScreen, CI.Utils.Define.LOGSeverity.INFO);
        if(currentScreen === WT.Constant.Route.FORECAST.screenName){
            WT.Global.logger("WT::ForecastDetail validateDataSuccess populateTwentyFourHour inside if", CI.Utils.Define.LOGSeverity.INFO);
            WT.Global.speechInput = false;
            WT.Global.sidePanelInput = false;
            if(WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_MYLOC_24){
                WT.Global.logger("WT::ForecastDetail validateDataSuccess populateTwentyFourHour", CI.Utils.Define.LOGSeverity.INFO);
                forcastObj.populate24HourContent();
                forcastObj.populateFiveDayContent();
                forcastObj.populate24Hour();
            }else{
                eachSlideWidth = $(".sliding-container").width() / 2;
                forcastObj.populate24HourContent();
                forcastObj.populateFiveDayContent();
                forcastObj.populateFiveDay();
            }
        }
        WT.Global.stopLoading();
    };
    /*
     * Name: validateDataError
     * Description: Validation error Call back show unable to connect
     *
     * Parameters:
     * @param : {object} : object after error validation
     * Returns: None
     * Globals updated: None
     */

    var validateDataError = function (errorCallBck) {
        WT.Global.logger("Forecast::validate data error", CI.Utils.Define.LOGSeverity.TRACE);
        WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), "full-loading");
        if(currentScreen === WT.Constant.Route.FORECAST.screenName){
            setTimeout(function(){
                WT.Global.stopLoading();
                WT.Global.speechInput = false;                 
                WT.Global.sidePanelInput = false;
                if(currentScreen === WT.Constant.Route.FORECAST.screenName){
                    CI.System.Core.sendRequestToStop();
                }
            }, 5000);
        }
    };
    /*
     * Name: getDestinationDataSuccCall
     * Description: get Destination success Call Back
     *
     * Parameters:
     * @param : {object} - destination object from APPC
     * Returns: None
     * Globals updated: 
     */

    var getDestinationDataSuccCall = function (destDetails) {
        WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_DATA, localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS));
        var locDetails = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
        forcastObj.updateForecatBackground(locDetails.locationDetail.today.weatherIcon);
        $("#forecastlocation-name span").html(locDetails.locationDetail.location.name);
        //Check current screen
        var currentScreen = WT.Route.getCurrentScreen();
        if(currentScreen === WT.Constant.Route.FORECAST.screenName){
            //Keeping side panel as false
            if((WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_DEST_24) || WT.Global.sidePanelInput){
                WT.Global.speechInput = false;
                WT.Global.sidePanelInput = false;
                forcastObj.populate24HourContent();
                forcastObj.populateFiveDayContent();
                forcastObj.populate24Hour();
            }else{
                eachSlideWidth = $(".sliding-container").width() / 2;
                forcastObj.populate24HourContent();
                forcastObj.populateFiveDayContent();
                forcastObj.populateFiveDay();
            }
        }
        WT.Global.stopLoading();
    };

    /*
     * Name: getDestinationDataErrCall
     * Description: get destination errr call back
     *
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated:
     */

    var getDestinationDataErrCall = function () {
        WT.Global.logger("Forecast::getDestinationDataErrCall: error", CI.Utils.Define.LOGSeverity.TRACE);
        WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), "full-loading");
        //Check current screen
        var currentScreen = WT.Route.getCurrentScreen();
        if(currentScreen === WT.Constant.Route.FORECAST.screenName){
            setTimeout(function(){
                WT.Global.stopLoading();
                WT.Global.sidePanelInput = false;
                 WT.Global.speechInput = false;
                if(currentScreen === WT.Constant.Route.FORECAST.screenName){
                    CI.System.Core.sendRequestToStop();
                }
            }, WT.Constant.Api.ERROR_TIMEOUT);
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
        WT.Global.logger("WT::ForecastDetail searchSuccCall"+JSON.stringify(searchDetails), CI.Utils.Define.LOGSeverity.INFO);

        var locDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
        var destNavDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.DEST_NAV_DETAILS));

        if (WT.Route.getCurrentScreen() === WT.Constant.Route.FORECAST.screenName){
            forcastObj.updateForecatBackground(searchDetails.locationDetail.today.weatherIcon);
            $("#forecastlocation-name span").html(searchDetails.locationDetail.location.name);
            if(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SIDE_PANEL_LOCID) === locDetails.locationDetail.location.locationId){
                WT.Route.location.prevScreen = WT.Constant.Route.CURRLOC.screenName;
                locationDataSuccess(searchDetails.locationDetail);
                WT.Sidemenu.highlight(WT.Constant.Route.CURRLOC.sideBarId);
            }else if (destNavDetails ? ((Math.round(destNavDetails["waypoint-data"].location.geoCoordinates.latitude) === Math.round(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SIDE_PANEL_LAT))) &&
                        (Math.round(destNavDetails["waypoint-data"].location.geoCoordinates.longitude) === Math.round(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SIDE_PANEL_LONG)))):false){
                WT.Route.location.prevScreen = WT.Constant.Route.DESTINATION.screenName;
                WT.Global.getDestination(WT.Constant.Api.LOC_RETRY_COUNTER, getDestinationDataSuccCall, getDestinationDataErrCall);
                WT.Sidemenu.highlight(WT.Constant.Route.DESTINATION.sideBarId);
            }else{
                WT.Global.logger("WT::ForecastDetail searchSuccCall else", CI.Utils.Define.LOGSeverity.INFO);
                WT.Global.stopLoading();
                WT.Global.sidePanelInput = false;
				WT.Global.favDetailsScreen = true;
                WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.SEARCH_DETAILS,searchDetails);
                WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_DATA,searchDetails);
                WT.Route.location.prevScreen = WT.Constant.Route.SEARCHDETAILS.screenName;
                WT.Sidemenu.highlight(WT.Constant.Route.FAVOURITE.sideBarId);
                forcastObj.populate24HourContent();
                forcastObj.populateFiveDayContent();
                forcastObj.populate24Hour();
            }
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
        //Check current screen
        WT.Global.startLoading(CI.Utils.Localization.translate("weat_Unable_connect"), "full-loading");
        var currentScreen = WT.Route.getCurrentScreen();
        if(currentScreen === WT.Constant.Route.FORECAST.screenName){
            setTimeout(function(){
                WT.Global.stopLoading();
                WT.Global.sidePanelInput = false;
                if(currentScreen === WT.Constant.Route.FORECAST.screenName){
                    CI.System.Core.sendRequestToStop();
                }
            }, WT.Constant.Api.ERROR_TIMEOUT);
        }
    };

    var fetchLocDetails = function(){
        //Check connectivity before upload
        WT.Service.Afw.getUserConnectivitySettings(function(connValue){
            if ((typeof connValue === "string") && connValue === WT.Constant.connectionParam.USER_CONNECTION_ENABLE) {
               WT.Service.Afw.getConnectivityStatus(function(connStatus){
                    if((typeof connStatus === "string") && connStatus === WT.Constant.connectionParam.CONNECTION_AVAILABLE){ 
                        //Connection is fine to upload
                        WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID,WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SIDE_PANEL_LOCID))
                        WT.Global.searchLocation(searchSuccCall, searchErrCall);
                    }else{
                        searchErrCall();
                    }
               });
            } else {
                searchErrCall();
            }
    });

    };
	     /*
     * Name: forcastAutoUpdateSuccCall
     * Description: get auto update success Call Back ,update the details in DOM
     *
     * Parameters:
     * @param : {object} - location object from APPD
     * Returns:None
     * Globals updated:
     * Local Storage Variables updated:None
     */

    var forcastAutoUpdateSuccCall = function (forecastData) {
        WT.Global.logger("WT::ForecastDetail forcastAutoUpdateSuccCall"+JSON.stringify(forecastData), CI.Utils.Define.LOGSeverity.INFO);
        if(WT.Route.location.prevScreen === WT.Constant.Route.CURRLOC.screenName){
            localStorage.setItem(WT.Constant.localStorage.CURRENT_WT_DETAILS, JSON.stringify(forecastData));   
        }else if(WT.Route.location.prevScreen === WT.Constant.Route.DESTINATION.screenName){
            localStorage.setItem(WT.Constant.localStorage.DEST_DETAILS, JSON.stringify(forecastData));
        }else if(WT.Route.location.prevScreen === WT.Constant.Route.SEARCHDETAILS.screenName){
            WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.SEARCH_DETAILS, forecastData);
        }
        WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_DATA, forecastData);
        forcastObj.populate24HourContent();
        forcastObj.populateFiveDayContent();
    };

    /*
     * Name: forcastAutoUpdateErrCall
     * Description: get auto update errr call back 
     * Parameters:
     * @param : None
     * Returns: None
     * Globals updated: None
     */

    var forcastAutoUpdateErrCall = function () {
        WT.Global.logger("WT::ForecastDetail forcastAutoUpdateErrCall", CI.Utils.Define.LOGSeverity.INFO);   
        WT.Service.AutoUpdate.startTimer(WT.Constant.Api.DEFAULT_AUTOUPDATE_TIMEOUT, "forcastRefIcon");
    };
    /*
     * Name: forcastObj.forcastAutoUpdate
     * Description: make api call for forcastAutoUpdate
     * Parameters:
     * @param : 
     * Returns: None
     * Globals updated: 
     */
    forcastObj.forcastAutoUpdate = function(){
        WT.Service.Afw.getUserConnectivitySettings(function(connValue){
            if ((typeof connValue === "string") && connValue === WT.Constant.connectionParam.USER_CONNECTION_ENABLE) {
               WT.Service.Afw.getConnectivityStatus(function(connStatus){
                    if((typeof connStatus === "string") && connStatus === WT.Constant.connectionParam.CONNECTION_AVAILABLE){ 
                        if(typeof WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA) === "object"){
                            locationId = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA).locationDetail.location.locationId;
                        }else{
                            locationId = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA)).locationDetail.location.locationId;
                        }
                        WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.SELECTED_LOCATION_ID, locationId)
                        WT.Global.searchLocation(forcastAutoUpdateSuccCall, forcastAutoUpdateErrCall);
                    }else{
                        forcastAutoUpdateErrCall();
                    }
               });
            } else {
                forcastAutoUpdateErrCall();
            }
        });
    };
   /*
    * Name: this.initialization
    * Description:Public method which populates the five day data
    *             Summary :
    *                This function called in route
    *                Decides which data to populate based on previous screen
    *                Start Auto Update Timer of 10 minutes 
    * @param : {string} - Screen Name 
    * None
    * Returns:
    * None
    * Globals updated:
    * None
    * Tables updated:
    * None
    */
    this.initialisation = function(forecastDataScreen){
        //re-initializing the variables of animation
        tabExpand24Hr = false;
        tabExpand5Day = false;
        swipeTrigger = false;
        eachSlideWidth = 0;
        forcastObj.swipeAnimation();
        if(WT.Global.speechInput === true){
            if(WT.Route.location.prevScreen === ""){
                if(WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_MYLOC_24 || WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_MYLOC_5){
                    WT.Route.location.prevScreen = WT.Constant.Route.CURRLOC.screenName;
                    WT.Service.Afw.getCurrentLocation(currLocSuccess, currLocError);
                    WT.Sidemenu.highlight(WT.Constant.Route.CURRLOC.sideBarId);
                }else if(WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_DEST_24 || WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_DEST_5){
                    WT.Route.location.prevScreen = WT.Constant.Route.DESTINATION.screenName;
                    WT.Global.getDestination(WT.Constant.Api.LOC_RETRY_COUNTER, getDestinationDataSuccCall, getDestinationDataErrCall);
                    WT.Sidemenu.highlight(WT.Constant.Route.DESTINATION.sideBarId);
                }
            }else{
                WT.Global.speechInput = false;
                if(WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_MYLOC_24){
                    WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_DATA, localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
                    WT.Route.location.prevScreen = WT.Constant.Route.CURRLOC.screenName;
                    WT.Sidemenu.highlight(WT.Constant.Route.CURRLOC.sideBarId);
                    var locDetails = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
                    forcastObj.updateForecatBackground(locDetails.locationDetail.today.weatherIcon);
                    $("#forecastlocation-name span").html(locDetails.locationDetail.location.name);
                    forcastObj.populate24HourContent();
                    forcastObj.populateFiveDayContent();
                    forcastObj.populate24Hour();
                } else if(WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_MYLOC_5){
                    WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_DATA, localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
                    WT.Route.location.prevScreen = WT.Constant.Route.CURRLOC.screenName;
                    WT.Sidemenu.highlight(WT.Constant.Route.CURRLOC.sideBarId);
                    var locDetails = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
                    forcastObj.updateForecatBackground(locDetails.locationDetail.today.weatherIcon);
                    $("#forecastlocation-name span").html(locDetails.locationDetail.location.name);
                    forcastObj.populate24HourContent();
                    forcastObj.populateFiveDayContent();
                    forcastObj.populateFiveDay();
                } else if(WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_DEST_24){
                    WT.Route.location.prevScreen = WT.Constant.Route.DESTINATION.screenName;
                    WT.Sidemenu.highlight(WT.Constant.Route.DESTINATION.sideBarId);
                    if(localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS)){
                        WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_DATA, localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS));
                        var destDetails = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
                        forcastObj.updateForecatBackground(destDetails.locationDetail.today.weatherIcon);
                        $("#forecastlocation-name span").html(destDetails.locationDetail.location.name);
                        forcastObj.populate24HourContent();
                        forcastObj.populateFiveDayContent();
                        forcastObj.populate24Hour();
                    }else{
                        WT.Global.startLoading(CI.Utils.Localization.translate("weat_Loading_weather"), WT.Constant.screenNames.FULL_LOADING);
                        WT.Global.getDestination(WT.Constant.Api.LOC_RETRY_COUNTER, getDestinationDataSuccCall, getDestinationDataErrCall);
                    }
                } else if(WT.Launch.screenToBeLaunched === WT.Constant.screenNames.FORECAST_DEST_5){
                    WT.Route.location.prevScreen = WT.Constant.Route.DESTINATION.screenName;
                    WT.Sidemenu.highlight(WT.Constant.Route.DESTINATION.sideBarId);
                    if(localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS)){
                        WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_DATA, localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS));
                        var destDetails = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
                        forcastObj.updateForecatBackground(destDetails.locationDetail.today.weatherIcon);
                        $("#forecastlocation-name span").html(destDetails.locationDetail.location.name);
                        forcastObj.populate24HourContent();
                        forcastObj.populateFiveDayContent();
                        forcastObj.populateFiveDay();
                    }else{
                        WT.Global.startLoading(CI.Utils.Localization.translate("weat_Loading_weather"), WT.Constant.screenNames.FULL_LOADING);
                        WT.Global.getDestination(WT.Constant.Api.LOC_RETRY_COUNTER, getDestinationDataSuccCall, getDestinationDataErrCall);
                    }
                }
            }  
        }else if(WT.Global.sidePanelInput === true){
                WT.Global.speechInput = false;
                var locDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
                var destDetails = JSON.parse(localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS));

                if(locDetails?(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SIDE_PANEL_LOCID) === locDetails.locationDetail.location.locationId):false){
                   if(WT.Route.location.prevScreen === ""){
                        WT.Global.startLoading(CI.Utils.Localization.translate("weat_Loading_weather"), WT.Constant.screenNames.FULL_LOADING);
                        fetchLocDetails();
                    }else{
                        WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_DATA, localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
                        WT.Route.location.prevScreen = WT.Constant.Route.CURRLOC.screenName;
                        WT.Sidemenu.highlight(WT.Constant.Route.CURRLOC.sideBarId);
                        var locDetails = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
                        forcastObj.updateForecatBackground(locDetails.locationDetail.today.weatherIcon);
                        $("#forecastlocation-name span").html(locDetails.locationDetail.location.name);
                        WT.Global.sidePanelInput = false;
                        forcastObj.populate24HourContent();
                        forcastObj.populateFiveDayContent();
                        forcastObj.populate24Hour();
                    } 
                }else if(destDetails?(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SIDE_PANEL_LOCID) === destDetails.locationDetail.location.locationId):false){
                    if(WT.Route.location.prevScreen === ""){
                        WT.Global.startLoading(CI.Utils.Localization.translate("weat_Loading_weather"), WT.Constant.screenNames.FULL_LOADING);
                        fetchLocDetails();
                    }else{
                        if(localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS)){
                            WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_DATA, localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS));
                            var destDetails = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
                            forcastObj.updateForecatBackground(destDetails.locationDetail.today.weatherIcon);
                            $("#forecastlocation-name span").html(destDetails.locationDetail.location.name);
                            WT.Route.location.prevScreen = WT.Constant.Route.DESTINATION.screenName;
                            WT.Sidemenu.highlight(WT.Constant.Route.DESTINATION.sideBarId);
                            WT.Global.sidePanelInput = false;
                            forcastObj.populate24HourContent();
                            forcastObj.populateFiveDayContent();
                            forcastObj.populate24Hour();
                        }else{
                            WT.Global.startLoading(CI.Utils.Localization.translate("weat_Loading_weather"), WT.Constant.screenNames.FULL_LOADING);
                            fetchLocDetails();
                        }
                    }
                }else{
                    WT.Global.startLoading(CI.Utils.Localization.translate("weat_Loading_weather"), WT.Constant.screenNames.FULL_LOADING);
                    fetchLocDetails();
                }
               
        }else{
            switch(forecastDataScreen){
                case WT.Constant.Route.CURRLOC.screenName :
                    WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_DATA, localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
                    //Location Name in Header
                    var locDetails = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
                    forcastObj.updateForecatBackground(locDetails.locationDetail.today.weatherIcon);
                    $("#forecastlocation-name span").html(locDetails.locationDetail.location.name);
                    //populate 24 hour as default
                    forcastObj.populate24HourContent();
                    forcastObj.populateFiveDayContent();
                    forcastObj.populate24Hour();
                    console.log("data : "+localStorage.getItem(WT.Constant.localStorage.CURRENT_WT_DETAILS));
                break;
                case WT.Constant.Route.DESTINATION.screenName :
                    //populate 24 hour as default
                    WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_DATA, localStorage.getItem(WT.Constant.localStorage.DEST_DETAILS));
                    //Location Name in Header
                    var destDetails = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
                    forcastObj.updateForecatBackground(destDetails.locationDetail.today.weatherIcon);
                    $("#forecastlocation-name span").html(destDetails.locationDetail.location.name);
                    forcastObj.populate24HourContent();
                    forcastObj.populateFiveDayContent();
                    forcastObj.populate24Hour();
                break;
                //TODO :: Favorites
                case WT.Constant.Route.SEARCHDETAILS.screenName :
                    //populate 24 hour as default
                    var searchDetails = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.SEARCH_DETAILS);
                    forcastObj.updateForecatBackground(searchDetails.locationDetail.today.weatherIcon);
                    WT.Global.cacheStorage.setItem(WT.Constant.cacheStorage.FORECAST_DATA, searchDetails);
                    //Location Name in Header
                    $("#forecastlocation-name span").html(searchDetails.locationDetail.location.name);
                    forcastObj.populate24HourContent();
                    forcastObj.populateFiveDayContent();
                    forcastObj.populate24Hour();
                break;
                case WT.Constant.Route.SETTINGS.screenName :
                    //Location Name in Header
                    var locDetails;
                    if(typeof WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA) === "object"){
                        locDetails = WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA);
                    }else{
                        locDetails = JSON.parse(WT.Global.cacheStorage.getItem(WT.Constant.cacheStorage.FORECAST_DATA));
                    }
                    forcastObj.updateForecatBackground(locDetails.locationDetail.today.weatherIcon);
                    $("#forecastlocation-name span").html(locDetails.locationDetail.location.name);
                    //populate 24 hour as default
                    forcastObj.populate24HourContent();
                    forcastObj.populateFiveDayContent();
                    forcastObj.populate24Hour();
                    break;
                default :
            }
        } 
    };
};


