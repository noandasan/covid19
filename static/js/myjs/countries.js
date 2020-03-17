$(document).ready(function () {
    
    var New=true;
    
    $('#btn-NewCountry').click(function(){
        New=true;
        $('#country').val('');
       
        $('#dialog-newCountry').modal({
            keyboard: false
        });
 
        $('#dialog-newCountry').on('shown.bs.modal', function() {
            $('#country').focus();
         })
    });

    // form validate
    $('#formCountry').validate({
        rules: {
            country: {
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
    $('#formCountry').submit(function (event) {
        event.preventDefault();

        if (New == true) {
                
            let data={
                country: $('#country').val()
            }
            if(!data.country){
                return;
            }

            $.post('/country/newcountry', data, function (response_json) {
                if (response_json.status == 1) {
                    
                 let data1 = {
                    searchfield: 'country',
                    searchkey: '',
                    page: '1'
                  }

                  //loadrecords_post('/country/search', data1, 'countriestemplate');
                  loadrecords_post_final('/country/search', data1, 'countriestemplate','loadcountries');
                  $('#dialog-newCountry').modal('toggle');
                  toastr.success('<i class="fas fa-check-circle"></i> Country successfully saved!');

                } else {

                  toastr.error('<i class="fas fa-exclamation-triangle"></i> Already Exist!');

                }
            });
        }else{
                  
           let data={
              country: $('#country').val(),
              country_id: id
           }
          if(!data.country){
              return;
          }
         
          $.post('/country/editcountry', data, function (response_json) {
            if (response_json.status == 1) {
                
             let data1 = {
                searchfield: 'country',
                searchkey: '',
                page: '1'
              }

              //loadrecords_post('/country/search', data1, 'countriestemplate');
              loadrecords_post_final('/country/search', data, 'countriestemplate','loadcountries');

              $('#dialog-newCountry').modal('toggle');
              toastr.success('<i class="fas fa-check-circle"></i> Country successfully Updated!');
            }
        });
        }

    });

    // Search 
    $('#country-fields').on('click', 'a', function () {
        let data;
        var searchkey;
        var field = this.id;
        $('#country-searchfield').text(this.id);
        var searchfield = field.toLowerCase();
      
          $('#country-searchkey').show();
          searchkey = $('#country-searchkey').val();
    
        data = {
          searchfield: searchfield,
          searchkey: searchkey,
          page: '1'
        }
        $('#country-searchkey').focus();
        //loadrecords_post('/country/search', data, 'countriestemplate');
        loadrecords_post_final('/country/search', data, 'countriestemplate','loadcountries');
      });
    
      $('#country-clear').click(function () {
        $('#country-searchkey').val('');
        $('#country-searchkey').focus();
      });
    
      $('#country-refresh').click(function () {
        $('#country-searchkey').val('');
        data = {
          searchfield: '',
          searchkey: '',
          page: '1'
        }
        
       // loadrecords_post('/country/search', data, 'countriestemplate');
        loadrecords_post_final('/country/search', data, 'countriestemplate','loadcountries');
        $('#country-searchkey').focus();
      });
      
      $('#country-searchkey').keypress(function (e) {
        if (e.which == 13) {
          $('#country-search').trigger('click');
        }
      });

    $('#country-search').click(function(){
        let data = {
            searchfield: $('#country-searchfield').text(),
            searchkey: $('#country-searchkey').val(),
            page: '1'
          }
          $('#country-searchkey').focus();
//          loadrecords_post('/country/search', data, 'countriestemplate');
          loadrecords_post_final('/country/search', data, 'countriestemplate','loadcountries');
    });
    $('body').on('click', '.editcountry', function () {
        New=false;
        id = this.id;
        
        let data = {
            id: id
        }
        $.post('/country/edit', data, function (response_json, status) {
            $('#country').val(response_json.country[0].country);
        });

        $('#title').text('Edit Country');
        $('#Save').text('Save Changes');


        $('#dialog-newCountry').modal({
            keyboard: false
         });
        
         $('#dialog-newCountry').on('shown.bs.modal', function() {
            $('#country').focus();
        })


    });


    //  click on pagination
  $('#loadcountries').on('click', 'a', function () {
    let data;
    var searchkey;
    if ($('#countries-expandedsearch').attr('aria-expanded') === "true") {
      var field = $('#country-searchfield').text();
      var searchfield = field.toLowerCase();
    

        $('#country-searchkey').show();
        $('#country-searchaction').show();

        searchkey = $('#country-searchkey').val();
      
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

    loadrecords_post_final('/country/search', data, 'countriestemplate','loadcountries');
  });
  // end of click pagination

});

