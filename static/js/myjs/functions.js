NProgress.start();
NProgress.set(0.4);
NProgress.inc();
NProgress.configure({ ease: 'ease', speed: 500 });
NProgress.configure({ trickleSpeed: 800 });
NProgress.configure({ parent: '#progress' });


function showspinner(element1, element2) {
    $('.' + element1).addClass('show');
    $('.' + element2).addClass('show');
  }
  function hidespinner(element1, element2) {
    $('.' + element1).addClass('hide');
    $('.' + element2).addClass('hide');
  }
  function loadrecords_get(pageNumber) {
    showspinner('spinner', 'spinner-container');
    $.ajax({
      type: 'get',
      dataType: 'json',
      url: "/admin/ajaxroles/page/" + pageNumber,
      success: function (response_json) {
        var source = $("#rolestemplate").html();
        var template = Handlebars.compile(source);
        var html = template(response_json);
        $("#loadroles").html(html);
      }
    });
    hidespinner('spinner', 'spinner-container');
  }

  function loadrecords_post(url, data, varsciptname) {
    showspinner('spinner', 'spinner-container');
    $.post(url, data, function (response_json, status) {
        var source = $("#"+varsciptname).html();
        var template = Handlebars.compile(source);
        var html = template(response_json);
        $("#loadroles").html(html);
      // }).fail(function () {
    });
    hidespinner('spinner', 'spinner-container');
  }

  function loadrecords_get1(url, data, varsciptname) {
    showspinner('spinner', 'spinner-container');
    $.get(url, data, function (response_json, status) {
     
        var source = $("#"+varsciptname).html();
        var template = Handlebars.compile(source);
        var html = template(response_json);
        $("#loadroles").html(html);
      // }).fail(function () {
    });
    hidespinner('spinner', 'spinner-container');
  }

  function loadrecords_post_final(url, data, varsciptname, vardisplay) {
    showspinner('spinner', 'spinner-container');
    $.post(url, data, function (response_json, status) {
        var source = $("#"+varsciptname).html();
        var template = Handlebars.compile(source);
        var html = template(response_json);
        $("#"+vardisplay).html(html);
      // }).fail(function () {
    });
    hidespinner('spinner', 'spinner-container');
  }