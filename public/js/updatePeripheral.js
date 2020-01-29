/***********************************************************
** Author:  Jacob Souther and Felicia Ottley
** Date: 3/9/19
************************************************************/


function updatePeripheral(Id){

  var makeValue = $('#make').val();
  var modelValue = $('#model').val();
  let alertStrings = [];

  if(makeValue === '') {
    alertStrings.push('Please enter a make!');
  }
  if(modelValue === '') {
    alertStrings.push('Please enter a model!');
  }

  if(alertStrings.length > 0) {
    alert(alertStrings.join('\n'));
    return;
  } 

  $.ajax({
      url: '/peripherals/' + Id,
      type: 'PUT',
      data: $('#update-peripheral').serialize(),
      success: function(result){
          window.location.replace("./");
      }
  })
};