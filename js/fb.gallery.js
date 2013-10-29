(function ( $ ) {
 
    $.fn.fbGallery = function(options) {
    
        /* Setup Defaults */
        var settings = $.extend({
            langHeader: "Browse Your Albums",
            facebookUserID: "",
            onPhotoSelect: function(){},
            onAlbumSelect: function(){}
            onUserLogin: function(){},
            onClose: function(){},
            onUserAuthorizationFailure: function(){},
            debug: false,
        }, options );
        
        /* For Debugging */
        var fbgallery_pluginDebug = function(message) {
            if(settings.debug) {
                if(typeof message == "string") {
                    console.log("FB Gallery: " + message);
                } else {
                    console.log(message);
                }
            }
        };
        
        /* Login User and ask for permission */
        var fbgallery_facebookLogin = function(){
            FB.login(function(response) {
        
               if(response.status === 'connected'){
                  settings.onUserLogin(response.authResponse.userID);
                  fbgallery_launchModal();
                  return true;
               } else {
                  settings.onUserAuthorizationFailure();
                  return false;
               }
            
            },{scope:'user_photos'});
        };
        
        /* Function to check if a user is logged in, if not prompt to login */
        var fbgallery_checkFacebookLoginStatus = function(){
            
            var loginStatus = false;
            
            FB.getLoginStatus(function(response) {
                fbgallery_pluginDebug("Checking login status: " + response);
            
                if (response.status === 'connected') {
                    settings.facebookUserID = response.authResponse.userID;
                    loginStatus = true;
                    settings.onUserLogin(response.authResponse.userID);
                } else if (response.status === 'not_authorized') {
                    loginStatus = fbgallery_facebookLogin();
                } else {
                    loginStatus = fbgallery_facebookLogin();
                }
            
            });
            
            return loginStatus;
        };
        
        /* What happens when a user clicks on an album */
        var fbgallery_loadAlbumPictures = function(albumID, albumName){
            fbgallery_pluginDebug("Loading Album Pictures: ID: " + albumID + " Name: " + albumName);
            
            $("#jq-fbgallery-container h1").html(albumName + "| Photos");
            
            $("#jq-fbgallery-results-container").fadeOut('fast', function(){
                FB.api("/" + albumID + "/photos", function(response){
                          
                    $("#jq-fbgallery-results-container").html("<div id='jq-fbgallery-results-back-container'><a href='#' id='jq-fbgallery-back'>Go Back to All Albums</a></div>");      
                            
                    $.each(response.data, function(key, val){
                         /* Photo Data */
                         var photoID = val.id;
                         var photo = val.picture;
                        
                        $("#jq-fbgallery-results-container").append("<ul id='jq-fbgallery-results-container-list'></ul>");
                        $("#jq-fbgallery-results-container-list").append("<li id='jq-fbgallery-results-container-photo-list-" + photoID + "'><a href='#' class='jq-fbgallery-results-photo' data-photo-id='" + photoID + "'><img src='" + photo + "'></a></li>");
                    });
                    
                    $("#jq-fbgallery-results-container").fadeIn('fast');
                    
                }); 
            });
        };
        
        /* Load up the albums */
        var fbgallery_loadAlbums = function(){
            fbgallery_pluginDebug("Loading Albums");
            $("#jq-fbgallery-container h1").html(settings.langHeader);
            
            FB.api('/me/albums', function(response) {
                $("#jq-fbgallery-results-container").html(""); 
                
                $.each(response.data, function(key, val){
                    /* Album Data */
                    var albumName = val.name;
                    var albumCoverID = val.cover_photo;
                    var albumID = val.id;
                    
                    /* Cover Photo */
                    FB.api("/" + albumCoverID, function(response){
                        
                        if(!response.hasOwnProperty("error")) {
                            var albumCover = response.picture;
                        
                            $("#jq-fbgallery-results-container").append("<ul id='jq-fbgallery-results-container-list'></ul>");
                            $("#jq-fbgallery-results-container-list").append("<li id='jq-fbgallery-results-container-album-list-" + albumID + "'><a href='#' class='jq-fbgallery-results-album' data-album-name='" + albumName + "' data-album-id='" + albumID + "'><img src='" + albumCover + "'><br>" + albumName +"</a></li>");
                        
                        }
                        
                    });
                    
                });
                
            });
        };
        
        /* Close the Modal window */
        var fbgallery_closeModal = function(){
            fbgallery_pluginDebug("Closing");
            $("#jq-fbgallery-overlay").hide();
            $("#jq-fbgallery-container").hide();
        };
        
        /* Setup the CSS */
        var fbgallery_setCSS = function(){
            fbgallery_pluginDebug("Setting CSS");
            
            $("#jq-fbgallery-container").css({
                zIndex: 3000,
                display: "block"
            });
            
            $("#jq-fbgallery-overlay").css({
                height: "100%",
                width: "100%",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 2999,
                opacity: 0.5
            });
            
            $("#jq-fbgallery-results-container").css({
                overflow: "scroll",
                height: 500
            });
        };
        
        /* Launch the app */
        var fbgallery_launchModal = function(){
            fbgallery_pluginDebug("Launching Modal");
            
            /* Create a container */
            $("body").prepend('<div id="jq-fbgallery-container"><a href="#" id="jq-fbgallery-container-close">&times;</a><h1>' + settings.langHeader + '</h1> <div id="jq-fbgallery-results-container"></div></div><div id="jq-fbgallery-overlay"></div>');
            
            /* Set CSS on the above container */
            fbgallery_setCSS();
            
            /* Close this modal */
            $("#jq-fbgallery-overlay, #jq-fbgallery-container-close").click(function(){
                fbgallery_closeModal();
            });
            
            /* Get a list of facebook albums */
            fbgallery_loadAlbums();
        };
        
        /* Only do stuff if the user clicks on then button */
        this.click(function(){
        
            if(fbgallery_checkFacebookLoginStatus()) {
        
                /* Launch the app */
                fbgallery_launchModal();
                
                /* Return false as not to submit the click action */
                return false;
             
             }          
        });
        
        $(document)
            .on("click", ".jq-fbgallery-results-album", function(){
                fbgallery_pluginDebug("Clicked Album");
            
                var albumID = $(this).attr("data-album-id");
                var albumName = $(this).attr("data-album-name");
                
                fbgallery_loadAlbumPictures(albumID, albumName);
                settings.onAlbumSelect(albumID);
                return false;
            })
            .on("click", "#jq-fbgallery-back", function(){
                fbgallery_pluginDebug("Clicked Back Button");
                
                fbgallery_loadAlbums();
                return false;
            })
            .on("click", ".jq-fbgallery-results-photo", function(){
                fbgallery_pluginDebug("Click a Photo");
                
                var photoID = $(this).attr("data-photo-id");
                fbgallery_closeModal();
                
                FB.api("/" + photoID, function(response){
                    settings.onPhotoSelect(response);
                });    
                
                return false;
            });
    
    };
 
}( jQuery ));