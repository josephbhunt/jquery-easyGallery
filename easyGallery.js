(function($){

  var options = {
    thumbListId:              "",     //REQUIRED The id of the list containing the thumbnail images
    thumbnailContainerId:     "",     //REQUIRED The id of the element that wraps the list of thumbnails. This will be set to display:none; if hideSingletonThumbnail is true and there is only one thumnnail image in the list.
    captionClass:             "",     //REQUIRED IF YOU WANT TO HAVE CAPTIONS. You must set this to the class name of the elements that conatins your captions.
    imageFadeOutSpeed:        500,    //OPTIONAL Set the speed that the image will fade out.
    imageFadeInSpeed:         500,    //OPTIONAL Set the speed that the image will fade in.
    thumbFadeOutSpeed:        100,    //OPTIONAL Set the speed that the thumbnail will fade out.
    thumbFadeInSpeed:         100,    //OPTIONAL Set the speed that the thumbnail will fade in.
    thumbFadeDownOpacity:    0.47,    //OPTIONAL Set the opacity that the thumbnail will fade down to when it is not hovered over.
    thumbFadeUpOpacity:         1,    //OPTIONAL Set the opacity that the thumbnail will fade up to when it is hovered over.
    captionFadeOutColor:    "#fff",   //OPTIONAL Set the color that the caption text will fade to when it fades out.
    captionFadeInColor:     "#000",   //OPTIONAL Set the color that the caption text will fade to when it fades in.
    hideSingletonThumbnail:   false   //OPTIONAL Set to true if you want to hide the thumbnail container element if there is only one thumbnail.
  };
  
  $.fn.easyGallery = function(settings){
    $.extend(options, settings || {})
    var self = this;
    $.extend(self, {
      currentlyDisplayedImage:            $('#'+self.attr("id")+' :first'),
      thumbListContainerType:             $("#"+options.thumbListId).children().get(0).tagName,
      imageListContainerType:             $("#"+self.attr("id")).children().get(0).tagName,
      allThumbnailImages:                 function() { return $('#'+options.thumbListId+' '+self.thumbListContainerType+' img'); },
      getThumbnailImageByName:            function(name) { return $('#'+options.thumbListId+' '+self.thumbListContainerType+'[name="'+name+'"] img'); },
      getCaptionByImageName:              function(name) { return $('#'+self.attr("id")+' '+self.imageListContainerType+'[name="'+name+'"] .'+options.captionClass); },
      getImageListItemByName:             function(name) { return $('#'+self.attr("id")+' '+self.imageListContainerType+'[name="'+name+'"]'); },
      getImageByName:                     function(name) { return $('#'+self.attr("id")+' '+self.imageListContainerType+'[name="'+name+'"] img'); },
      hasMoreThanOneThumbnail:            function() { return self.allThumbnailImages().length > 1; },
      displayNoImagesCaptionsListItems:   function(){
        $('#'+self.attr("id")+' '+self.imageListContainerType+' img').each(function(){
          $(this).css('display', 'none');
        });
        $('#'+self.attr("id")+' '+self.imageListContainerType).each(function(){
          $(this).css('display', 'none');
        });
        if (options.captionClass != ""){
          $('.'+options.captionClass).each(function(){
            $(this).css('display', 'none');
          });
        }
        ( !self.hasMoreThanOneThumbnail() && options.hideSingletonThumbnail) ? $('#'+options.thumbnailContainerId).css('display', 'none') : $('#'+options.thumbnailContainerId).css('display', 'block');
      },
      
      fadeAllThumbs:                      function(){
        self.allThumbnailImages().each(function(){
          $(this).css('opacity', options.thumbFadeDownOpacity);
        });
      },

      fadeThumb:                          function(element){
        $(element).fadeTo(options.thumbFadeOutSpeed, options.thumbFadeDownOpacity);
        $(element).css({'border': '0px', 'margin': '1px'});
      },

      showThumb:                          function(element){
        $(element).fadeTo(options.thumbFadeInSpeed, options.thumbFadeUpOpacity);
        $(element).css({'border': '1px solid #7b7c7e', 'margin': '0px'});
      },

      isCurrentlyDisplayedElement:        function(element){
        return element.attr('name') == (self.currentlyDisplayedImage.attr('name'));
      },

      fadeShowThumb:                      function(oldImage){
        self.fadeThumb( self.getThumbnailImageByName(oldImage.attr('name')));
        self.showThumb( self.getThumbnailImageByName(self.currentlyDisplayedImage.attr('name')));
      },
      
      switchCaptions:                     function(oldCaption, currentlyDisplayedCaption) {
        oldCaption.stop(true, true);
        oldCaption.animate({ color: 'white'}, options.imageFadeOutSpeed, function(){
          oldCaption.css('display', 'none');
          currentlyDisplayedCaption.css({display: 'block', color: options.captionFadeOutColor});
          currentlyDisplayedCaption.animate({color: options.captionFadeInColor}, options.imageFadeInSpeed);
        });
      },

      displayImage:                       function(thumbListItem){
        var oldImage = self.currentlyDisplayedImage;
        self.currentlyDisplayedImage = self.getImageListItemByName(thumbListItem.attr('name'));
        self.fadeThumb(self.getThumbnailImageByName(oldImage.attr('name')));
        self.showThumb(self.getThumbnailImageByName(self.currentlyDisplayedImage.attr('name')));

        self.getImageByName(oldImage.attr('name')).stop(true, true);
        self.getImageByName(oldImage.attr('name')).fadeOut(options.imageFadeOutSpeed, function(){
          self.getImageListItemByName(oldImage.attr('name')).css('display', 'none');
          self.getImageListItemByName(self.currentlyDisplayedImage.attr('name')).css('display', 'list-item');
          self.getImageByName(self.currentlyDisplayedImage.attr('name')).fadeIn(options.imageFadeInSpeed);
        });

        if (options.captionClass != "") switchCaptions(getCaptionByImageName(oldImage.attr('name')), getCaptionByImageName(thumbListItem.attr('name')));
      }
      
    });
    
    self.displayNoImagesCaptionsListItems();
    self.displayImage(self.getThumbnailImageByName(self.currentlyDisplayedImage.attr('name')).parent());
    if ( (options.thumbListId != "") && self.hasMoreThanOneThumbnail()){
      self.fadeAllThumbs();
      self.showThumb(self.getThumbnailImageByName(self.currentlyDisplayedImage.attr('name')));
      
      self.allThumbnailImages().click( function() {
        if ((!self.isCurrentlyDisplayedElement($(this).parent()))) self.displayImage($(this).parent());
      });
      
      self.allThumbnailImages().mouseenter( function(){
        self.showThumb(this);
      });
      
      self.allThumbnailImages().mouseout( function(){
        if (!self.isCurrentlyDisplayedElement($(this).parent())) self.fadeThumb(this);
      });
    }
  };
})(jQuery);