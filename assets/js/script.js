/* ------------------------------------------------------------
Features
    1. Keyboard navigation
        - left/right
        - escape to close
    2. cover full screen with white backdrop
    3. theatre image full screen / edge-to-edge while maintaining aspect ratio
    4. switching between thumbnails by clicking or keyboard navigation

------------------------------------------------------------ */

// --- set up OBJ Object
var OBJ = OBJ || {};

// --- set up keys available
OBJ.Keys = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ESCAPE: 27,
    SPACE: 32,
    BACKSPACE: 8,
    DELETE: 46,
    END: 35,
    HOME: 36,
    PAGEDOWN: 34,
    PAGEUP: 33,
    RETURN: 13,
    TAB: 9
};

$(document).ready(function(){

    // --- set up variables
    var $theatre     = $('.image-theatre'),
        $gallery     = $('.gallery-container'),
        theatreImage = $theatre.find('.theatre-image');

    var handleImageClick = function(e){
        e.preventDefault();

        var $this = $(this),
            theatreImgSrc = $this.attr('href'),
            thumbsContainer = $this.closest('.theatre-thumbs'),
            allThumbs = thumbsContainer.children();

        switchActiveThumb($this.parent());

        setTheatreImage(theatreImgSrc);
    };

    var handleKeyPress = function(e) {

        var activeThumb = $theatre.find('.thumb-active'),
            prevThumb   = activeThumb.prevWrap(),
            nextThumb   = activeThumb.nextWrap();

        if(e.keyCode === OBJ.Keys.ESCAPE) {
            drawCurtainsOnTheatre();

        } else if(e.keyCode === OBJ.Keys.RIGHT || e.keyCode === OBJ.Keys.DOWN) {
            handleImageClick.call(nextThumb.find('.image-link'), e);
            // nextThumb.find('.image-link').trigger('click');

        } else if(e.keyCode === OBJ.Keys.LEFT || e.keyCode === OBJ.Keys.UP) {
            handleImageClick.call(prevThumb.find('.image-link'), e);
            // prevThumb.find('.image-link').trigger('click');
        }
    };

    // Bind Keys to the Theatre -----------------------------------
    function bindTheatreKeys() {
        $(document).on('keyup.gallery', handleKeyPress);
    }

    // Unbind Keys to the Theatre ---------------------------------
    function unbindTheatreKeys() {
        $(document).off('keyup.gallery', handleKeyPress);
    }

    // Clone thumbnails to theatre --------------------------------
    function setThumbnails(element) {
        element.clone().appendTo($theatre.find('.thumbs-container'));
    }

    // Remove thumbnails from theatre -----------------------------
    function removeThumbnails() {
        $theatre.find('.thumbs-container .theatre-thumbs').remove();
    }

    // Swap Theatre image -----------------------------------------
    function setTheatreImage(img) {
        theatreImage.attr('src', img);
    }

    // Close Theatre ----------------------------------------------
    function drawCurtainsOnTheatre() {
        $theatre.removeClass('open-curtains');
        removeThumbnails();
        unbindTheatreKeys();
    }

    // Open Theatre -----------------------------------------------
    function openCurtainsOnTheatre() {
        $theatre.addClass('open-curtains');
        bindTheatreKeys();
    }

    // Switch currently active thumb ------------------------------
    function switchActiveThumb(thumb) {
        thumb.addClass('thumb-active').siblings('.thumb-active').removeClass('thumb-active');
    }


    $('.image-theatre').on('click', '.theatre-close', function(e) {
        drawCurtainsOnTheatre();
    });

    $gallery.on('click', '.image-link', function(e) {
        e.preventDefault();

        // --- set up variables
        var $this = $(this),
            theatreImgSrc = $this.attr('href'),
            thumbnailElement = $this.closest('.image-container').siblings('.thumbs-container').children('.theatre-thumbs');

        // --- clone the thumbnail markup into the theatre
        setThumbnails(thumbnailElement);

        // --- set the initial theatre image
        setTheatreImage(theatreImgSrc);

        // --- let the show begin!
        openCurtainsOnTheatre();

        // --- activate thumbnail clicking
        $('.theatre-thumbs').on('click', '.image-link', handleImageClick);

    });

    // ------------------------------------------------------------
    (function($) {
        $.fn.nextWrap = function() {
            var $next = this.next();
            return ($next.length === 0) ? this.siblings().first() : $next;
        };

        $.fn.prevWrap = function() {
            var $prev = this.prev();
            return ($prev.length === 0) ? this.siblings().last() : $prev;
        };

        $.fn.preload = function() {
            this.each(function(){
                $('<img/>')[0].src = this;
            });
        }
    })(jQuery);

});
$(window).on('load', function() {
    var images = $('.gallery-container').find('.image-link'),
        preloadImagesArray = [];

    $.each(images, function(key, value) {
        preloadImagesArray.push($(images[key]).attr('href'));
        $(preloadImagesArray).preload();
    });
});
