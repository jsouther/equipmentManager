/***********************************************************
** Author:  Jacob Souther and Felicia Ottley
** Date: 3/9/19
************************************************************/

function updateUser(Id){

  var firstNameValue = $('#first_name').val();
  var lastNameValue = $('#last_name').val();
  var jobTitleValue = $('#job_title').val();
  var phoneNumberValue = $('#phone_number').val();
  var emailValue = $('#email').val();  
  let alertStrings = [];

  if(firstNameValue === '') {
    alertStrings.push('Please enter a first name!');
  }
  if(lastNameValue === '') {
    alertStrings.push('Please enter a last name!');
  }
  if(jobTitleValue === '') {
    alertStrings.push('Please enter a job title!');
  }
  if(phoneNumberValue === '') {
    alertStrings.push('Please enter a phone number!');
  }
  if(emailValue === '') {
    alertStrings.push('Please enter an email!');
  }

  if(alertStrings.length > 0) {
    alert(alertStrings.join('\n'));
    return;
  }

  $.ajax({
      url: '/users/' + Id,
      type: 'PUT',
      data: $('#update-user').serialize(),
      success: function(result){
          window.location.replace("./");
      }
  })
};