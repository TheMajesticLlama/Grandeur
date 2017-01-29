var Game = {
  players: 3,
  finalscore: 15,

  start: function(players, finalscore) {
    document.getElementById('game').style.display = 'block';
    Game.players = players;
    Game.finalscore = finalscore;
    Game.Board.initialize(players);
    Game.PlayerArea.initialize(players);
    Game.Logic.startGame();
  },

  Board: {
    initialize: function(players) {
      //Tiles
      Game.Board.Tile.initialize();
      for (var i = 0; i < players + 1; i++) {
        Game.Board.Tile.create(i);
      }
      //Cards
      Game.Board.Card.initialize();
      for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 5; j++) {
          Game.Board.Card.create(i, j);
        }
      }
      //tokens
      Game.Board.Token.initialize(players);
    },

    Tile: {
      list: [],

      initialize: function() {
        Game.Board.Tile.list = Tools.Array.shuffle(Pieces.Tile);
      },

      create: function(index) {
        var tile = document.createElement('div');
        tile.className = 'tile inline-block';
        tile.id = 'tile' + index;
        tile.score = Game.Board.Tile.list[index].score;
        tile.price = Game.Board.Tile.list[index].price;

        //create score tag
        var score = document.createElement('div');
        score.className = 'tilescore inline-block';
        score.innerHTML = '3';
        tile.appendChild(score);

        //create price tags/markers
        for (var i = 0; i < tile.price.length; i++) {
          if (tile.price[i] != 0) {
            var price = document.createElement('div');
            price.className = 'tileprice inline-block';
            price.innerHTML = tile.price[i];

            //set background-color
            if (i == 0) price.style.backgroundColor = "#BF5454";
            else if (i == 1) price.style.backgroundColor = "#54BF81";
            else if (i == 2) price.style.backgroundColor = "#5486BF";
            else if (i == 3) price.style.backgroundColor = "#D9D9D9";
            else price.style.backgroundColor = "#262626";

            tile.appendChild(price);
          }
        }

        document.getElementById('tiles').appendChild(tile);
        console.log(tile);
      },
    },

    Card: {
      row1: [],
      row1num: 0,
      row2: [],
      row2num: 0,
      row3: [],
      row3num: 0,

      initialize: function() {
        Game.Board.Card.row1 = Tools.Array.shuffle(Pieces.Cards.Row1);
        Game.Board.Card.row2 = Tools.Array.shuffle(Pieces.Cards.Row2);
        Game.Board.Card.row3 = Tools.Array.shuffle(Pieces.Cards.Row3);
      },

      getCard: function(row) {
        var card;
        if (row == 1) {
          card = Game.Board.Card.row1[Game.Board.Card.row1num];
          Game.Board.Card.row1num++;
        } else if (row == 2) {
          card = Game.Board.Card.row2[Game.Board.Card.row2num];
          Game.Board.Card.row2num++;
        } else {
          card = Game.Board.Card.row3[Game.Board.Card.row3num];
          Game.Board.Card.row3num++;
        }
        console.log(row + ", " + Game.Board.Card.row1[0]);
        return card;
      },

      create: function(row, index) {
        var card = document.createElement('div');
        card.style.overflow = 'auto';
        if (index == 0) {
          card.className = 'flipcard inline-block row' + row;

          //card tier indicators
          for (var i = 0; i < row; i++) {
            var tier = document.createElement('div');
            tier.className = 'flipcard-tier inline-block';
            card.appendChild(tier);
          }
        } else {
          card.className = 'card inline-block row' + row;
          card.id = 'row' + row + '_card' + index;
          card.onclick = function() { Game.Logic.buyCard(this);};

          var cardinfo = Game.Board.Card.getCard(row);
          cardinfo.row = row;

          card = Game.Board.Card.createInfo(card, cardinfo);
        }
        document.getElementById('row' + row).appendChild(card);
      },

      createInfo: function(card, info) {
        //clear the current card
        for (var i = card.children.length - 1; i >= 0; i--) {
          card.removeChild(card.children[i]);
        }

        card.info = info;

        //card color and score
        var color_score = document.createElement('div');
        color_score.className = 'color_score inline-block';
        color_score.innerHTML = info.score;
        if (info.color == "RED") color_score.style.backgroundColor = "#BF5454";
        else if (info.color == "GREEN") color_score.style.backgroundColor = "#54BF81";
        else if (info.color == "BLUE") color_score.style.backgroundColor = "#5486BF";
        else if (info.color == "WHITE") color_score.style.backgroundColor = "#D9D9D9";
        else color_score.style.backgroundColor = "#262626";
        card.appendChild(color_score);

        //card price
        for (var i = 0; i < 5; i++) {
          if (info.price[i] != 0) {
            var price = document.createElement('div');
            price.className = 'cardprice inline-block';
            price.innerHTML = info.price[i];

            //set background-color
            if (i == 0) price.style.backgroundColor = "#BF5454";
            else if (i == 1) price.style.backgroundColor = "#54BF81";
            else if (i == 2) price.style.backgroundColor = "#5486BF";
            else if (i == 3) price.style.backgroundColor = "#D9D9D9";
            else price.style.backgroundColor = "#262626";

            card.appendChild(price);
          }
        }

        return card;
      }
    },

    Token: {
      initialize: function(players) {
        var num_of_tokens = 7;
        if (players == 2) num_of_tokens = 4;
        else if (players == 3) num_of_tokens = 5;
        //document.getElementById('token-red').innerHTML = num_of_tokens;
        var paragraph1 = document.createElement('p');
        paragraph1.innerHTML = num_of_tokens;
        var paragraph2 = document.createElement('p');
        paragraph2.innerHTML = 5;

        document.getElementById('token-red').appendChild(paragraph1);
        document.getElementById('token-green').appendChild(paragraph1.cloneNode(true));
        document.getElementById('token-blue').appendChild(paragraph1.cloneNode(true));
        document.getElementById('token-white').appendChild(paragraph1.cloneNode(true));
        document.getElementById('token-black').appendChild(paragraph1.cloneNode(true));
        document.getElementById('token-wild').appendChild(paragraph2);
      }
    }
  },

  PlayerArea: {
    initialize: function(players) {
      //create player area
      for (var i = 0; i < players; i++) {
        var player = document.createElement('div');
        player.className = 'player';
        player.id = 'player_' + (i + 1);
        player.score = 0;
        player.number_tokens = 0;

        var name_score = document.createElement('div');
        name_score.className = 'name_score';
        name_score.style.height = '60px';
        //Player name
        var name = document.createElement('p');
        name.className = 'inline-block';
        name.id = 'player_' + (i + 1) + '_name';
        if (i == 0) {
          name.innerHTML = 'You';
          name.playerName = 'You';
        } else {
          name.innerHTML = 'CPU' + (i);
          name.playerName = 'CPU' + (i);
        }
        name.style.float = 'left';
        name.style.marginLeft = '5px';
        name_score.appendChild(name);

        //Player score
        var score = document.createElement('p');
        score.className = 'inline-block';
        score.innerHTML = player.score;
        score.style.float = 'right';
        score.style.marginRight = '5px';
        name_score.appendChild(score);

        player.appendChild(name_score);

        //tokens
        var tokens = document.createElement('div');
        tokens.textAlign = 'left';
        for (var j = 0; j < 6; j++) {
          var token = document.createElement('div');
          token.className = 'tokensmall inline-block';
          token.id = 'player_' + (i + 1) + '-token-' + j;
          token.number_full = 0;
          token.number_tokens = 0;
          token.number_cards = 0;

          if (j == 0) token.style.border = '2px solid #BF5454';
          else if (j == 1) token.style.border = '2px solid #54BF81';
          else if (j == 2) token.style.border = '2px solid #5486BF';
          else if (j == 3) token.style.border = '2px solid #D9D9D9';
          else if (j == 4) token.style.border = '2px solid #262626';
          else token.style.border = '2px solid #DDE332';

          tokens.appendChild(token);
        }
        player.appendChild(tokens);

        //Cards
        var cards = document.createElement('div');
        for (var j = 0; j < 7; j++) {
          var card = document.createElement('div');
          if (j != 6) card.className = 'cardsmall inline-block text-center';
          else card.className = 'tilesmall inline-block text-center';
          card.id = 'player_' + (i + 1) + '-card-' + j;

          if (j == 0) card.style.border = '2px solid #BF5454';
          else if (j == 1) card.style.border = '2px solid #54BF81';
          else if (j == 2) card.style.border = '2px solid #5486BF';
          else if (j == 3) card.style.border = '2px solid #D9D9D9';
          else if (j == 4) card.style.border = '2px solid #262626';
          else if (j == 5) {
            card.style.border = '2px solid #DDE332';

            if (i == 0) {
              var reserve_area = document.createElement('div');
              reserve_area.id = 'reserve_area';
              reserve_area.style.position = 'absolute';
              reserve_area.style.display = 'none';
              reserve_area.activated = false;

              var title = document.createElement('p');
              title.innerHTML = '<u>Reserved Cards</u>';
              reserve_area.appendChild(title);

              var cards_area = document.createElement('div');
              cards_area.id = 'reserve_area_cards';
              reserve_area.appendChild(cards_area);

              document.getElementById('game').appendChild(reserve_area);
            }
          } else card.style.border = '2px solid BLACK';

          cards.appendChild(card);
        }
        player.appendChild(cards);

        document.getElementById('players_list').appendChild(player);
      }
    },
  },

  Moves: {
    create: function(player_num, card, reserve, tokens) {
      var move = document.createElement('div');
      move.className = 'move';

      //Player name
      var name = document.createElement('p');
      name.innerHTML = document.getElementById('players_list').children[player_num].firstChild.firstChild.playerName;
      move.appendChild(name);

      //Content area
      var content = document.createElement('div');
      move.appendChild(content);

      //If player is human, add check mark to content area
      if (player_num == 0) {
        var check = document.createElement('p');
        check.id = 'checkmark';
        check.className = 'inline-block check';
        check.innerHTML = '&#10003';
        check.onclick = function() {Game.Moves.confirmMove();};
        content.appendChild(check);
      }

      if (document.getElementById('moves').children.length <= 1) document.getElementById('moves').appendChild(move);
      else document.getElementById('moves').insertBefore(move, document.getElementById('moves').children[1]);

      Game.Moves.deleteLast();
    },

    edit_add: function(child, token, reserve_token, reserve_card, reserve_buy, card) {
      if (token != null) {
        var newtoken = document.createElement('div');
        newtoken.className = 'token inline-block';
        newtoken.style.backgroundColor = token;
        newtoken.onclick = function() { Game.Moves.edit_remove(this, 'token');};
        document.getElementById('moves').children[(child + 1)].lastChild.appendChild(newtoken);
        document.getElementById('moves').children[(child + 1)].moveType = 'token';
      } else if (reserve_token != null) {
        var newtoken = document.createElement('div');
        newtoken.id = 'reserve_token';
        newtoken.className = 'token inline-block';
        newtoken.style.backgroundColor = reserve_token;
        newtoken.style.verticalAlign = 'top';
        newtoken.onclick = function() {Game.Moves.edit_remove(this, 'reserve');};
        document.getElementById('moves').children[(child + 1)].lastChild.appendChild(newtoken);
        document.getElementById('moves').children[(child + 1)].moveType = 'reserve';
      } else if (reserve_card != null) {
        console.log("HI");
        var newcard = reserve_card.cloneNode(true);
        newcard.id = 'reserve_card';
        newcard.info = reserve_card.info;
        newcard.className = newcard.className + ' text-center cardmove';
        newcard.onclick = function() {Game.Moves.edit_remove(this, 'reserve');};
        document.getElementById('moves').children[(child + 1)].lastChild.appendChild(newcard);
      } else if (reserve_buy != null) {
        var newcard = reserve_buy.cloneNode(true);
        newcard.id = 'reserve_buy';
        newcard.info = reserve_buy.info;
        newcard.className = newcard.className + ' text-center cardmove';
        newcard.onclick = function() {Game.Moves.edit_remove(this, 'reserve_buy');};
        document.getElementById('moves').children[(child + 1)].lastChild.appendChild(newcard);
        document.getElementById('moves').children[(child + 1)].moveType = 'reserve_buy';
      } else if (card != null) {
        var newcard = card.cloneNode(true);
        newcard.id = '';
        newcard.info = card.info;
        newcard.className = newcard.className + ' text-center cardmove';
        newcard.onclick = function() {Game.Moves.edit_remove(this, 'card');};
        document.getElementById('moves').children[(child + 1)].lastChild.appendChild(newcard);
        document.getElementById('moves').children[(child + 1)].moveType = 'card';
      }
    },

    edit_remove: function(object, type) {
      if (Game.Logic.current_player_num == 0) {
        if (type == 'token') {
          var color;
          if (object.style.backgroundColor == 'rgb(191, 84, 84)') color = 'red';
          else if (object.style.backgroundColor == 'rgb(84, 191, 129)') color = 'green';
          else if (object.style.backgroundColor == 'rgb(84, 134, 191)') color = 'blue';
          else if (object.style.backgroundColor == 'rgb(217, 217, 217)') color = 'white';
          else if (object.style.backgroundColor == 'rgb(38, 38, 38)') color = 'black';
          else color = 'wild';

          //Game logic removal of token
          Game.Logic.removeToken(color);

          if (Game.Logic.num_tokens_total == 0) {
            document.getElementById('moves').children[1].moveType = 'none';
          }

          //physical removal of token
          object.parentNode.removeChild(object);
        } else if (type == 'card') {
          Game.Logic.card_buying_enabled = true;
          Game.Logic.token_buying_enabled = true;
          Game.Logic.wild_card_reserving_enabled = true;
          Game.Logic.wild_token_buying_enabled = true;
          Game.Logic.wild_card_buying_enabled = true;

          document.getElementById('moves').children[1].moveType = 'none';

          object.parentNode.removeChild(object);
        } else if (type == 'reserve') {
          Game.Logic.card_buying_enabled = true;
          Game.Logic.token_buying_enabled = true;
          Game.Logic.wild_card_reserving_enabled = false;
          Game.Logic.wild_token_buying_enabled = true;
          Game.Logic.wild_card_buying_enabled = true;

          var token = document.getElementById('reserve_token');
          var card = document.getElementById('reserve_card');

          if (token != null) token.parentNode.removeChild(token);
          if (card != null) card.parentNode.removeChild(card);

          document.getElementById('moves').children[1].moveType = '';

          Game.Logic.removeWild();
        } else if (type == 'reserve_buy') {
          Game.Logic.card_buying_enabled = true;
          Game.Logic.token_buying_enabled = true;
          Game.Logic.wild_card_reserving_enabled = false;
          Game.Logic.wild_token_buying_enabled = true;
          Game.Logic.wild_card_buying_enabled = true;

          document.getElementById('moves').children[1].moveType = 'none';

          object.parentNode.removeChild(object);
        }
      }
    },

    deleteLast: function() {
      while (document.getElementById('moves').children.length > Game.players + 1) {
        document.getElementById('moves').removeChild(document.getElementById('moves').lastChild);
      }
    },

    confirmMove: function() {
      if (document.getElementById('moves').children[1].moveType == 'token') {
        var threshold = 1;
        if (Game.Logic.current_player_num == 0) threshold = 2;

        if (document.getElementById('moves').children[1].lastChild.childNodes.length >= threshold) {
          //reset logic code if player is human
          Game.Logic.card_buying_enabled = true;
          Game.Logic.token_buying_enabled = true;
          Game.Logic.wild_card_reserving_enabled = true;
          Game.Logic.wild_token_buying_enabled = true;
          Game.Logic.wild_card_buying_enabled = true;
          Game.Logic.num_tokens_total = 0;
          Game.Logic.num_tokens[0] = 0;
          Game.Logic.num_tokens[1] = 0;
          Game.Logic.num_tokens[2] = 0;
          Game.Logic.num_tokens[3] = 0;
          Game.Logic.num_tokens[4] = 0;
          Game.Logic.num_tokens[5] = 0;

          //loop through each childNodes
          for (var i = document.getElementById('moves').children[1].lastChild.childNodes.length - 1; i >= 0; i--) {
            var element = document.getElementById('moves').children[1].lastChild.childNodes[i];

            //Player check-mark
            if (element.className.includes('check')) element.parentNode.removeChild(element);

            //tokens
            if (element.className.includes('token')) {
              //get color/token number
              var token_num;
              if (element.style.backgroundColor == 'rgb(191, 84, 84)') token_num = 0;
              else if (element.style.backgroundColor == 'rgb(84, 191, 129)') token_num = 1;
              else if (element.style.backgroundColor == 'rgb(84, 134, 191)') token_num = 2;
              else if (element.style.backgroundColor == 'rgb(217, 217, 217)') token_num = 3;
              else if (element.style.backgroundColor == 'rgb(38, 38, 38)') token_num = 4;
              else token_num = 5;

              var player_token = document.getElementById('player_' + (current_player_num + 1) + '-token-' + token_num);
              player_token.number_full++;
              player_token.number_tokens++;
              player_token.innerHTML = player_token.number_tokens;
              player_token.style.backgroundColor = player_token.style.borderColor;

              document.getElementById('player_' + (current_player_num + 1)).number_tokens++;
            }
          }

          Game.Logic.changeTurn();
        }
      } else if (document.getElementById('moves').children[1].moveType == 'card' || document.getElementById('moves').children[1].moveType == 'reserve_buy') {
        var move = document.getElementById('moves').children[1];
        var card = move.lastChild.children[move.lastChild.children.length - 1];

        //Get card number based on color
        var card_num = 5;
        if (card.info.color == 'RED') card_num = 0;
        else if (card.info.color == 'GREEN') card_num = 1;
        else if (card.info.color == 'BLUE') card_num = 2;
        else if (card.info.color == 'WHITE') card_num = 3;
        else if (card.info.color == 'BLACK') card_num = 4;

        //Add the card to the player area
        var player_card = document.getElementById('player_' + (current_player_num + 1) + '-card-' + card_num);
        var player_token = document.getElementById('player_' + (current_player_num + 1) + '-token-' + card_num);
        player_token.number_full++;
        player_token.number_cards++;
        player_card.innerHTML = player_token.number_cards;
        player_card.style.backgroundColor = player_card.style.borderColor;

        //If necessary, remove tokens from the player
        var price = Game.Logic.card_price;
        if (document.getElementById('moves').children[1].moveType == 'reserve_buy') price = Game.Logic.wild_card_buying_price;
        for (var i = 0; i < 6; i++) {
          var player_token = document.getElementById('player_' + (current_player_num + 1) + '-token-' + i);
          player_token.number_tokens -= price[i];
          player_token.number_full -= price[i];
          if (player_token.number_tokens == 0) {
            player_token.innerHTML = '';
            player_token.style.backgroundColor = 'transparent';
          } else {
            player_token.innerHTML = player_token.number_tokens;
          }

          document.getElementById('player_1').number_tokens -= price[i];

          //Add the tokens back into the pile
          var pile_token = document.getElementById('tokens').children[i];
          pile_token.firstChild.innerHTML = parseInt(pile_token.firstChild.innerHTML) + price[i];
        }

        Game.Logic.card_buying_enabled = true;
        Game.Logic.token_buying_enabled = true;
        Game.Logic.wild_card_reserving_enabled = true;
        Game.Logic.wild_token_buying_enabled = true;
        Game.Logic.wild_card_buying_enabled = true;
        document.getElementById('checkmark').parentNode.remove(document.getElementById('checkmark'));

        if (document.getElementById('moves').children[1].moveType == 'card') {
          //replace old card in board with new card
          var info = Game.Board.Card.getCard(card.info.row);
          info.row = card.info.row;
          var board_card = document.getElementById(Game.Logic.card_id);
          Game.Board.Card.createInfo(board_card, info);
        } else {
          var reserve_area_cards = document.getElementById('reserve_area_cards');
          var child = reserve_area_cards.childNodes[Game.Logic.wild_card_buying_index];
          reserve_area_cards.removeChild(child);
          var wild_card = document.getElementById('player_1-card-5');
          var wild_token = document.getElementById('player_1-token-5');
          wild_token.number_cards--;
          wild_card.innerHTML = wild_token.number_cards;
          if (wild_token.number_cards == 0) {
            wild_card.style.backgroundColor = 'transparent';
            wild_card.innerHTML = '';
            wild_card.style.cursor = 'default';
            wild_card.onclick = function() {};
          }
        }

        Game.Logic.changeTurn();
      } else if (document.getElementById('moves').children[1].moveType == 'reserve') {
        var move = document.getElementById('moves').children[1];
        if (move.lastChild.children.length == 3) {
          var card = move.lastChild.children[move.lastChild.children.length - 1];

          //Add the card to the player area
          var player_card = document.getElementById('player_' + (current_player_num + 1) + '-card-' + 5);
          var player_token = document.getElementById('player_' + (current_player_num + 1) + '-token-' + 5);
          player_token.number_cards++;
          player_token.number_tokens++;
          player_token.innerHTML = player_token.number_tokens;
          player_token.style.backgroundColor = player_token.style.borderColor;
          player_card.innerHTML = player_token.number_cards;
          player_card.style.backgroundColor = player_card.style.borderColor;
          player_card.style.cursor = 'pointer';

          player_card.onclick = function(e) {
            var ra = document.getElementById('reserve_area');

            if (ra.activated) {
              ra.activated = false;
              ra.style.display = 'none';
            } else {
              var wild_card_rect = document.getElementById('player_1-card-5').getBoundingClientRect();
              ra.style.display = 'block';
              ra.style.left = (wild_card_rect.right - ra.offsetWidth) + 'px';
              ra.style.top = wild_card_rect.bottom + 5 + 'px';
              ra.activated = true;

              window.addEventListener('click', function(e) {
                var reserve_area = document.getElementById('reserve_area');
                if (reserve_area.activated) {
                  if (reserve_area.contains(e.target)){
                  } else if (document.getElementById('player_1-card-5').contains(e.target)) {
                  } else {
                    reserve_area.activated = false;
                    reserve_area.style.display = 'none';
                  }
                }
              });
            }
          };

          var card_clone = card.cloneNode(true);
          card_clone.onclick = function() {Game.Logic.buyWildCard(this);};
          card_clone.info = card.info;
          document.getElementById('reserve_area_cards').appendChild(card_clone);

          Game.Logic.card_buying_enabled = true;
          Game.Logic.token_buying_enabled = true;
          Game.Logic.wild_card_reserving_enabled = true;
          Game.Logic.wild_token_buying_enabled = true;
          Game.Logic.wild_card_buying_enabled = true;
          document.getElementById('checkmark').parentNode.remove(document.getElementById('checkmark'));

          //replace old card in board with new card
          var info = Game.Board.Card.getCard(card.info.row);
          info.row = card.info.row;
          var board_card = document.getElementById(Game.Logic.wild_card_id);
          Game.Board.Card.createInfo(board_card, info);

          document.getElementById('player_1').number_tokens++;

          Game.Logic.changeTurn();
        }
      }
    },
  },

  Logic: {
    current_player_num: 0,

    startGame: function() {
      Game.Logic.chooseStartingPlayer();
    },

    chooseStartingPlayer: function() {
      current_player_num = 0;
      Game.Logic.changeTurn(Game.Logic.current_player_num);
    },

    changeTurn: function(num) {
      if (num == undefined) {
        if (Game.Logic.current_player_num < (Game.players - 1)) Game.Logic.current_player_num++;
        else Game.Logic.current_player_num = 0;
      }
      //Remove turn indicator from last player
      for (var i = 1; i < Game.players + 1; i++) {
        var player = document.getElementById('player_' + i + '_name');
        if (i == Game.Logic.current_player_num + 1) {
          player.innerHTML = '&#9654 ' + player.playerName;
        } else {
          player.innerHTML = player.playerName;
        }
      }

      //execure turn
      Game.Logic.executeTurn(Game.Logic.current_player_num);
    },

    executeTurn: function(num) {
      console.log('num: ' + num);
      if (num == 0) Game.Moves.create(0);
      else {
        Game.Moves.create(num);
        Game.Logic.changeTurn();
      }
    },

    token_buying_enabled: true,
    num_tokens_total: 0,
    num_tokens: [0, 0, 0, 0, 0, 0],

    buyToken: function(token) {
      if (Game.Logic.current_player_num == 0) {
        if (parseInt(token.firstChild.innerHTML) > 0) {
          var buyable_tokens = 10 - document.getElementById('player_1').number_tokens;
          if (Game.Logic.num_tokens_total >= buyable_tokens) return;
          //get color of the token
          var isBuying = false;
          if (Game.Logic.token_buying_enabled) {
            var color_code = token.style.backgroundColor;
            var color_name = token.id.split('-')[1];
            if (color_name == 'red') {
              if (Game.Logic.num_tokens[0] == 0  && Game.Logic.num_tokens_total < 3) {
                Game.Logic.num_tokens[0]++;
                Game.Logic.num_tokens_total++;
                isBuying = true;
              } else if (Game.Logic.num_tokens[0] == 1 && Game.Logic.num_tokens_total == 1) {
                if (parseInt(token.firstChild.innerHTML) >= 3) {
                  Game.Logic.num_tokens[0]++;
                  Game.Logic.num_tokens_total++;
                  Game.Logic.token_buying_enabled = false;
                  isBuying = true;
                }
              }
              if (Game.Logic.num_tiles == 3) Game.Logic.token_buying_enabled = false;
            } else if (color_name == 'green') {
              if (Game.Logic.num_tokens[1] == 0  && Game.Logic.num_tokens_total < 3) {
                Game.Logic.num_tokens[1]++;
                Game.Logic.num_tokens_total++;
                isBuying = true;
              } else if (Game.Logic.num_tokens[1] == 1 && Game.Logic.num_tokens_total == 1) {
                if (parseInt(token.firstChild.innerHTML) >= 3) {
                  Game.Logic.num_tokens[1]++;
                  Game.Logic.num_tokens_total++;
                  Game.Logic.token_buying_enabled = false;
                  isBuying = true;
                }
              }
              if (Game.Logic.num_tiles == 3) Game.Logic.token_buying_enabled = false;
            } else if (color_name == 'blue') {
              if (Game.Logic.num_tokens[2] == 0  && Game.Logic.num_tokens_total < 3) {
                Game.Logic.num_tokens[2]++;
                Game.Logic.num_tokens_total++;
                isBuying = true;
              } else if (Game.Logic.num_tokens[2] == 1 && Game.Logic.num_tokens_total == 1) {
                if (parseInt(token.firstChild.innerHTML) >= 3) {
                  Game.Logic.num_tokens[2]++;
                  Game.Logic.num_tokens_total++;
                  Game.Logic.token_buying_enabled = false;
                  isBuying = true;
                }
              }
              if (Game.Logic.num_tiles == 3) Game.Logic.token_buying_enabled = false;
            } else if (color_name == 'white') {
              if (Game.Logic.num_tokens[3] == 0  && Game.Logic.num_tokens_total < 3) {
                Game.Logic.num_tokens[3]++;
                Game.Logic.num_tokens_total++;
                isBuying = true;
              } else if (Game.Logic.num_tokens[3] == 1 && Game.Logic.num_tokens_total == 1) {
                if (parseInt(token.firstChild.innerHTML) >= 3) {
                  Game.Logic.num_tokens[3]++;
                  Game.Logic.num_tokens_total++;
                  Game.Logic.token_buying_enabled = false;
                  isBuying = true;
                }
              }
              if (Game.Logic.num_tiles == 3) Game.Logic.token_buying_enabled = false;
            } else if (color_name == 'black') {
              if (Game.Logic.num_tokens[4] == 0  && Game.Logic.num_tokens_total < 3) {
                Game.Logic.num_tokens[4]++;
                Game.Logic.num_tokens_total++;
                isBuying = true;
              } else if (Game.Logic.num_tokens[4] == 1 && Game.Logic.num_tokens_total == 1) {
                if (parseInt(token.firstChild.innerHTML) >= 3) {
                  Game.Logic.num_tokens[4]++;
                  Game.Logic.num_tokens_total++;
                  Game.Logic.token_buying_enabled = false;
                  isBuying = true;
                }
              }
              if (Game.Logic.num_tiles == 3) Game.Logic.token_buying_enabled = false;
            } else {

            }

            //buy card
            if (isBuying) {
              token.firstChild.innerHTML = parseInt(token.firstChild.innerHTML) - 1;
              Game.Moves.edit_add(0, color_code, null, null, null, null);
              Game.Logic.card_buying_enabled = false;
              Game.Logic.wild_card_reserving_enabled = false;
              Game.Logic.wild_token_buying_enabled = false;
              Game.Logic.wild_card_buying_enabled = false;
            }
          }
        }
      }
    },

    removeToken(color) {
      Game.Logic.num_tokens_total--;
      console.log(Game.Logic.num_tokens_total);
      if (color == 'red') {
        Game.Logic.num_tokens[0]--;
        document.getElementById('token-red').firstChild.innerHTML = parseInt(document.getElementById('token-red').firstChild.innerHTML) + 1;
      } else if (color == 'green') {
        Game.Logic.num_tokens[1]--;
        document.getElementById('token-green').firstChild.innerHTML = parseInt(document.getElementById('token-green').firstChild.innerHTML) + 1;
      } else if (color == 'blue') {
        Game.Logic.num_tokens[2]--;
        document.getElementById('token-blue').firstChild.innerHTML = parseInt(document.getElementById('token-blue').firstChild.innerHTML) + 1;
      } else if (color == 'white') {
        Game.Logic.num_tokens[3]--;
        document.getElementById('token-white').firstChild.innerHTML = parseInt(document.getElementById('token-white').firstChild.innerHTML) + 1;
      } else if (color == 'black') {
        Game.Logic.num_tokens[4]--;
        document.getElementById('token-black').firstChild.innerHTML = parseInt(document.getElementById('token-black').firstChild.innerHTML) + 1;
      } else if (color == 'wild') {
        Game.Logic.num_tokens[5]--;
        document.getElementById('token-wild').firstChild.innerHTML = parseInt(document.getElementById('token-wild').firstChild.innerHTML) + 1;
      }

      Game.Logic.token_buying_enabled = true;

      if (Game.Logic.num_tokens_total == 0) {
        Game.Logic.card_buying_enabled = true;
        Game.Logic.wild_card_reserving_enabled = false;
        Game.Logic.wild_token_buying_enabled = true;
        Game.Logic.wild_card_buying_enabled = true;
      }
    },

    card_buying_enabled: true,
    card_price: [],
    card_id: '',

    buyCard(card) {
      if (document.getElementById('moves').children[1].moveType == 'reserve' && Game.Logic.wild_card_reserving_enabled) {
        Game.Logic.reserveWildCard(card);
        return;
      }

      if (Game.Logic.card_buying_enabled && Game.Logic.current_player_num == 0) {
        Game.Logic.card_price = [0, 0, 0, 0, 0, 0];
        var canBuy = true;
        for (var i = 0; i < 5; i++) {
          var player_token = document.getElementById('player_' + (current_player_num + 1) + '-token-' + i);
          if (player_token.number_full >= card.info.price[i]) {
            Game.Logic.card_price[i] = card.info.price[i] - player_token.number_cards;
            if (Game.Logic.card_price[i] < 0) Game.Logic.card_price[i] = 0;
          } else {
            var number_wilds = document.getElementById('player_1-token-5').number_tokens - Game.Logic.card_price[5];
            if (player_token.number_full + number_wilds >= card.info.price[i]) {
                Game.Logic.card_price[i] = player_token.number_tokens;
                Game.Logic.card_price[5] += card.info.price[i] - player_token.number_full;
            } else {
                canBuy = false;
            }
          }
        }

        if (canBuy) {
          console.log('You can buy the card! Yay!');
          Game.Logic.token_buying_enabled = false;
          Game.Logic.card_buying_enabled = false;
          Game.Logic.wild_card_reserving_enabled = false;
          Game.Logic.wild_token_buying_enabled = false;
          Game.Logic.wild_card_buying_enabled = false;
          Game.Logic.card_id = card.id;
          Game.Moves.edit_add(0, null, null, null, null, card);
        } else console.log('Oh no! You can\'t buy the card! Better luck next time...');
      }
    },

    wild_card_reserving_enabled: false,
    wild_token_buying_enabled: true,
    wild_card_id: '',

    buyWildToken(token) {
      if (Game.Logic.wild_token_buying_enabled && Game.Logic.current_player_num == 0) {
        if (document.getElementById('player_1-token-5').number_tokens >= 3) return;
        if (document.getElementById('player_1').number_tokens >= 10) return;

        token.firstChild.innerHTML = parseInt(token.firstChild.innerHTML) - 1;

        Game.Logic.wild_card_reserving_enabled = true;
        Game.Logic.wild_token_buying_enabled = false;
        Game.Logic.wild_card_buying_enabled = false;
        Game.Logic.card_buying_enabled = false;
        Game.Logic.token_buying_enabled = false;
        Game.Moves.edit_add(0, null, token.style.backgroundColor, null, null, null);
      }
    },

    reserveWildCard(card) {
      Game.Logic.wild_card_id = card.id;
      console.log(Game.Logic.wild_card_id);

      Game.Logic.wild_card_reserving_enabled = false;
      Game.Logic.wild_token_buying_enabled = false;
      Game.Logic.wild_card_buying_enabled = false;
      Game.Logic.card_buying_enabled = false;
      Game.Logic.token_buying_enabled = false;
      Game.Moves.edit_add(0, null, null, card, null, null);
    },

    removeWild() {
      document.getElementById('token-wild').firstChild.innerHTML = parseInt(document.getElementById('token-wild').firstChild.innerHTML) + 1;
    },

    wild_card_buying_enabled: true,
    wild_card_buying_price: [],
    wild_card_buying_index: 0,

    buyWildCard(card) {
      if (Game.Logic.wild_card_buying_enabled && Game.Logic.current_player_num == 0) {
        Game.Logic.wild_card_buying_price = [0, 0, 0, 0, 0, 0];
        var canBuy = true;
        for (var i = 0; i < 5; i++) {
          var player_token = document.getElementById('player_' + (current_player_num + 1) + '-token-' + i);
          if (player_token.number_full >= card.info.price[i]) {
            Game.Logic.wild_card_buying_price[i] = card.info.price[i] - player_token.number_cards;
            if (Game.Logic.wild_card_buying_price[i] < 0) Game.Logic.wild_card_buying_price[i] = 0;
          } else {
            var number_wilds = document.getElementById('player_1-token-5').number_tokens - Game.Logic.wild_card_buying_price[5];
            if (player_token.number_full + number_wilds >= card.info.price[i]) {
                Game.Logic.wild_card_buying_price[i] = player_token.number_tokens;
                Game.Logic.wild_card_buying_price[5] += card.info.price[i] - player_token.number_full;
            } else {
                canBuy = false;
            }
          }
        }

        if (canBuy) {
          console.log('You can buy the card! Yay!');
          Game.Logic.token_buying_enabled = false;
          Game.Logic.card_buying_enabled = false;
          Game.Logic.wild_card_reserving_enabled = false;
          Game.Logic.wild_token_buying_enabled = false;
          Game.Logic.wild_card_buying_enabled = false;
          var index = 0, newcard = card;
          while((newcard = newcard.previousSibling) != null) index++;
          Game.Logic.wild_card_buying_index = index;
          Game.Moves.edit_add(0, null, null, null, card, null);
        } else console.log('Oh no! You can\'t buy the card! Better luck next time...');
      }
    },
  }
};
