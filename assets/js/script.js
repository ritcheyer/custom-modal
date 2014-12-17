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

    $(document).ready(function(){

        // --- set up variables
        var $theatre     = $('.modal-theatre'),
            $gallery     = $('.gallery-container'),
            $theatreImage = $theatre.find('.theatre-image');

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

            } else if(e.keyCode === OBJ.Keys.LEFT || e.keyCode === OBJ.Keys.UP) {
                handleImageClick.call(prevThumb.find('.image-link'), e);
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
            $theatreImage.attr('src', img);
        }

        // Close Theatre ----------------------------------------------
        function drawCurtainsOnTheatre(e) {
            $('body').removeClass('theatre-open');
            $theatre.removeClass('open-curtains');
            unbindTheatreKeys();
            cleanTheTheatre();
        }

        // Open Theatre -----------------------------------------------
        function openCurtainsOnTheatre() {
            $('body').addClass('custom-modal-open');
            $theatre.addClass('open-curtains');
            bindTheatreKeys();
        }

        // Cleanup the theatre for the next one -----------------------
        function cleanTheTheatre() {
            $theatreImage.attr('src', '');
            $theatre.find('.theatre-thumbs').remove();
        }

        // Switch currently active thumb ------------------------------
        function switchActiveThumb(thumb) {
            thumb.addClass('thumb-active').siblings('.thumb-active').removeClass('thumb-active');
        }

        // --- Let's create the markup for the thumbnails
        function createThumbnailMarkup(array, selectedImage) {
            var thumbnailMarkup = '',
                thumbActiveClass,
                index,
                value,
                thumbImage,
                thisThumb;

            thumbnailMarkup +=  "<ol class='theatre-thumbs'>";

            $.each(array, function( index, value ) {

                thumbImage = $(value).find('.thumb-image').attr('src');

                if(selectedImage.attr('href') === $(value).attr('href')) {
                    thumbActiveClass = ' thumb-active';
                } else {
                    thumbActiveClass = '';
                }

                thumbnailMarkup +=  "<li class='thumb-item" + thumbActiveClass + "'>";
                thumbnailMarkup +=      "<a href=" + value + " class='image-link'>";
                thumbnailMarkup +=          "<img src=" + thumbImage + " class='thumb-image'>";
                thumbnailMarkup +=      "</a>";
                thumbnailMarkup +=  "</li>";
            });

            thumbnailMarkup +=  "</ol>";

            setThumbnails($(thumbnailMarkup));
        }

        $('.modal-theatre').on('click', '.theatre-close', drawCurtainsOnTheatre);

        // --- Clicking on an image should display modal
        $gallery.on('click', '.image-link', function(e) {
            e.preventDefault();

            // set up variables
            var $this               = $(this),
                theatreImgSrc       = $this.attr('href'),
                imageContainer      = $this.closest('.image-container'),
                thumbnailGroup      = $this.data('group'),
                filmstripContainer  = imageContainer.closest('.filmstrip-container'),
                thumbnailContainer  = imageContainer.siblings('.thumbs-container'),
                thumbnailElement    = thumbnailContainer.children('.theatre-thumbs'),
                allImagesForTheatre = filmstripContainer.find($('[data-group="' + thumbnailGroup + '"]'));

            // determine where the thumbnails are.
            if(filmstripContainer.length) {
                // collect all iamges of the same data-group
                createThumbnailMarkup(allImagesForTheatre, $this);
            } else {
                // collect thumbnail element and clone it to the theatre
                setThumbnails(thumbnailElement);
            }

            // set the initial theatre image
            setTheatreImage(theatreImgSrc);

            // let the show begin!
            openCurtainsOnTheatre();

            // activate thumbnail clicking
            $('.theatre-thumbs').on('click', '.image-link', handleImageClick);

        });

    });

    $(window).on('load', function() {
        var largeImages = $('.gallery-container .image-link');

        largeImages.map(function() {
            return $(this).attr('href');
        }).preload();
    });
})(jQuery);
