(function($){
  
  var defaults = {
    imageContainerId:         "",     //REQUIRED
    imageFileType:            "",
    imageFilePath:            "",
    imageFadeOutSpeed:        500,    //OPTIONAL Set the speed that the image will fade out.
    imageFadeInSpeed:         500,    //OPTIONAL Set the speed that the image will fade in.
    thumbFadeOutSpeed:        100,    //OPTIONAL Set the speed that the thumbnail will fade out.
    thumbFadeInSpeed:         100,    //OPTIONAL Set the speed that the thumbnail will fade in.
    thumbFadeDownOpacity:    0.50,    //OPTIONAL Set the opacity that the thumbnail will fade down to when it is not hovered over.
    thumbFadeUpOpacity:         1,    //OPTIONAL Set the opacity that the thumbnail will fade up to when it is hovered over.
    hideSingletonThumbnail:   false   //OPTIONAL Set to true if you want to hide the thumbnail container element if there is only one thumbnail.
  }
  
  gallery = function(settings){
    settings = $.extend(defaults, settings);
    var self = this;
    $.extend( self, {
      
      imageContainer: $("#"+settings.imageContainerId),
      
      fadeDownThumb:  function(thumb){
        thumb.fadeTo(settings.thumbFadeOutSpeed, settings.thumbFadeDownOpacity);
      },
      
      fadeUpThumb:  function(thumb){
        thumb.fadeTo(settings.thumbFadeOutSpeed, settings.thumbFadeUpOpacity);
      },
      
      changeImage: function(imagePath){
        self.imageContainer.stop(true, true);
        $("#"+settings.imageContainerId).fadeOut(settings.imageFadeOutSpeed, function(){
          self.imageContainer.find("img").attr("src", imagePath);
        });
        $("#"+settings.imageContainerId).fadeIn(settings.imageFadeInSpeed);
      },
      
      getImageFileName: function(fileName){
        return settings.imageFilePath+fileName+"."+settings.imageFileType;
      }
      
    });
    
    self.parent().delegate(".thumb", "click", function(){
      var fileName = self.getImageFileName($(this).attr("name"));
      self.changeImage(fileName);
    });
    
  }
  
  $.fn.easyGallery = gallery;
  
})(jQuery);