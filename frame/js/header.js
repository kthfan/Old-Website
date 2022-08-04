var TITLE_HEIGHT = 80;
var TOP_MENU_HEIGHT = 60;
var LEFT_MENU_WIDTH = 200;
var TUTORIAL_TITLE_HEIGHT = 50;
var TUTORIAL_ELEM_HEIGHT = 30;
var MAIN_DIV_HEIGHT = getBrowserHeight() - TITLE_HEIGHT - TOP_MENU_HEIGHT;
var main_div = document.getElementById("main-div");
var title_div = document.getElementById("title-div");
var top_nav_div = document.getElementById("top-nav-div");
var topMenu = Menu.createMenu(
  {
    type:"rolling"
    ,horizontal:true
    , parent:top_nav_div
    , x:0
    , y:TITLE_HEIGHT
    , style:"darkblue"
    , itemSize: 200
    , width:document.documentElement.clientWidth
    , height:TOP_MENU_HEIGHT
   }
  );
title_div.style.height = TITLE_HEIGHT;
top_nav_div.style.height = TITLE_HEIGHT+TOP_MENU_HEIGHT;
top_nav_div.style.width = document.documentElement.clientWidth;
main_div.style.top = TITLE_HEIGHT+TOP_MENU_HEIGHT;
