$(document).ready(function () {
  var New = true;
  var id;
  var blob_image;
  var result_of_image;
  var NORMAL=1;
  var HORIZONTAL=2;
  var VERTICAL=4;
  var orientation=NORMAL;
  var picURL;
  // click new role
  $('#btn-NewMember').on('click', function () {
    New = true;
    $('#email').val('');
    $('#name').val('');
    $('#memberemail').val('');
    $('#email').prop('disabled', false);
    $('#title').text('New Member');
    $('.reset').hide();
    $('.pass').show();
    $('#Save').text('Save');
    var mymodal = $('#dialog-newMember');
    $.get("/admin/roles/loadmodules", function (response_json, status) {
    });
    $('#dialog-newMember').modal({
      keyboard: false
    });
    $('#dialog-newMember').on('shown.bs.modal', function() {
      $('#email').focus();
    })
  })
  // end of click new role
  $('#resetpass').click(function () {
    $('#id').val()
    $('#dialog-resetpassword').modal({
      keyboard: false
    });
    
  });
  // edit role
  $('body').on('click', '.editmember', function () {
    id = this.id;
    $('#id').val(id);
    let data = {
      id: id
    }
    showspinner('spinner', 'spinner-container');
    $.post('/admin/member/edit', data, function (response_json, status) {
      $('#name').val(response_json.members[0].name);
      $('#email').prop('disabled', true);
      $('#email').val(response_json.members[0].email);
      $('#role_id').selectpicker('val', response_json.members[0].tblroles[0].role_id);
     
      if (response_json.members[0].id==1){
        $('#role_id').prop('disabled', true);
        $('#role_id').selectpicker('refresh');
      }else{
        $('#role_id').prop('disabled', false);
        $('#role_id').selectpicker('refresh');
      }

      if (!response_json.members[0].profile){
        picURL='./img/profile.jpg';
      }else{
        picURL='./img/'+response_json.members[0].id+'/'+response_json.members[0].profile;
      }

      $('#image-profile').attr('src',picURL);
      $('.reset').show();
      $('.pass').hide();
    });
    hidespinner('spinner', 'spinner-container');
    New = false;
    $('#title').text('Edit Role');
    $('#Save').text('Save Changes');
   
    $('#dialog-newMember').modal({
      keyboard: false
    });
    $('#dialog-newMember').on('shown.bs.modal', function() {
      $('#name').focus();
    })
  });
  //end of edit role

  // form validate
  $('#formMember').validate({
    rules: {
      email: {
        required: true
      },
      name: {
        required: true
      },
      role_id_hidden: {
        required: true
      },
      password: {
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
  $('#formMember').submit(function (event) {
    event.preventDefault();


    if (New == true) {
      let data = {
        email: $('#email').val(),
        name: $('#name').val(),
        role_id: $('#role_id').val(),
        password: $('#password').val(),
        profile: result_of_image
      }
      if ((!data.email) || (!data.name) || (!data.role_id)) {
        $('#Save').text('Save');
        return;
      }
      if ($('#password').val() != $('#repassword').val()) {
        $('#Save').text('Save');
        return;
      }

      $.post('/admin/members/newmember', data, function (response_json) {
        if (response_json.status == 1) {
         let data1 = {
            searchfield: 'name',
            searchkey: '',
            page: '1'
          }
          loadrecords_post('/admin/member/search', data1, 'memberstemplate');
          $('#dialog-newMember').modal('toggle');
          toastr.success('<i class="fas fa-check-circle"></i> User successfully saved!');
        } else {
          toastr.error('<i class="fas fa-exclamation-triangle"></i> Email already registered!');
        }
      });
    } else {
      let data = {
        id: id,
        email: $('#email').val(),
        name: $('#name').val(),
        role_id: $('#role_id').val(),
        profile: result_of_image
      }
      if ((!data.email) || (!data.name) || (!data.role_id)) {
        $('#Save').text('Save');
        return;
      }

      loadrecords_post('/admin/members/editmember', data, 'memberstemplate');
      $('#dialog-newMember').modal('toggle');
      toastr.success('<i class="fas fa-check-circle"></i> User successfully updated!');
    }
  });
  //form submit end

  // Reset Password
  $('#formMemberReset').validate({
    rules: {
      password: {
        required: true
      },
      resetpassword: {
        required: true
      },
    },
    highlight: function (element) {
      $(element).addClass('has-error');
    },
    unhighlight: function (element) {
      $(element).removeClass('has-error');
    },
  });

  $('#formMemberReset').submit(function (event) {
    event.preventDefault();
    let data = {
      id: $('#id').val(),
      password: $('#password').val(),
      resetrepassword: $('#resetrepassword').val()
    }

    $.post('/admin/members/memberresetpassword', data, function (response_json) {
      if (response_json.status == 1) {
        $('#dialog-resetpassword').modal('toggle');
        toastr.success('<i class="fas fa-check-circle"></i> Password successfully saved!');
      } else {
        toastr.error('<i class="fas fa-exclamation-triangle"></i> Error!');
      }
    });
  });
  // end of Reset Password

  $('#member-fields').on('click', 'a', function () {
    let data;
    var searchkey;
    var field = this.id;
    $('#member-searchfield').text(this.id);
    var searchfield = field.toLowerCase();
    if (searchfield == 'status') {
      $('#member-searchkey').hide();
      $('#member-selectactivenotactive').selectpicker('show');
      $('#member-searchaction').hide();
      searchkey = $('#member-selectactivenotactive').val();
    } else {
      $('#member-searchkey').show();
      $('#member-selectactivenotactive').selectpicker('hide');
      $('#member-searchaction').show();
      searchkey = $('#member-searchkey').val();
    }
    
    data = {
      searchfield: searchfield,
      searchkey: searchkey,
      page: '1'
    }
    loadrecords_post('/admin/member/search', data, 'memberstemplate');
  });


  //field base search
  $('#member-selectactivenotactive').change(function () {
    let data;
    var field = $('#member-searchfield').text();
    var searchfield = field.toLowerCase();
    var searchkey = $('#member-selectactivenotactive').val();

    data = {
      searchfield: searchfield,
      searchkey: searchkey,
      page: '1'
    }
    loadrecords_post('/admin/member/search', data, 'memberstemplate');
  });
  
  //end field base search
  //filter
  $('#member-clear').click(function () {
    $('#member-searchkey').val('');
  });

  $('#member-refresh').click(function () {
    $('#member-searchkey').val('');
    data = {
      searchfield: '',
      searchkey: '',
      page: '1'
    }
    loadrecords_post('/admin/member/search', data, 'memberstemplate');
  });


  $('#member-searchkey').keypress(function (e) {
    if (e.which == 13) {
      $('#member-search').trigger('click');
    }
  });
  //search
  $('#member-search').click(function () {
    let data = {
      searchfield: $('#member-searchfield').text(),
      searchkey: $('#member-searchkey').val(),
      page: '1'
    }
    
        loadrecords_post('/admin/member/search', data, 'memberstemplate');
  });
  //end of search

  //  click on pagination
  $('#loadroles').on('click', 'a', function () {
    let data;
    var searchkey;
    if ($('#member-expandedsearch').attr('aria-expanded') === "true") {
      var field = $('#member-searchfield').text();
      var searchfield = field.toLowerCase();
      if (searchfield == 'status') {
        $('#member-searchkey').hide();
        $('#member-selectactivenotactive').selectpicker('show');
        $('#member-searchaction').hide();
        searchkey = $('#member-selectactivenotactive').val();
      } else {

        $('#member-searchkey').show();
        $('#member-selectactivenotactive').selectpicker('hide');
        $('#member-searchaction').show();
        searchkey = $('#member-searchkey').val();
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
    loadrecords_post('/admin/member/search', data, 'memberstemplate');
  });
  // end of click pagination

  $('body').on('click', '.onoff', function () {
    let value = (this.checked ? $(this).val() : "off");

    $.post("/admin/member/roleonoff", { id: this.id, value: value })
      .done(function () {
        toastr.success('<i class="fas fa-check-circle"></i> Changes successfully saved!');
      })
      .fail(function () {
        toastr.warning('<i class="fas fa-exclamation-triangle"></i> Error!');
      })
  });

$('#OpenImgUpload').click(function(){
  blob_image=picURL;
  $image_crop.croppie('bind', {
    url: picURL
  });
  $('#dialog-CropPicture').modal({
    keyboard: false
  });
});
$('#image-profile').click(function(){
  blob_image=picURL;
  $image_crop.croppie('bind', {
    url: picURL
  });
  $('#dialog-CropPicture').modal({
    keyboard: false
  });
});

$('#image-rotate-right').click(function(ev){
  $('#upload-image').croppie('rotate', -90);
});
$('#image-rotate-left').click(function(ev){
  $('#upload-image').croppie('rotate', 90);
});

$('#image-browse').click(function(){
  $('#imgupload').trigger('click');
});

$('#imgupload').on('change', function () { 
  var reader = new FileReader();
  reader.onload = function (e) {
    blob_image=e.target.result;
    $image_crop.croppie('bind', {
      url: e.target.result
    }).then(function(){
      $('#upload-image').croppie('setZoom', 0);
    });			
  }
  reader.readAsDataURL(this.files[0]);
});
  
//  FLIP IMAGE
 $('#image-flip-horizontal').click(function(){
  orientation = orientation == NORMAL ? HORIZONTAL : NORMAL;
    $image_crop.croppie('bind', {
      url: blob_image,
      orientation:orientation
    }).then(function(){
      $('#upload-image').croppie('setZoom', 0);
    });	
});

$('#image-flip-vertical').click(function(){
  orientation = orientation == NORMAL ? VERTICAL : NORMAL;
    $image_crop.croppie('bind', {
      url: blob_image,
      orientation:orientation
    }).then(function(){
      $('#upload-image').croppie('setZoom', 0);
    });	
});


  $image_crop = $('#upload-image').croppie({
    enableExif: true,
    url: 'img/default.jpg',
    enableOrientation: true,
    setZoom: 0,
    viewport: {
        width: 250,
        height: 250,
        type: 'circle'
    },
    boundary: {
        width: 798,
        height: 350
    }
  });

  $('#Crop-image').on('click', function (ev) {
    $image_crop.croppie('result', {
      type: 'canvas',
      size: 'viewport'
    }).then(function (resp) {
    
      result_of_image=resp;
	    $('#image-profile').attr('src',resp);
      $('#dialog-CropPicture').modal('toggle');
    });
  });

  $('#Close-image-generator').click(function(){
    $('#dialog-CropPicture').modal('toggle');
  });

});

