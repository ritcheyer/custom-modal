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

        $(document).on('keyup.gallery', keyPressFunc);
    });

   var keyPressFunc = function(event) {

        var activeThumb = $theatre.find('.thumb-active'),
            prevThumb   = activeThumb.prevWrap(),
            nextThumb   = activeThumb.nextWrap();

            console.log(prevThumb);
            console.log(nextThumb);

        if(e.keyCode === TSLA.Keys.ESCAPE) {

            drawCurtainsOnTheatre();

        } else if(e.keyCode === TSLA.Keys.RIGHT || e.keyCode === TSLA.Keys.DOWN) {



            if (nextThumb.length) {
                switchActiveThumb(activeThumb, 'next');
            }

        } else if(e.keyCode === TSLA.Keys.LEFT || e.keyCode === TSLA.Keys.UP) {

            if (prevThumb.length) {
                switchActiveThumb(activeThumb, 'previous');
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

    // ------------------------------------------------------------
    function unbindTheatreKeys() {
        $(document).unbind( 'keyup.gallery-container' );
    }

    // ------------------------------------------------------------
    function setTheatreImage(img) {
        theatreImage.attr('src', img);
    }

    // ------------------------------------------------------------
    function drawCurtainsOnTheatre() { $theatre.removeClass('open-curtains'); unbindTheatreKeys(); }

    // ------------------------------------------------------------
    function openCurtainsOnTheatre() { $theatre.addClass('open-curtains'); }

    // ------------------------------------------------------------
    // function switchActiveThumb(thumb, direction) {
    //     direction = (typeof direction !== "undefined") ? direction : '';

    //     if(direction === 'next') {
    //         thumb.removeClass('thumb-active').next('.thumb-item').addClass('thumb-active');
    //     }
    //     else if(direction === 'previous') {
    //         thumb.removeClass('thumb-active').prev('.thumb-item').addClass('thumb-active');
    //     }
    //     else {}
    // }


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
