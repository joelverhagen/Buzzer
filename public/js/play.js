$(function() {
  // cache the elements
  var button = $('#buzz-button');
  var output = $('#output');

  // make sure the buzz button is enabled
  button.prop('disabled', false);

  // set up the buzz function
  var buzz = function() {
    if($(button).prop('disabled')) {
      return;
    }
    $(button).prop('disabled', true);
    $.ajax({
      type: 'POST',
      url: '/buzz',
      contentType: 'application/json',
      data: JSON.stringify({name: name})
    }).done(function() {
      $(output).css('color', 'DarkGreen');
      $(output).text('Buzzed!');
    }).fail(function(jqXHR, textStatus, errorThrown) {
      $(output).css('color', 'Red');
      $(output).text('Error: ' + jqXHR.responseText);
    }).always(function() {
       $(output).finish().show().delay(1750).fadeOut(250, function() {
         $(button).prop('disabled', false);
       });
    });
  };

  // set up the handlers
  $(button).click(buzz);
  $(document).keydown(function(e) {
    if(e.which == 32) {
      buzz();
    }
  });
});
  
