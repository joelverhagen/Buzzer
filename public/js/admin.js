$(function() {
  // cache elements
  var buzz_container = $('#buzzes');
  var player_container = $('#players');

  // possible scores
  var scores = [-1000, -800, -600, -400, -200, 200, 400, 600, 800, 1000];

  // keep track of buzzes so far
  var buzz_players = {};
  var buzz_order = [];

  // set up the clear button
  $('#clear-buzzes').click(function() {
    buzz_players = {};
    buzz_order = [];
    $(buzz_container).empty();
  });

  // set up socket.io
  var socket = io.connect(document.location.protocol + '//' + document.location.host);

  socket.on('players', function(players) {
    player_container.empty();
    for(var name in players) {
      // add the row
      var player = players[name];
      var score = player.score;
      var buzzes = player.buzzes;
      player_container.append([
        '<tr>',
          '<td></td>',
          '<td>' + name + '</td>',
          '<td>' + score + '</td>',
          '<td>' + buzzes + '</td>',
          '<td></td>',
        '</tr>'].join(''));
      var row = player_container.find('tr:last');
      var first_cell = row.find('td:first');
      var last_cell = row.find('td:last');

      // add the delete button
      var delete_button = $('<button>X</button>');
      (function(data) {
        $(first_cell).append(delete_button);
        first_cell.click(function() {
          socket.emit('delete', data);
        });
      })({name: name});

      // add the score buttons
      for(var i in scores) {
        (function(data) {
          var button = $('<button>' + data.score + '</button>');
          $(last_cell).append(button);
          $(button).click(function() {
            socket.emit('score', data);
          });
        })({
         name: name,
         score: scores[i]
        });
      }
    }
  });

  socket.on('buzz', function(player) {
    // refresh the model
    if(!(player.name in buzz_players)) {
      buzz_order.push(player.name);
    }
    buzz_players[player.name] = null;

    // refresh the view
    buzz_container.empty();
    for(var i in buzz_order) {
      var name = buzz_order[i];
      $(buzz_container).append('<li>' + name + '</li>');
    }
  });
})
