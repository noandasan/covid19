$(document).ready(function () {
  var New = true;
  var role_id;

  $('.statusselect').selectpicker('hide');

  $('body').tooltip({ selector: '[data-toggle="tooltip"]' });

  // edit role
  $('body').on('click', '.editroles', function () {
    role_id = this.id;
    var mymodal = $('#dialog-newRole');
    showspinner('spinner', 'spinner-container');

    $.get('/admin/roles/edit/role_id/' + role_id, function (response_json, status) {
        let modulename = '';

      $('#rolename').val(response_json.roles[0].tblcontrols[0].tblcontrolassignments[0].tblroles[0].rolename);
      modulename += '<div class="accordion" id="accordionRole">';

      for (i = 0; i < response_json.roles.length; i++) {
        modulename += '<div class="card">' +
          '<div class="card-header p-0" id="headingOne">' +
          '<h2 class="mb-0"  data-toggle="collapse" data-target="#r' + response_json.roles[i].module_id + '" aria-expanded="false" aria-controls="r' + response_json.roles[i].module_id + '">' +
          '<button class="btn" type="button">' +
          '<i class="' + response_json.roles[i].icon + '"></i> ' + response_json.roles[i].modulename + '' +
          '</button>' +
          '</h2>' +
          '<span class="checkallroles"><label class="check-container">' +
          '<input type="checkbox" id="checkall-' + response_json.roles[i].module_id + '" name="rolescheckall">' +
          '<span class="checkmark"></span><span id="rolesup' + response_json.roles[i].module_id + '">Check All</span>' +
          '</label><span>' +

          '</div>' +
          '<div id="r' + response_json.roles[i].module_id + '" class="collapse multi-collapse" aria-labelledby="headingOne">' +
          '<div class="card-body"><div class="row">';

        for (x = 0; x < response_json.roles[i].tblcontrols.length; x++) {
          let status;
          if (response_json.roles[i].tblcontrols[x].tblcontrolassignments[0].status === 1) {
            status = 'checked';
          } else {
            status = '';
          }
          modulename += '' +
            '<div id="checkrole" class="col-lg-2 col-md-3 col-6">' +
            '<label class="check-container">' + response_json.roles[i].tblcontrols[x].controlname + ' ' +
            '<input type="checkbox" ' + status + '  id=' + response_json.roles[i].module_id + '-' + response_json.roles[i].tblcontrols[x].control_id + ' name="rolecheckbox">' +
            '<span class="checkmark"></span>' +
            '</label>' +
            '</div>';
        }
        modulename += '</div></div></div></div>';
      }
      modulename += '</div>';
      mymodal.find('.controlmanagement').html(modulename);
    });
    hidespinner('spinner', 'spinner-container');
    New = false;
    $('#title').text('Edit Role');
    $('#Save').text('Save Changes');
    $('#dialog-newRole').modal({
      keyboard: false
    });
  });
  //end of edit role


  //  click on pagination
  $('#loadroles').on('click', 'a', function () {
    let data;
    var searchkey;
    if ($('#expandedsearch').attr('aria-expanded') === "true") {
      var field = $('#searchfield').text();
      var searchfield = field.toLowerCase();
      if (searchfield == 'status') {
        $('#searchkey').hide();
        $('.statusselect').selectpicker('show');
        $('.searchaction').hide();
        searchkey = $('#selectactivenotactive').val();
      } else {

        $('#searchkey').show();
        $('.statusselect').selectpicker('hide');
        $('.searchaction').show();
        searchkey = $('#searchkey').val();
      }
      data = {
        searchfield: searchfield,
        searchkey: searchkey,
        page: this.id
      }
    } else {
      data = {
        searchfield: '',
        searchkey: '',
        page: this.id
      }
    }
    loadrecords_post('/admin/roles/search', data,'rolestemplate');
  });
  // end of click pagination

  // click new role
  $('#btn-NewRole').on('click', function () {
    New = true;

    $('#rolename').val('');
    $('#title').text('New Role');
    $('#Save').text('Save');
    var mymodal = $('#dialog-newRole');
    $.get("/admin/roles/loadmodules", function (response_json, status) {
      let modulename = '';

      modulename += '<div class="accordion" id="accordionRole">';

      for (i = 0; i < response_json.modules.length; i++) {
        modulename += '<div class="card">' +
          '<div class="card-header p-0" id="headingOne">' +
          '<h2 class="mb-0"  data-toggle="collapse" data-target="#r' + response_json.modules[i].module_id + '" aria-expanded="false" aria-controls="r' + response_json.modules[i].module_id + '">' +
          '<button class="btn" type="button">' +
          '<i class="' + response_json.modules[i].icon + '"></i> ' + response_json.modules[i].modulename + '' +
          '</button>' +
          '</h2>' +
          '<span class="checkallroles"><label class="check-container">' +
          '<input type="checkbox" id="checkall-' + response_json.modules[i].module_id + '" name="rolescheckall">' +
          '<span class="checkmark"></span><span id="rolesup' + response_json.modules[i].module_id + '">Check All</span>' +
          '</label><span>' +

          '</div>' +
          '<div id="r' + response_json.modules[i].module_id + '" class="collapse multi-collapse" aria-labelledby="headingOne">' +
          '<div class="card-body"><div class="row">';

        for (x = 0; x < response_json.modules[i].tblcontrols.length; x++) {
          modulename += '' +
            '<div id="checkrole" class="col-lg-2 col-md-3 col-6">' +
            '<label class="check-container">' + response_json.modules[i].tblcontrols[x].controlname + ' ' +
            '<input type="checkbox" id=' + response_json.modules[i].module_id + '-' + response_json.modules[i].tblcontrols[x].control_id + ' name="rolecheckbox">' +
            '<span class="checkmark"></span>' +
            '</label>' +
            '</div>';
        }
        modulename += '</div></div></div></div>';
      }
      modulename += '</div>';
      mymodal.find('.controlmanagement').html(modulename);
    });


    $('#dialog-newRole').modal({
      keyboard: false
    });
    $('#dialog-newRole').on('shown.bs.modal', function() {
      $('#rolename').focus();
    })
  })
  // end of click new role

  //  $('input[type=checkbox][name=rememberme]').prop('checked', true);

  $('body').on('click', 'input[name=rolescheckall]', function () {
    var id = $(this).prop('id');
    var checkid = id.split('-');

    if ($(this).prop('checked')) {
      $('#rolesup' + checkid[1]).text('UnCheck All');
      $("#r" + checkid[1]).find('input[type=checkbox]').each(function () {
        this.checked = true;
      });
    } else {
      $('#rolesup' + checkid[1]).text('Check All');
      $("#r" + checkid[1]).find('input[type=checkbox]').each(function () {
        this.checked = false;
      });
    }
  });

  // form validate
  $('#formroles').validate({
    rules: {
      rolename: {
        required: true
      }
    },
    highlight: function (element) {
      $(element).addClass('has-error');
    },
    unhighlight: function (element) {
      $(element).removeClass('has-error');
    },
  });
  // end of form validate

  // form submit
  $('#formroles').submit(function (event) {
    var controlAssingment = [];
    event.preventDefault();
    $('#searchkey').val('');
    $('#Save').text('Loading');

    $.each($("input[name='rolecheckbox']"), function () {
      let element_id = $(this).attr('id');
      let id = element_id.split('-');
      let module_id = parseInt(id[0]);
      let control_id = parseInt(id[1]);
      if ($(this).prop("checked") == true) {
        controlAssingment.push({ module_id: module_id, control_id: control_id, status: 1 });
      }
      else if ($(this).prop("checked") == false) {
        controlAssingment.push({ module_id: module_id, control_id: control_id, status: 0 });
      }
    });

    if (New == true) {
      let data = {
        rolename: $('#rolename').val(),
        status: '0',
        controlAssingment: controlAssingment
      }
      if (!data.rolename) {
        $('#Save').text('Save');
        return;
      }
      loadrecords_post('/admin/roles/newrole', data, 'rolestemplate')
        toastr.success('<i class="fas fa-check-circle"></i> Successfully saved!');
    } else {
      let data = {
        role_id: role_id,
        rolename: $('#rolename').val(),
        controlAssingment: controlAssingment
      }
      if (!data.rolename) {
        $('#Save').text('Save');
        return;
      }
      loadrecords_post('/admin/roles/editrole', data,'rolestemplate')
      toastr.success('<i class="fas fa-check-circle"></i> Changes successfully saved!');
    }
    $('#dialog-newRole').modal('toggle');
  });
  // end of form submit

  //filter
  $('#clear').click(function () {
    $('#searchkey').val('');
  });

  $('#refresh').click(function () {
    $('#searchkey').val('');
    data = {
      searchfield: '',
      searchkey: '',
      page: '1'
    }
    loadrecords_post('/admin/roles/search', data,'rolestemplate');
  });

  $('#searchkey').keypress(function (e) {
    if (e.which == 13) {
      $('#search').trigger('click');
    }
  });

  $('.fields').on('click', 'a', function () {
    let data;
    var searchkey;
    var field = this.id;
    $('#searchfield').text(this.id);
    var searchfield = field.toLowerCase();
    if (searchfield == 'status') {
      $('#searchkey').hide();
      $('.statusselect').selectpicker('show');
      $('.searchaction').hide();
      searchkey = $('#selectactivenotactive').val();
    } else {
      $('#searchkey').show();
      $('.statusselect').selectpicker('hide');
      $('.searchaction').show();
      searchkey = $('#searchkey').val();
    }
    data = {
      searchfield: searchfield,
      searchkey: searchkey,
      page: '1'
    }
    loadrecords_post('/admin/roles/search', data,'rolestemplate');
  });

  $('#search').click(function () {
    let data = {
      searchfield: $('#searchfield').text(),
      searchkey: $('#searchkey').val(),
    }
    loadrecords_post('/admin/roles/search', data,'rolestemplate');
  });

  $('#selectactivenotactive').change(function () {
    let data;
    var field = $('#searchfield').text();
    var searchfield = field.toLowerCase();
    var searchkey = $('#selectactivenotactive').val();

    data = {
      searchfield: searchfield,
      searchkey: searchkey,
      page: '1'
    }
    loadrecords_post('/admin/roles/search', data,'rolestemplate');
  });

  $('body').on('click','.roles', function () {
    let value = (this.checked ? $(this).val() : "off");
   
    $.post("/admin/roles/roleonoff", { id: this.id, value: value })
    .done(function() {
      toastr.success('<i class="fas fa-check-circle"></i> Changes successfully saved!');
    })
    .fail(function() {
      toastr.warning('<i class="fas fa-exclamation-triangle"></i> Error!');
    })
  });

  
});
