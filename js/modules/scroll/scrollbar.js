/*
 * File Name: scrollbar.js
 * Description: Scrollbar module to handle scroll related functionality of list pages.
 *----------*
 * jQuery | * licensed under the MIT license. | jquery.org/license
 *----------*
 * Copyright (c) 2018: Jaguar Land Rover
 * Authors: Pratheesh VS
 * Creation Date: 31 January, 2018
 *
 * MODIFICATION RECORDS:
 * 
 */
WT.scrollBar = WT.scrollBar || {};
var scrollBarClass = function () {
    var scrollBar = this;
    scrollBarClass.listItemHeight = 0;
    scrollBarClass.isMouseDown = false;
    scrollBarClass.longPressTimer = null;
    scrollBarClass.longpressEnable = false;
    scrollBarClass.listLength = 1;
    scrollBarClass.mouseOnIcon = false;
    scrollBarClass.scrollingDiv = null;
    scrollBarClass.contentHeight = 0;
    scrollBarClass.itemsScrolled = 0;
    /*
     * Name: downChevronLongPress
     * Description : TRIGGER THIS FUNCTION ON LONG PRESS OF DOWN CHEVRON
     *
     * Parameters:
     * @param : Returns: None
     * Globals updated: None
     * Local Storage Variables updated: None
     */
    var downChevronLongPress = function () {
        scrollBarClass.longpressEnable = false;
        scrollBarClass.longPressTimer = setTimeout(function () {
            scrollBarClass.longpressEnable = true;
            $(scrollBarClass.scrollingDiv).animate({
                scrollTop: (scrollBarClass.contentHeight)
            }, "slow");

        }, WT.Constant.Api.LONG_PRESS_TIMER);
    };

    /*
     * Name: downChevronShortPress
     * Description : TRIGGER THIS FUNCTION ON SHORT PRESS OF DOWN CHEVRON
     *
     * Parameters:
     * @param :
     * Returns: None
     * Globals updated:
     * Local Storage Variables updated:None
     */
    var downChevronShortPress = function () {

        if (scrollBarClass.longpressEnable === true) {
            scrollBarClass.longpressEnable = false;
            return;
        } else {

            clearTimeout(scrollBarClass.longPressTimer);
            scrollBarClass.longPressTimer = null;
            $(scrollBarClass.scrollingDiv).stop();
            var clickScrollPosition = $(scrollBarClass.scrollingDiv + " > div").position();
            var scrollPositionTop = !clickScrollPosition ? 0 : Math.abs(clickScrollPosition.top);
            var newScrollPosition = scrollPositionTop + (scrollBarClass.listItemHeight * scrollBarClass.itemsScrolled);
            $(scrollBarClass.scrollingDiv).animate({
                scrollTop: newScrollPosition
            }, "slow");
        }
    };

    /*
     * Name: upChevronLongPress
     * Description : TRIGGER THIS FUNCTION ON SHORT PRESS OF UP CHEVRON
     *
     * Parameters:
     * @param :
     * Returns: None
     * Globals updated:None
     * Local Storage Variables updated:None
     */
    var upChevronLongPress = function () {
        scrollBarClass.longpressEnable = false;
        scrollBarClass.longPressTimer = setTimeout(function () {
            scrollBarClass.longpressEnable = true;
            $(scrollBarClass.scrollingDiv).animate({
                scrollTop: (scrollBarClass.contentHeight) * -1
            }, "slow");
        }, WT.Constant.Api.LONG_PRESS_TIMER);
    };

    /*
     * Name: upChevronShortPress
     * Description : TRIGGER THIS FUNCTION ON LONG PRESS OF UP CHEVRON
     *
     * Parameters:
     * @param :
     * Returns: None
     * Globals updated:None
     */
    var upChevronShortPress = function () {
        if (scrollBarClass.longpressEnable === true) {
            scrollBarClass.longpressEnable = false;
            return;
        } else {
            clearTimeout(scrollBarClass.longPressTimer);
            scrollBarClass.longPressTimer = null;
            $(scrollBarClass.scrollingDiv).stop();
            var clickScrollPosition = $(scrollBarClass.scrollingDiv + " > div").position();
            var scrollPositionTop = Math.abs(clickScrollPosition.top);
            var newScrollPosition = scrollPositionTop - (scrollBarClass.listItemHeight * scrollBarClass.itemsScrolled);
            $(scrollBarClass.scrollingDiv).animate({
                scrollTop: newScrollPosition
            }, "slow");
        }
    };

    /*
     * Name: scrollAlignCalc
     * Description : CALCULATE THE CURRENT POSITION OF THE SCROLL AND DO NECESSERY CALCULATION
     *               TO AVOID PARTIAL SCROLLING OF LIST ELEMENT OR TEXT CROPPING
     *
     * Parameters:
     * @param : scrollTime - Scroll animation time
     * Returns: None
     * Globals updated:None
     */
    var scrollAlignCalc = function () {
        var scrollPosition = $(scrollBarClass.scrollingDiv + " > div").position();
        var scrollPositionTop = scrollPosition.top;
        var scrollRatio = scrollPositionTop / scrollBarClass.listItemHeight;
        var roundedScrollRatio = Math.round(scrollRatio);
        var gridBasedScroll = scrollBarClass.listItemHeight * roundedScrollRatio * -1;
        TweenLite.to($(scrollBarClass.scrollingDiv), 0.25, {
            scrollTop: gridBasedScroll,
            onComplete:function(){
                //TweenLite.killAll();
            }
        });
    };                       

    /*
     * Name: chevronStateManagement
     * Description : MANAGE THE STATE OF CHEVRON
     *
     * Parameters:
     * @param :
     * Returns: None
     * Globals updated:None
     */
    var chevronStateManagement = function () {
        if ($(scrollBarClass.scrollingDiv).scrollTop() === 0) {
            $('.scroll-container').addClass('at-top').removeClass('at-bottom');
        }
        else if ($(scrollBarClass.scrollingDiv).scrollTop() ===
                ($(scrollBarClass.scrollingDiv).prop('scrollHeight') - $(scrollBarClass.scrollingDiv).height())) {
            $('.scroll-container').addClass('at-bottom').removeClass('at-top');
        }
    };

    /*
     * Name: dragInit
     * Description : Draggable initialisation and workaround for fast scroll
     *
     * Parameters:
     * @param : {object} - scrollItemHeight - each item height to scroll
     * Returns: None
     * Globals updated:None
     */
    var dragInit = function(scrollItemHeight){
        var swipe;
        var mouseDownPosY,mouseUpPosY;

        //take co-ordinates on mouse down
        $(".screen").on("mousedown", function(event) {
            WT.Global.logger("WT::dragInit:dragMouseDown"+event.clientY, CI.Utils.Define.LOGSeverity.INFO);   
            mouseDownPosY = event.clientY;
            $(document).on("mouseup");
        });
        //Create Draggable
        Draggable.create(scrollBarClass.scrollingDiv, {
            type:"scrollTop", 
            edgeResistance:1,
            dragResistance:0,
            throwProps:true,
            onDrag:function(){
                WT.Global.logger("WT::dragInit:dragStart", CI.Utils.Define.LOGSeverity.INFO);   
                $(document).on("mouseup", function(event) {
                    WT.Global.logger("WT::dragInit:mouseup"+event.clientY, CI.Utils.Define.LOGSeverity.INFO);
                    $(".prepend").css({"display": "none"});
                    mouseUpPosY = event.clientY;
                    $(document).off("mouseup");
                    if((mouseDownPosY- mouseUpPosY) > 0){
                        if(swipe){
                            WT.Global.logger("WT::dragInit:dragFastUp", CI.Utils.Define.LOGSeverity.INFO);
                            clearTimeout(swipe);
                            var clickScrollPositionUp = $(scrollBarClass.scrollingDiv + " > div").position();
                            var scrollPositionTopUp = Math.abs(clickScrollPositionUp.top); 
                            var newScrollPositionUp = scrollPositionTopUp + (scrollItemHeight * scrollBarClass.itemsScrolled);

                            TweenLite.to($(scrollBarClass.scrollingDiv), 0.25, {
                                scrollTop: newScrollPositionUp,
                                onComplete:function(){
                                }
                            });
                        }else{
                            clearTimeout(swipe);
                        }
                }else{
                    if(swipe){
                        WT.Global.logger("WT::dragInit:dragFastDown", CI.Utils.Define.LOGSeverity.INFO);
                        clearTimeout(swipe);
                        var clickScrollPositionDown = $(scrollBarClass.scrollingDiv + " > div").position();
                        var scrollPositionTopDown = Math.abs(clickScrollPositionDown.top);
                        var newScrollPositionDown = scrollPositionTopDown - (scrollItemHeight * scrollBarClass.itemsScrolled);

                        TweenLite.to($(scrollBarClass.scrollingDiv), 0.25, {
                            scrollTop: newScrollPositionDown,
                            onComplete:function(){
                            }
                        });
                    }else{
                        clearTimeout(swipe);
                    }
                }
            });
            swipe = setTimeout(function() {
                swipe = undefined;                 
            }, WT.Constant.Swipe.DISABLE_TIMER);
        }
        });
    };

    /*
     * Name: scrollList
     * Description : MANAGE MOUSELEAVE,MOUSEUP and MOUSEDOWN PRESS OF CHEVRONS
     *
     * Parameters:
     * @param :
     * Returns: None
     * Globals updated:None
     */
    this.scrollList = function (listLength, listItemHeight, contentHeight) {
        setTimeout(function(){
            //Initialize Draggable for drag smoothness
            dragInit(listItemHeight);
        },WT.Constant.Swipe.DRAGGABLE_TIMER);
        
        $(".view").on("mouseup", function (e) {
            $(".prepend").css({"display": "none"});
        });
        
        $(".chevron-down").on("mousedown", function (e) {
            $(".prepend").css({"display": "block"});
            downChevronLongPress();

        });
        $(".chevron-down").on("mouseup", function (e) {
            if (scrollBarClass.mouseOnIcon) {
                downChevronShortPress();
            }

        });
        $(".chevron-down").on("mouseleave", function (e) {
            scrollBarClass.longpressEnable = false;
            clearTimeout(scrollBarClass.longPressTimer);
            scrollBarClass.longPressTimer = null;
        });


        /* UP CHEVRON FINGER / MOUSE EVENTS */
        $(".chevron-up, .searchListChevron-up").on("mousedown", function (e) {
            $(".prepend").css({"display": "block"});
            upChevronLongPress();
        });
        $(".chevron-up, .searchListChevron-up").on("mouseup", function (e) {
            if (scrollBarClass.mouseOnIcon) {
                upChevronShortPress();
            }
        });
        $(".chevron-up, .searchListChevron-up").on("mouseleave", function (e) {
            scrollBarClass.longpressEnable = false;
            clearTimeout(scrollBarClass.longPressTimer);
            scrollBarClass.longPressTimer = null;
        });

        $(".icon").mousedown(function () {
            $(this).addClass("active-icon");
            scrollBarClass.mouseOnIcon = true;
        });
        $(".icon").mouseleave(function () {
            $(this).removeClass("active-icon");
            scrollBarClass.mouseOnIcon = false;

        });
        $(".icon").mouseup(function () {
            if (scrollBarClass.mouseOnIcon) {
                $(this).removeClass("active-icon");
            }
            scrollBarClass.mouseOnIcon = false;
        });
        /* TRIGGER THIS ON SCROLL START */
        $(scrollBarClass.scrollingDiv).scroll(function () {
            $('.scroll-container').removeClass('at-top').removeClass('at-bottom');
            //If scroll position is on top
            if ($(scrollBarClass.scrollingDiv).scrollTop() === 0) {
                $('.scroll-container').addClass('at-top').removeClass('at-bottom');
            }
            if (WT.Route.location.currentScreen === WT.Constant.Route.SEARCHLIST.screenName) {
                $(".list-element").removeClass("active-element");
            }
        });
        /* TRIGGER THIS WHEN SCROLL ANIMATION STOPS */
        $(scrollBarClass.scrollingDiv).scroll(_.debounce(function () {
            scrollAlignCalc();
            chevronStateManagement();
        }, WT.Constant.Swipe.DEBOUNCE_TIMER));

        $('.scroll-container').mouseleave(function () {
            scrollAlignCalc();
        });
        $('.legal-information').mouseleave(function () {
            scrollAlignCalc();
        });
        /* LIST ELEMENT CLICK */
        $(".list-element").mousedown(function () {
            $(".list-element").removeClass("active-element");
            $(this).addClass("active-element");
        });
        $(".list-element").mouseup(function () {
            $(".list-element").removeClass("active-element");
        });
        $(".list-element").mouseleave(function () {
            $(".list-element").removeClass("active-element");
        });
        //Enable over for search list during mouse down on side bar
        $(".sidebar").mousedown(function () {
            $(".prepend").css({"display": "block"});
        });
    };

    /*
     * Name: initialisation
     * Description : INITIALISE LISTLENGTH,LISTITEMHEIGHT,NUMBER OF ITEMS SCROLLED BASED ON
     *               CURRENT SCREEN INFORMATION
     *
     * Parameters:
     * @param :
     * Returns: None
     * Globals updated:None
     */
    this.initialisation = function (scrollingDiv) {
        scrollBarClass.scrollingDiv = scrollingDiv;

        //Kill a draggble instance if already created for drag
        if(Draggable.get(scrollBarClass.scrollingDiv)){
            Draggable.get(scrollBarClass.scrollingDiv).kill();
        }
        
    if(WT.Route.location.currentScreen === WT.Constant.Route.LEGALDETAILS.screenName) {
            scrollBarClass.listItemHeight = $('.legal-information p').css('line-height').slice(0, 2);
            scrollBarClass.contentHeight = $('#legal-detail').outerHeight();
            scrollBarClass.itemsScrolled = 12;
            //Insert overlay for legal information detail page
            $('<div class="prepend setting-overLay" ></div>').insertBefore(".legal-information");

        }else if (WT.Route.location.currentScreen === WT.Constant.Route.SEARCHLIST.screenName) {
            scrollBarClass.listLength = $('#search-list li').length;
            scrollBarClass.listItemHeight = $(".list-element").outerHeight();
            scrollBarClass.contentHeight = scrollBarClass.listLength * scrollBarClass.listItemHeight;
            scrollBarClass.itemsScrolled = 4;

            //Insert overlay for search list
            $('<div class="prepend search-list-overLay"></div>').insertBefore(".list");

        }else if (WT.Route.location.currentScreen === WT.Constant.Route.FAVOURITE.screenName){
            scrollBarClass.listLength = $('#fav-list li').length;
            scrollBarClass.listItemHeight = $(".favListElements").outerHeight();
            scrollBarClass.contentHeight = scrollBarClass.listLength * scrollBarClass.listItemHeight;
            scrollBarClass.itemsScrolled = 5;

            //Insert overlay for search list
            $('<div class="prepend search-list-overLay"></div>').insertBefore(".list");
        
        }else {
            //Current Screen not defined
        }
        scrollBar.scrollList(scrollBarClass.listLength, scrollBarClass.listItemHeight, scrollBarClass.contentHeight);
    };

};

