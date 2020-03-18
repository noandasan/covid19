$(document).ready(function () {
    
    var New=true;
    
    $('#btn-NewPerson').click(function(){
        New=true;
        $('#id').val('');
        $('#title').text('New Person');
        $('#Save').text('Save');
        $('#dialog-newPerson').modal({
            keyboard: false
        });
 
        $('#dialog-newPerson').on('shown.bs.modal', function() {
            $('#id').focus();
         })
    });

    // form validate
    $('#formLocation').validate({
        rules: {
            location: {
                required: true
            },
            latitude: {
              required: true
           },
           longitude: {
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
    $('#formLocation').submit(function (event) {
        event.preventDefault();

        if (New == true) {
                
            let data={
                location: $('#location').val(),
                latitude: $('#latitude').val(),
                longitude: $('#longitude').val()
            }
            if(!data.location || !data.latitude || !data.longitude){
                return;
            }

            $.post('/country/newlocation', data, function (response_json) {
                if (response_json.status == 1) {
                 let data1 = {
                    searchfield: 'location',
                    searchkey: '',
                    page: '1'
                  }

                  loadrecords_post_final('/location/search', data1, 'locationstemplate','loadlocations');
                  $('#dialog-newLocation').modal('toggle');
                  toastr.success('<i class="fas fa-check-circle"></i> Location successfully saved!');
                } else {
                  toastr.error('<i class="fas fa-exclamation-triangle"></i> Already Exist!');
                }
            });
        }else{
                  
           let data={
            location: $('#location').val(),
            latitude: $('#latitude').val(),
            longitude: $('#longitude').val(),
            location_id: id
           }
          if(!data.location || !data.latitude || !data.longitude){
              return;
          }
         
          $.post('/location/editlocation', data, function (response_json) {
            if (response_json.status == 1) {
                
             let data1 = {
                searchfield: 'location',
                searchkey: '',
                page: '1'
              }

              loadrecords_post_final('/location/search', data1, 'locationstemplate','loadlocations');

              $('#dialog-newLocation').modal('toggle');
              toastr.success('<i class="fas fa-check-circle"></i> Location successfully Updated!');
            }
        });
        }

    });


    // Search 
    $('#location-fields').on('click', 'a', function () {
        let data;
        var searchkey;
        var field = this.id;
        $('#location-searchfield').text(this.id);
        var searchfield = field.toLowerCase();
      
          $('#location-searchkey').show();
          searchkey = $('#location-searchkey').val();
    
        data = {
          searchfield: searchfield,
          searchkey: searchkey,
          page: '1'
        }
        $('#location-searchkey').focus();
        loadrecords_post_final('/location/search', data, 'locationtemplate','loadlocations');
      });
    
      $('#location-clear').click(function () {
        $('#location-searchkey').val('');
        $('#location-searchkey').focus();
      });
    
      $('#location-refresh').click(function () {
        $('#location-searchkey').val('');
        data = {
          searchfield: '',
          searchkey: '',
          page: '1'
        }
        
       // loadrecords_post('/country/search', data, 'countriestemplate');
        loadrecords_post_final('/location/search', data, 'locationstemplate','loadlocations');
        $('#location-searchkey').focus();
      });
      
      $('#location-searchkey').keypress(function (e) {
        if (e.which == 13) {
          $('#location-search').trigger('click');
        }
      });

    $('#location-search').click(function(){
        let data = {
            searchfield: $('#location-searchfield').text(),
            searchkey: $('#location-searchkey').val(),
            page: '1'
          }
          $('#location-searchkey').focus();
//          loadrecords_post('/country/search', data, 'countriestemplate');
          loadrecords_post_final('/location/search', data, 'locationstemplate','loadlocations');
    });
    $('body').on('click', '.editlocation', function () {
        New=false;
        id = this.id;
        
        let data = {
            id: id
        }
        $.post('/location/edit', data, function (response_json, status) {
            $('#location').val(response_json.locations[0].location);
            $('#latitude').val(response_json.locations[0].latitude);
            $('#longitude').val(response_json.locations[0].longitude);
        });

        $('#title').text('Edit Location');
        $('#Save').text('Save Changes');


        $('#dialog-newLocation').modal({
            keyboard: false
         });
        
         $('#dialog-newLocation').on('shown.bs.modal', function() {
            $('#location').focus();
        })


    });


    //  click on pagination
  $('#loadlocations').on('click', 'a', function () {
    let data;
    var searchkey;
    if ($('#locations-expandedsearch').attr('aria-expanded') === "true") {
      var field = $('#location-searchfield').text();
      var searchfield = field.toLowerCase();
    

        $('#location-searchkey').show();
        $('#location-searchaction').show();

        searchkey = $('#location-searchkey').val();
      
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

    loadrecords_post_final('/location/search', data, 'locationstemplate','loadlocations');
  });
  // end of click pagination

});

