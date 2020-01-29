/***********************************************************
** Author:  Jacob Souther and Felicia Ottley
** Date: 3/9/19
************************************************************/

function updateLocation(Id){

  var streetAddressValue = $('#street_address').val();
  var cityValue = $('#city').val();
  var zipValue = $('#zip').val();
  let alertStrings = [];

  if(streetAddressValue === '') {
    alertStrings.push('Please enter a street address!');
  }
  if(cityValue === '') {
    alertStrings.push('Please enter a city!');
  }
  if(zipValue === '') {
    alertStrings.push('Please enter a zip!');
  }

  if(alertStrings.length > 0) {
    alert(alertStrings.join('\n'));
    return;
  }

  $.ajax({
      url: '/location/' + Id,
      type: 'PUT',
      data: $('#update-location').serialize(),
      success: function(result){
          window.location.replace("./");
      }
  })
};