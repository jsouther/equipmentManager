/***********************************************************
** Author:  Jacob Souther and Felicia Ottley
** Date: 3/9/19
************************************************************/

function updateDocument(Id){

  var titleValue = $('#title').val();
  var linkValue = $('#link').val();
  let alertStrings = [];

  if(titleValue === '') {
    alertStrings.push('Please enter a title!');
  }
  if(linkValue === '') {
    alertStrings.push('Please enter a link!');
  }

  if(alertStrings.length > 0) {
    alert(alertStrings.join('\n'));
    return;
  }

  $.ajax({
      url: '/laptop_docs/' + Id,
      type: 'PUT',
      data: $('#update-document').serialize(),
      success: function(result){
          window.location.replace("./");
      }
  })
};