
function unbindGalleryKeys() {
    $( document ).unbind( 'keyup.modal' );
}

function bindGalleryKeys( $modalWindow ) {
    $( document ).on( 'keyup.modal', function( event ) {
        // debug.log( 'keyup.modal', event );
        // Bind escape key to close modal.
        if ( event.keyCode === TC.Keys.ESCAPE ) {
            // debug.log( 'keyup.modal.escape' );
            $modalWindow.find( '.close' ).click();
        }
        else if ( event.keyCode === TC.Keys.LEFT ) {
            // debug.log( 'keyup.modal.left' );
            $modalWindow
                .find( '.thumbs a.active' )
                    .removeClass( 'active' )
                .prevWrap()
                    .click();
        }
        else if ( event.keyCode === TC.Keys.RIGHT ) {
            // debug.log( 'keyup.modal.right' );
            $modalWindow
                .find( '.thumbs a.active' )
                    .removeClass( 'active' )
                .nextWrap()
                    .click();
        }
    });
}

function imgModal( obj ) {
    var $body = $( 'body' );
    var $thumbs = $(obj).next();

    if ( !$thumbs.hasClass('thumbs') ) {
        $thumbs = '';
    }

    var modelSOptionsHtml = '';
    if ( $thumbs.length ) {
        modelSOptionsHtml = [
            '<div class="model_s_options">',
                '<div class="option-image">',
                    $thumbs[0].outerHTML,
                '</div>',
            '</div>',
        ].join( '' );
    }

    var $modal = $( '.cmodal' );
    $modal
        .addClass('configurator')
        .html([
            '<div class="gallery">',
                '<div class="close">',
                    '<a href="">',
                    '</a>',
                '</div>',
                '<div class="hero">',
                    getHeroHtml( $(obj) ),
                '</div>',
                modelSOptionsHtml,
            '</div>',
            ''].join( '' ))
        .find( '.close' )
            .click(function( event ) {
                event.preventDefault();

                $modal
                    .find( '.gallery' )
                        .css({
                            '-webkit-transition-duration' : '300ms',
                            '-moz-transition-duration' : '300ms',
                            '-o-transition-duration' : '300ms',
                            'transition-duration' : '300ms'
                        });

                setTimeout(function( instance ) {
                    return function() {
                        instance.find( '.gallery' ).css({
                            'opacity' : '0',

                            '-webkit-transform' : 'scale(.75)',
                            '-moz-transform' : 'scale(.75)',
                            '-o-transform' : 'scale(.75)',
                            'transform' : 'scale(.75)',
                        });

                        // FIXME: Bind to transitionEnd instead of using timeout.
                        setTimeout(function( instance ) {
                            return function() {
                                instance.hide();
                            };
                        }( instance ), 300);
                    };
                }( $modal ), 1);

                unbindGalleryKeys();
            })
            .end()
        .find( '.model_s_options' )
            .find( 'a' )
                .each(function() {
                    // debug.log( $(this) );

                    $(this).click(function( event ) {
                        // debug.log( 'anchor clicked' );
                        event.preventDefault();

                        $modal.find( '.hero' ).html( getHeroHtml( $(this) ) );

                        $(this)
                            .siblings( 'a' )
                                .removeClass( 'active' )
                                .end()
                            .addClass( 'active' );
                    })
                })
                .end()
            .end()
        .find( '.gallery' )
            .css({
                'opacity' : '0',

                '-webkit-transform' : 'scale(.75)',
                '-moz-transform' : 'scale(.75)',
                '-o-transform' : 'scale(.75)',
                'transform' : 'scale(.75)',

                '-webkit-transition-duration' : '400ms',
                '-moz-transition-duration' : '400ms',
                '-o-transition-duration' : '400ms',
                'transition-duration' : '400ms'
            })
            .end()
        .show();

    setTimeout(function( instance ) {
        return function() {
            instance.find( '.gallery' ).css({
                'opacity' : '1',

                '-webkit-transform' : 'scale(1)',
                '-moz-transform' : 'scale(1)',
                '-o-transform' : 'scale(1)',
                'transform' : 'scale(1)'
            });
        };
    }( $modal ), 100);

    bindGalleryKeys( $modal );
    $(obj).css({ cursor: 'pointer', opacity: 1 });
}

function requiresLighterMagnifyingGlass( opt_code ) {
    var lighter_magnifying_glass_list = ['TP02', 'C_STDEQ'];
    var is_opt_code_in_lighter_list = lighter_magnifying_glass_list.indexOf(opt_code) >= 0;
    return is_opt_code_in_lighter_list;
}

$( '.option-image' ).each(function() {
    if ( $(this).data( 'processed' ) ) {
        return;
    }

    $(this).data( 'processed', true );
    // Display modal when large thumbnail is clicked.
    var $largeThumbnailLink  = $(this).find( '> a' );
    var $largeThumbnailImage = $(this).find( 'img.large' );

    // Don't add modal zoom for "Performance Plus" and "Paint Armor" option.
    var code = $largeThumbnailLink.data( 'code' );
    if ( code === 'PA01' ||
         code === 'PX01' ) {
        $(this).addClass('inactive');
        $largeThumbnailLink.click(function( event ) {
            event.preventDefault();
        });
        return;
    }
    else if ( TC.global.longFormShow && no_overlay_opts.length ) {
        if ( _.contains( no_overlay_opts, code ) ) {

            $(this).addClass('inactive');

            if ( ! $largeThumbnailImage.data( 'srcUpdated' ) ) {
                $largeThumbnailImage.data( 'srcUpdated', true );
                $largeThumbnailImage.prop( 'src', TC.modelSOptions.getMediumImage( $largeThumbnailImage.prop( 'src' ) ) );
            }

            $largeThumbnailLink.click(function( event ) {
                event.preventDefault();
            });
            return;
        }
    }

    // Add magnifying glass.
    var magnifying_class_class = ( requiresLighterMagnifyingGlass(code) ? 'light' : '' );
    $largeThumbnailLink.append( '<span class="'+ magnifying_class_class +'"></span>' );

    if ( ! $largeThumbnailImage.data( 'srcUpdated' ) ) {
        $largeThumbnailImage.data( 'srcUpdated', true );
        $largeThumbnailImage.prop( 'src', TC.modelSOptions.getMediumImage( $largeThumbnailImage.prop( 'src' ) ) );
    }

    $largeThumbnailLink.click(function( event ) {
        // debug_log( 'large thumbnail link clicked' );
        event.preventDefault();

        //img loader animation
        $(this).css({ cursor: 'wait', opacity: 0.4 });

        var fullsizeImgSrc = TC.modelSOptions.getLargeImage( $(this).prop( 'href' ) );
        preloadImage(fullsizeImgSrc, imgModal, this);
    });

    var $smallThumbnailLinks = $(this).find( '.thumbs a' );

    $smallThumbnailLinks.each(function( index ) {
        // Set first thumbnail as active in each option thumbnails group.
        if ( index === 0 ) {
            $(this).addClass( 'active' );
        }

        var $smallThumbnailImage = $(this).find( 'img' );
        $smallThumbnailImage.prop( 'src', TC.modelSOptions.getSmallImage( $(this).prop( 'href' ) ) );

        $(this).click(function( event ) {
            // debug.log( 'small thumbnail clicked' );

            event.preventDefault();

            $(this)
                .siblings()
                    .removeClass( 'active' )
                    .end()
                .addClass( 'active' );

            var href = $(this).prop( 'href' )
            $largeThumbnailLink.prop( 'href', href );
            $largeThumbnailImage.prop( 'src', TC.modelSOptions.getMediumImage( href ) );
        });
    });
});
