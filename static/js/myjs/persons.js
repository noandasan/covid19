$(document).ready(function () {
    
    var New=true;
    
 

    $('.country_id').click(function(){
      $('#message_country_id').hide();
    });
    $('.location_id').click(function(){
      $('#message_location_id').hide();
    });
  
    $('#btn-NewPerson').click(function(){
        New=true;
        $('#id').val('');
        $('#title').text('New Person');
        $('#Save').text('Save');
        $('#person_id').prop('disabled', false);
        $('#status-confirm').attr('checked', true);
        $('#dialog-newPerson').modal({
            keyboard: false
        });
 
        $('#dialog-newPerson').on('shown.bs.modal', function() {
            $('#id').focus();
         })
    });

    // form validate
    $('#formPerson').validate({
        rules: {
          person_id: {
              required: true
          },
          name: {
            required: true
          },
          age: {
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
    $('#formPerson').submit(function (event) {
        event.preventDefault();

        if (New == true) {
            let data={
              person_id: $('#person_id').val(),
                name: $('#name').val(),
                age: $('#age').val(),
                location_id: $('#location_id').val(),
                country_id: $('#country_id').val(),
                status: $("input[name='status']:checked").val()
            }

            if(!data.country_id){
              $('#message_country_id').show();
               return;
            }
            if(!data.location_id){
              $('#message_location_id').show();
               return;
            }

            if(!data.person_id || !data.name || !data.age){
                return;
            }

            $.post('/person/newperson', data, function (response_json) {
                if (response_json.status == 1) {
                 let data1 = {
                    searchfield: '',
                    searchkey: '',
                    page: '1'
                  }

                  loadrecords_post_final('/person/search', data1, 'personstemplate','loadPersons');
                  $('#dialog-newPerson').modal('toggle');
                  toastr.success('<i class="fas fa-check-circle"></i> Person successfully saved!');
                } else {
                  toastr.error('<i class="fas fa-exclamation-triangle"></i> Already Exist!');
                }
            });
        }else{
                  
           let data={
                person_id: $('#person_id').val(),
                name: $('#name').val(),
                age: $('#age').val(),
                location_id: $('#location_id').val(),
                country_id: $('#country_id').val(),
                status: $("input[name='status']:checked").val()
           }
           if(!data.person_id || !data.name || !data.age || !data.location_id || !data.country_id){
            return;
          }
         
          $.post('/person/editperson', data, function (response_json) {
            if (response_json.status == 1) {
                
             let data1 = {
                searchfield: '',
                searchkey: '',
                page: '1'
              }
              loadrecords_post_final('/person/search', data1, 'personstemplate','loadPersons');

              $('#dialog-newPerson').modal('toggle');
              toastr.success('<i class="fas fa-check-circle"></i> Person successfully Updated!');
            }
        });
        }

    });


    // Search 
    $('#person-fields').on('click', 'a', function () {
        let data;
        var searchkey;
        var field = this.id;
        $('#person-searchfield').text(this.id);
        var searchfield = field.toLowerCase();
      
          $('#person-searchkey').show();
          searchkey = $('#person-searchkey').val();
    
        data = {
          searchfield: searchfield,
          searchkey: searchkey,
          page: '1'
        }
        $('#person-searchkey').focus();
        loadrecords_post_final('/person/search', data, 'personstemplate','loadPerson');
      });
    
      $('#person-clear').click(function () {
        $('#person-searchkey').val('');
        $('#person-searchkey').focus();
      });
    
      $('#person-refresh').click(function () {
        $('#person-searchkey').val('');
        data = {
          searchfield: '',
          searchkey: '',
          page: '1'
        }
        
        loadrecords_post_final('/person/search', data, 'personstemplate','loadPersons');
        $('#person-searchkey').focus();
      });
      
      $('#person-searchkey').keypress(function (e) {
        if (e.which == 13) {
          $('#person-search').trigger('click');
        }
      });

    $('#person-search').click(function(){
        let data = {
            searchfield: $('#person-searchfield').text(),
            searchkey: $('#person-searchkey').val(),
            page: '1'
          }
          $('#person-searchkey').focus();
          loadrecords_post_final('/person/search', data, 'personstemplate','loadPersons');
    });

    $('body').on('click', '.editperson', function () {
        New=false;
        id = this.id;
        
        let data = {
            id: id
        }
        $.post('/person/edit', data, function (response_json, status) {
         
            $('#person_id').val(response_json.person[0].person_id);
            $('#name').val(response_json.person[0].name);
            $('#age').val(response_json.person[0].age);
            $('#country_id').selectpicker('val', response_json.person[0].country_id);
            $('#location_id').selectpicker('val', response_json.person[0].location_id);
        });

        $('#title').text('Edit Person');
        $('#Save').text('Save Changes');
        $('#person_id').prop('disabled', true);


        $('#dialog-newPerson').modal({
            keyboard: false
         });
        
         $('#dialog-newPerson').on('shown.bs.modal', function() {
            $('#persin_id').focus();
        })


    });


    //  click on pagination
  $('#loadPersons').on('click', 'a', function () {
    let data;
    var searchkey;
    if ($('#person-expandedsearch').attr('aria-expanded') === "true") {
      var field = $('#person-searchfield').text();
      var searchfield = field.toLowerCase();
    

        $('#person-searchkey').show();
        $('#person-searchaction').show();

        searchkey = $('#person-searchkey').val();
      
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

    loadrecords_post_final('/person/search', data, 'personstemplate','loadPersons');
  });
  // end of click pagination

});

