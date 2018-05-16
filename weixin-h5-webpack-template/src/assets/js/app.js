require("exports-loader?window.Zepto!script-loader!./zepto.js");
//require("exports-loader?window.Touch!script-loader!./touch.js");
require("exports-loader?window.Swiper!script-loader!./swiper.js");

require('../less/reset.less');
require('../less/swiper.less');
require('../less/app.less');

require('../mp3/music.mp3');

(function($){

    $('.music').on('touchstart',function(){
        if($(this).hasClass('on')){
            $('audio').get(0).pause();
            $(this).removeClass('on').addClass('off');
        }else {
            $('audio').get(0).play();
            $(this).removeClass('off').addClass('on');
        }
    });

   var mySwiper = new Swiper ('.swiper-container', {
       direction: 'horizontal'
   });

})(Zepto);