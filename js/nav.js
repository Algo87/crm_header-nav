function slideToggleNav() {


    $('.sidebar-main-link-arrow').click(function () {

        console.log($(this).parent())
        if (!$('.wrapper-navigation').hasClass('wrapper-open')) {
            $('.sidebar-item-wrapper').next().slideUp();
        } else {
            if ($(this).parent().hasClass('active-bg')) {

                $(this).parent().next().slideUp();
                $(this).parent().find('.sidebar-main-link').removeClass('active-link');
                $(this).parent().removeClass('active');

            } else {

                $('.sidebar-item-wrapper').find('.sidebar-main-link').removeClass('active-link');
                $('.sidebar-item-wrapper').parent().removeClass('active');
                $('.sidebar-item-wrapper').next().slideUp();
                $(this).parent().next().slideDown();
                $(this).parent().find('.sidebar-main-link').addClass('active-link');
                $(this).parent().parent().addClass('active');

            }

        }


    })
}

slideToggleNav();

function slideUpForCloseNav() {
    console.log('sdfsfdsdfs');
    $('.sidebar-item-wrapper').click(function () {

        if (!$('.wrapper-navigation').hasClass('wrapper-open')) {
            $('.sidebar-item-wrapper').next().slideUp();
        }


    })

}

// slideUpForCloseNav();
function bgForChildLink() {
    $('.sidebar-item').click(function () {
        if ($(this).hasClass('active-bg')) {
            $(this).removeClass('active-bg');
        } else {
            $('.sidebar-item').removeClass('active-bg');
            $(this).addClass('active-bg');
        }
    })
}

bgForChildLink();

// function styleForIconHover(){
// .sidebar-item--haschild-close .sidebar-item-img
// }
// styleForIconHover();
function sidebarInnerLinkStyle() {
    $('.sidebar-main-link-arrow').click(function () {
        if ($(this).parent().hasClass('active-bg')) {
            $(this).parent().removeClass('active-bg');
        } else {
            $('.sidebar-item-wrapper').removeClass('active-bg');
            $(this).parent().addClass('active-bg');
        }


    });
}

sidebarInnerLinkStyle();
function customScroll() {
    //The passed argument has to be at least a empty object or a object with your desired options
    $('.wrapper-navigation').overlayScrollbars({
        className       : "os-theme-dark",
        resize          : "vertical",
        sizeAutoCapable : true,
        paddingAbsolute : true,
        scrollbars : {
            clickScrolling : true
        }
    });
}
customScroll();


function burgerActive() {
    $('.burger').click(function () {
        $('.burger').toggleClass('burger-left');
        $('.burger-part').toggleClass('burger-close');
        $('.wrapper-navigation').toggleClass('wrapper-open');
        $('.sidebar-item--haschild').toggleClass('sidebar-item--haschild-close');
        $('.sidebar-item-wrapper').next().slideUp();
        $('.sidebar-item-wrapper').removeClass('active-bg');
        $('.sidebar-main-link').removeClass('active-link');
        $('.sidebar-item--haschild').removeClass('active');
        $('.small-logo').toggleClass('opacity');
        $('.big-logo').toggleClass('opacity');
        $('body').toggleClass('hidden');
        $('.header-left-part-item').removeClass('shadow-block');
        $('.header-right-part').removeClass('shadow-block');


        if ($('.overlay').hasClass('overlay-active')) {
            $('.overlay').fadeOut(300);
            $('.overlay').removeClass('overlay-active');
            $('.header-left-part').removeClass('header-left-padding');
            // customScroll();

        } else {
            // $('.burger').toggleClass('burger-left');
            // $('.burger-part').toggleClass('burger-close');
            // $('.wrapper-navigation').toggleClass('wrapper-open');
            // $('.sidebar-item--haschild').toggleClass('sidebar-item--haschild-close');
            // $('.sidebar-item-wrapper').next().slideUp();
            // $('.sidebar-item-wrapper').removeClass('active-bg');
            // $('.sidebar-main-link').removeClass('active-link');
            // $('.sidebar-item--haschild').removeClass('active');
            // $('.small-logo').toggleClass('opacity');
            // $('.big-logo').toggleClass('opacity');
            $('.overlay').toggleClass('overlay-active');
            $('.overlay').fadeIn(300);
            $('.header-left-part').addClass('header-left-padding');

        }


    })
}

burgerActive();


function innerLinkStyle() {
    $('.sidebar-link').click(function () {
        if ($(this).hasClass('active-link')) {
            $(this).removeClass('active-link');
            customScroll();
        } else {
            $('.sidebar-link').removeClass('active-link');
            $(this).addClass('active-link');
        }
    })
}


innerLinkStyle();

function overlayClickCloseNav() {
    $('.overlay').click(function () {

        $('.burger').trigger('click');

    })
}

overlayClickCloseNav();

function headerDropdownHide() {
    $('.burger').click(function () {
        $('.b-dropdown').slideUp();
        $('.b-dropdown-user').slideUp();
        $('.b-dropdown').removeClass('b-dropdown-active');
        $('.b-dropdown-user').removeClass('b-dropdown-active');
    })
}

headerDropdownHide();
