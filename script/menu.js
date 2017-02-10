var Menu = {
  players: 2,
  finalscore: 15,

  startGame: function() {
    document.getElementById('menu').style.display = 'none';
    Game.start(Menu.players, Menu.finalscore);
  }
};
