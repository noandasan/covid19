$(document).ready(function() {
     import moment from 'moment'
    NProgress.done();
  
   


    $('input').on('focus',function(){
        $('input').removeClass('bordererror');
    });
    $('[data-toggle="tooltip"]').tooltip()
    // $("#sidebar-menu").mCustomScrollbar({
    //     theme: "minimal"
    // });
    $("#home").mCustomScrollbar({
        theme: "minimal"
    });
    $("#profile").mCustomScrollbar({
        theme: "minimal"
    });
    // $("#sidebar-menu").mCustomScrollbar({
    //     theme: "minimal"
    // });

    $('#sidebarCollapse').on('click', function() {
        $('#sidebar, #content,.sticky').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

    $('ul').on('click', function() {
        if (this.id) {
            localStorage.setItem('S00', this.id);
        }
    });

    var S00 = localStorage.getItem('S00');
    if (S00) {
        $('#' + S00).collapse('show')
    }
    $('ul.sidebar li a').on('click', function() {
        if (this.id) {
            localStorage.setItem('S01', this.id);
        }
    });
    var S01 = localStorage.getItem('S01');
    if (S01) {
        $('#' + S01).attr('aria-expanded', 'true');
    }
    $('#logout').on('click', function() {
        localStorage.clear();
    })
 
    $('#loginform').on('keypress',"input", function(){
        if (e.which == 13) {
            $('#loginform').submit() 
         }
    });

   // $('#email_login').focus();
 
        var interval = setInterval(function() {
            var momentNow = moment();
            $('#date-part').html(momentNow.format('YYYY MMMM DD') + ' '
                                + momentNow.format('dddd')
                                .substring(0,3).toUpperCase());
            $('#time-part').html(momentNow.format('A hh:mm:ss'));
        }, 100);

        // $('#stop-interval').on('click', function() {
        //     clearInterval(interval);
        // });
  
});

