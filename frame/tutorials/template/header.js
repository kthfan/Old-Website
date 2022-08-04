
PanelConfigure.defaultConfigure.iconData = PanelConfigure.buttomStatusIcons("#fff");

function winchange(){
  if(window.innerWidth>document.documentElement.scrollWidth) 
    document.documentElement.style.width = window.innerWidth;
  if(window.innerHeight>document.documentElement.scrollHeight) 
    document.documentElement.style.height = window.innerHeight;
}

