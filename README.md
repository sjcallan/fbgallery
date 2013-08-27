Facebook Photo Gallery jQuery Plugin
==================================================

Overview:
--------------------------------------
A jquery plugin to select a photo from your Facebook photos by browsing your albums.


Usage:
--------------------------------------

```$(".fb-gallery").fbGallery({
    onPhotoSelect: function(response){
	    //do something with the response
    }
});
```    
    
Response:
--------------------------------------
The response is a json object with the available data from Facebook about the selected photo.