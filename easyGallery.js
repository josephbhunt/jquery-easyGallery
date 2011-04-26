(function($){

	var options = {
		thumbListId:			"",				//REQUIRED The id of the list containing the thumbnail images
		thumbnailContainerId:	"",				//REQUIRED The id of the element that wraps the list of thumbnails. This will be set to display:none; if hideSingletonThumbnail is true and there is only one thumnnail image in the list.
		captionClass:			"",				//REQUIRED IF YOU WANT TO HAVE CAPTIONS. You must set this to the class name of the elements that conatins your captions.
		imageFadeOutSpeed:		500,			//OPTIONAL Set the speed that the image will fade out.
		imageFadeInSpeed:		500,			//OPTIONAL Set the speed that the image will fade in.
		thumbFadeOutSpeed:		100,			//OPTIONAL Set the speed that the thumbnail will fade out.
		thumbFadeInSpeed:		100,			//OPTIONAL Set the speed that the thumbnail will fade in.
		thumbFadeDownOpacity:	0.47,			//OPTIONAL Set the opacity that the thumbnail will fade down to when it is not hovered over.
		thumbFadeUpOpacity:		1,				//OPTIONAL Set the opacity that the thumbnail will fade up to when it is hovered over.
		captionFadeOutColor:	"#fff",			//OPTIONAL Set the color that the caption text will fade to when it fades out.
		captionFadeInColor:		"#000",			//OPTIONAL Set the color that the caption text will fade to when it fades in.
		hideSingletonThumbnail:	false			//OPTIONAL Set to true if you want to hide the thumbnail container element if there is only one thumbnail.
	};

	$.fn.tiffanyGallery = function(settings){
		if (settings != undefined)
			$.extend(options, settings);
		var imageListId = $(this).attr('id');
		var currentlyDisplayedImage = $('#'+imageListId+' :first');
		var thumbListContainerType = $("#"+options["thumbListId"]).children().get(0).tagName;
		var imageListContainerType = $("#"+imageListId).children().get(0).tagName;
		
		displayNoImagesCaptionsListItems();
		displayImage(getThumbnailImageByName(currentlyDisplayedImage.attr('name')).parent());
		
		if ( (options['thumbListId'] != "") && hasMoreThanOneThumbnail()){
			fadeAllThumbs();
			showThumb(getThumbnailImageByName(currentlyDisplayedImage.attr('name')));
			
			allThumbnailImages().click( function() {
				if ((!isCurrentlyDisplayedElement($(this).parent())))
					displayImage($(this).parent());
			});
			
			allThumbnailImages().mouseenter( function(){
				showThumb(this);
			});
			
			allThumbnailImages().mouseout( function(){
				if (!isCurrentlyDisplayedElement($(this).parent()))
					fadeThumb(this);
			});
		}
		
		/*********************************************
			Query Methods
		*********************************************/
		
		function allThumbnailImages() { return $('#'+options['thumbListId']+' '+thumbListContainerType+' img'); }
		
		function getThumbnailImageByName(name) { return $('#'+options['thumbListId']+' '+thumbListContainerType+'[name="'+name+'"] img'); }
		
		function getCaptionByImageName(name) { return $('#'+imageListId+' '+imageListContainerType+'[name="'+name+'"] .'+options["captionClass"]); }
		
		function getImageListItemByName(name) { return $('#'+imageListId+' '+imageListContainerType+'[name="'+name+'"]'); }
		
		function getImageByName(name) { return $('#'+imageListId+' '+imageListContainerType+'[name="'+name+'"] img'); }
		
		/*********************************************
			End Queries
		*********************************************/
		
		function hasMoreThanOneThumbnail() {
			return allThumbnailImages().length > 1;
		}
		
		function displayNoImagesCaptionsListItems(){
			$('#'+imageListId+' li img').each(function(){
				$(this).css('display', 'none');
			});
			$('#'+imageListId+' li').each(function(){
				$(this).css('display', 'none');
			});
			if (options["captionClass"] != ""){
				$('.'+options["captionClass"]).each(function(){
					$(this).css('display', 'none');
				});
			}
			if ( !hasMoreThanOneThumbnail() && options['hideSingletonThumbnail'])
				$('#'+options['thumbnailContainerId']).css('display', 'none');
			else
				$('#'+options['thumbnailContainerId']).css('display', 'block');
		}

		function fadeAllThumbs(){
			allThumbnailImages().each(function(){
				$(this).css('opacity', options['thumbFadeDownOpacity']);
			});
		}

		function fadeThumb(element){
			$(element).fadeTo(options['thumbFadeOutSpeed'], options['thumbFadeDownOpacity']);
			$(element).css({'border': '0px', 'margin': '1px'});
		}

		function showThumb(element){
			$(element).fadeTo(options['thumbFadeInSpeed'], options['thumbFadeUpOpacity']);
			$(element).css({'border': '1px solid #7b7c7e', 'margin': '0px'});
		}

		function isCurrentlyDisplayedElement(element){
			return element.attr('name') == (currentlyDisplayedImage.attr('name'));
		}
		
		function fadeShowThumb(oldImage){
			fadeThumb( getThumbnailImageByName(oldImage.attr('name')));
			showThumb( getThumbnailImageByName(currentlyDisplayedImage.attr('name')));
		}
		
		function switchCaptions(oldCaption, currentlyDisplayedCaption) {
			oldCaption.stop(true, true);
			oldCaption.animate({ color: 'white'}, options["imageFadeOutSpeed"], function(){
				oldCaption.css('display', 'none');
				currentlyDisplayedCaption.css({display: 'block', color: options['captionFadeOutColor']});
				currentlyDisplayedCaption.animate({color: options['captionFadeInColor']}, options["imageFadeInSpeed"]);
			});
		}

		function displayImage(thumbListItem){
			var oldImage = currentlyDisplayedImage;
			currentlyDisplayedImage = getImageListItemByName(thumbListItem.attr('name'));
			fadeThumb(getThumbnailImageByName(oldImage.attr('name')));
			showThumb(getThumbnailImageByName(currentlyDisplayedImage.attr('name')));
			
			getImageByName(oldImage.attr('name')).stop(true, true);
			getImageByName(oldImage.attr('name')).fadeOut(options["imageFadeOutSpeed"], function(){
				getImageListItemByName(oldImage.attr('name')).css('display', 'none');
				getImageListItemByName(currentlyDisplayedImage.attr('name')).css('display', 'list-item');
				getImageByName(currentlyDisplayedImage.attr('name')).fadeIn(options["imageFadeInSpeed"]);
			});
			
			if (options['captionClass'] != "")
				switchCaptions(getCaptionByImageName(oldImage.attr('name')), getCaptionByImageName(thumbListItem.attr('name')));
		}
	};
})(jQuery);