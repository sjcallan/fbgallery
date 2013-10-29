Facebook Photo Gallery
==================================================

Overview:
--------------------------------------
A jquery plugin to select a photo from your Facebook photos by browsing your albums.


Requirements:
--------------------------------------

1. jQuery 1.8 or higher
2. The Facebook Connect Library
3. A defined Facebook appID - Please see developers.facebook.com on how to setup an app and retrieve the id.


Plugin Usage:
--------------------------------------

```
$(".fb-gallery").fbGallery({
    onPhotoSelect: function(response){
	    //do something with the response
    }
});
```    

Options:
--------------------------------------

langHeader: The title of the modal window.  Defaults to "Browse Your Albums"


Callbacks:
--------------------------------------

onPhotoSelect: function(response){}

onAlbumSelect: function(response){}

    
Response:
--------------------------------------
The response is a json object with the available data from Facebook about the selected photo.  Best way to see what is available to you is run console.log(response)