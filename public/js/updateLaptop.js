/***********************************************************
** Author:  Jacob Souther and Felicia Ottley
** Date: 3/9/19
************************************************************/

function updateLaptop(Id){

  var modelValue = $('#model').val();
  var serialValue = $('#sn').val();
  var cpuValue = $('#cpu').val();
  var ramValue = $('#ram').val();
  let alertStrings = [];

  if(modelValue === '') {
    alertStrings.push('Please enter a model!');
  }
  if(serialValue === '') {
    alertStrings.push('Please enter a serial number!');
  }
  if(cpuValue === '') {
    alertStrings.push('Please enter a cpu!');
  }
  if(ramValue === '') {
    alertStrings.push('Please enter an amount of ram!');
  }

  if(alertStrings.length > 0) {
    alert(alertStrings.join('\n'));
    return;
  }

  $.ajax({
      url: '/laptops/' + Id,
      type: 'PUT',
      data: $('#update-laptop').serialize(),
      success: function(result){
          window.location.replace("./");
      }
  })
};