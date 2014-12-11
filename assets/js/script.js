/* ------------------------------------------------------------
Features
    1. Keyboard navigation
        - left/right
        - escape to close
    2. cover full screen with white backdrop
    3. theatre image full screen / edge-to-edge while maintaining aspect ratio
    4. switching between thumbnails by clicking or keyboard navigation

------------------------------------------------------------ */

// --- set up TSLA Object
var TSLA = TSLA || {};

// --- set up keys available
TSLA.Keys = {
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
        theatreImage = $theatre.find('.theatre-image');

    $('.image-theatre').on('click', '.theatre-close', function(e) {
        drawCurtainsOnTheatre($(this));
    });

    $('.gallery-container').on('click', '.image-link', function(e) {
        e.preventDefault();

        // --- set up variables
        var $this = $(this),
            theatreImgSrc = $this.attr('href');

        setTheatreImage(theatreImgSrc);

        openCurtainsOnTheatre();

        bindTheatreKeys();
    });

   var keyPressFunc = function(e) {

        var activeThumb = $theatre.find('.thumb-active'),
            prevThumb   = activeThumb.prevWrap(),
            nextThumb   = activeThumb.nextWrap();

        if(e.keyCode === TSLA.Keys.ESCAPE) {

            drawCurtainsOnTheatre();

        } else if(e.keyCode === TSLA.Keys.RIGHT || e.keyCode === TSLA.Keys.DOWN) {

            if (nextThumb.length) {
                switchActiveThumb(nextThumb);
            }

        } else if(e.keyCode === TSLA.Keys.LEFT || e.keyCode === TSLA.Keys.UP) {

            if (prevThumb.length) {
                switchActiveThumb(prevThumb);
            }

        }
    }

    $('.theatre-thumbs').on('click', '.image-link', function(e) {
        e.preventDefault();

        var $this = $(this),
            theatreImgSrc = $this.attr('href'),
            thumbsContainer = $this.closest('.theatre-thumbs'),
            allThumbs = thumbsContainer.children();

        switchActiveThumb($this);

        // remove active state on all thumbs
        allThumbs.removeClass('thumb-active');

        // make this one active
        $this.parent('.thumb-item').addClass('thumb-active');

        setTheatreImage(theatreImgSrc);
    });

    // Bind Keys to the Theatre -----------------------------------
    function bindTheatreKeys() {
        $(document).on('keyup.gallery', keyPressFunc);
    }

    // Unbind Keys to the Theatre ---------------------------------
    function unbindTheatreKeys() {
        $(document).off('keyup.gallery', keyPressFunc);
    }

    // Swap Theatre image -----------------------------------------
    function setTheatreImage(img) {
        theatreImage.attr('src', img);
    }

    // Close Theatre ----------------------------------------------
    function drawCurtainsOnTheatre() {
        $theatre.removeClass('open-curtains');
        unbindTheatreKeys();
    }

    // Open Theatre -----------------------------------------------
    function openCurtainsOnTheatre() {
        $theatre.addClass('open-curtains');
    }

    // ------------------------------------------------------------
    function switchActiveThumb(thumb) {
        thumb.siblings('.thumb-active').removeClass('thumb-active');
        thumb.addClass('thumb-active');
    }
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
})(jQuery);
