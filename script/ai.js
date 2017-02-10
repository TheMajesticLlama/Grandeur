var AI = {
  Players: {
    list: [],

    Player: function(id) {
      this.id = id;

      //modifiers
      this.nobles = Tools.Random.range(7, 13);
      this.reserve = Tools.Random.range(4, 11);
      this.buy = Tools.Random.range(7, 13);

      //resources
      this.tokens = [0, 0, 0, 0, 0, 0];
      this.tokens_total = 0;
      this.cards = [0, 0, 0, 0, 0];
      this.score = 0;
      this.reserved_cards = [];
      this.nobles = 0;

      //variables
      this.token_buying_enabled = true;
      this.reserve_buying_enabled = true;

      //memory
      this.lastCard = null;

      this.takeTurn = function() {
        if (this.tokens_total == 10) this.token_buying_enabled = false;
        else this.token_buying_enabled = true;

        if (this.lastCard != null) {
          if (AI.Logic.canBuyCard(this.lastCard[1], this.tokens, this.cards)) {
            AI.Moves.card(this.id, this.lastCard[1]);
            this.lastCard = null;
            return;
          }
        }

        var moves = AI.Logic.getMoves(this.tokens, this.cards, this.reserved_cards);
        var card = AI.Logic.rankAndChooseCard(moves, this.nobles, this.reserve, this.buy, this.tokens, this.cards, this.token_buying_enabled, this.reserved_cards, this.lastCard);
        this.lastCard = card;
        if (card[3] == 'token') {
          var max_tokens = 10 - this.tokens_total;

          var price = AI.Logic.getCardTotalPrice(card[1], this.tokens, this.cards);

          var num_colors = 0;
          var buy = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]];
          for (var i = 0; i < 5; i++) {
            if (price[i] > 0) num_colors++;
            if (parseInt(document.getElementById('tokens').children[i].innerHTML) > 0) {
              if (price[i] == 0) buy[i][1] = 0.5;
              else buy[i][1] = price[i];
            }
          }

          //sort array
          buy = Tools.Array.shuffle(buy);
          var temp = 0;
          for (var i = 0; i < buy.length; i++) {
            for (var j = 0; j < buy.length - 1; j++) {
              if (buy[j][1] > buy[j + 1][1]) {
                temp = buy[j + 1];
                buy[j + 1] = buy[j];
                buy[j] = temp;
              }
            }
          }

          if (num_colors > 1) {
            var buy_official = [0, 0, 0, 0, 0];
            for (var i = 0; i < 3; i++) {
              if (parseInt(document.getElementById('tokens').children[buy[i][0]].firstChild.innerHTML) > 0) {
                if ((i + 1) > max_tokens) break;
                buy_official[buy[i][0]] = 1;
              }
            }
            AI.Moves.token(this.id, buy_official);
          } else {
            var buy_official = [0, 0, 0, 0, 0];
            if (buy[0][1] >= 2 && parseInt(document.getElementById('tokens').children[buy[0][0]].firstChild.innerHTML) >= 4) {
              for (var i = 0; i < 2; i++) {
                if ((i + 1) > max_tokens) break;
                buy_official[buy[0][0]]++;
              }
            } else {
              for (var i = 0; i < 3; i++) {
                if (parseInt(document.getElementById('tokens').children[buy[i][0]].firstChild.innerHTML) > 0) {
                  if ((i + 1) > max_tokens) break;
                  buy_official[buy[i][0]] = 1;
                }
              }
            }
            AI.Moves.token(this.id, buy_official);
          }
        } else if (card[3] == 'reserve') {

        } else if (card[3] == 'buy') {
          if (card[0] == 'reserve') {

          } else {
            AI.Moves.card(this.id, card[1]);
            this.lastCard = null;
          }
        }
      };
    },

    initialize: function() {
      for (var i = 0; i < Game.players - 1; i++) {
        var player = new AI.Players.Player(i);
        AI.Players.list.push(player);
      }
    }
  },

  Logic: {
    getMoves: function(tokens, cards, reserved_cards) {
      var moves = [];

      //cards
      for (var i = 1; i < 4; i++) {
        for (var j = 1; j < 5; j++) {
          var move = ['card'];
          var card = document.getElementById('row' + i + '_card' + j);
          move.push(card);
          if (AI.Logic.canBuyCard(card, tokens, cards)) move.push(true);
          else move.push(false);
          moves.push(move);
        }
      }

      //reserved
      for (var i = 0; i < reserved_cards.length; i++) {
        var move = ['reserve'];
        move.push(reserved_cards[i]);
        if (AI.Logic.canBuyCard(reserved_cards[i], tokens, cards)) move.push(true);
        else move.push(false);
      }

      return moves;
    },

    canBuyCard: function(buy_card, tokens, cards) {
      var canBuy = true;
      var number_wilds = tokens[5];
      for (var i = 0; i < 5; i++) {
        var number_full = tokens[i] + cards[i];
        if (number_full < buy_card.info.price[i]) {
          if (number_full + number_wilds >= buy_card.info.price[i]) {
            number_wilds -= buy_card.info.price[i] - number_full;
          } else {
            canBuy = false;
          }
        }
      }

      return canBuy;
    },

    rankAndChooseCard: function(moves, nobles, reserve, buy, tokens, cards, token_buying_enabled, reserve_buying_enabled, lastCard) {
      for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        var card = move[1];

        var type = '';
        var rank = 0;

        if (token_buying_enabled) {
          var buy_rank = 0;
          var token_rank = 0;
          if (move[2]) {
            var buy_mod = buy/10;
            var card_value = AI.Logic.getCardValue(card, nobles);
            buy_rank = card_value * buy_mod * (Tools.Random.range(17, 25) / 10);
          } else {
            var card_value = AI.Logic.getCardValue(card, nobles);
            var total_cost = card.info.price[0] + card.info.price[1] + card.info.price[2] + card.info.price[3] + card.info.price[4];
            var price_array = AI.Logic.getCardTotalPrice(card, tokens, cards);
            var price = price_array[0] + price_array[1] + price_array[2] + price_array[3] + price_array[4] + price_array[5] - 4;
            var cost = (total_cost - price)/total_cost;
            token_rank = card_value * cost * (Tools.Random.range(9, 14) / 10);
          }

          var reserve_rank = 0;
          if (reserve_buying_enabled && document.getElementById('token-wild').firstChild.innerHTML > 0) {
            var reserve_mod = reserve/10;
            var card_value = AI.Logic.getCardValue(card, nobles);
            reserve_rank = card_value * reserve_mod * (Tools.Random.range(8, 12) / 10);
          }

          if (buy_rank >= token_rank && buy_rank >= reserve_rank) {
            type = 'buy';
            rank = buy_rank;
          } else if (reserve_rank >= buy_rank && reserve_rank >= token_rank) {
            type = 'reserve';
            rank = reserve_rank;
          } else {
            type = 'token';
            rank = token_rank;
          }
        } else {
          if (move[2]) {
            var buy_mod = buy/10;
            var card_value = AI.Logic.getCardValue(card, nobles);
            type = 'buy';
            rank = card_value * buy_mod * (Tools.Random.range(8, 12) / 10);
          } else {
            type = 'pass';
            rank = 0;
          }
        }

        move.push(type);
        move.push(rank);
      }

      if (lastCard != null && rank != 0) {
        if (card == lastCard[1]) {
          rank += 50;
        }
      }

      var highest_rank = 0;
      var id = 0;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i][4] > highest_rank) {
          highest_rank = moves[i][4];
          id = i;
        }
      }

      return moves[id];
    },

    getCardValue: function(card, nobles) {
      var value = 0;
      //50 - 300 points depending on score
      if (card.info.score == 0) value = 50;
      else if (card.info.score == 1) value = 52.5;
      else if (card.info.score == 2) value = 55;
      else if (card.info.score == 3) value = 57.5;
      else if (card.info.score == 4) value = 60;
      else value = 62.5;
      //0 - 150 points depending on nobles
      var noble_value = AI.Logic.getNobleRank(card.info.color);

      return value;
    },

    getNobleRank(color) {

    },

    getCardTotalPrice(card, tokens, cards) {
      var price = [0, 0, 0, 0, 0, 0];
      for (var i = 0; i < 5; i++) {
        price[i] = card.info.price[i] - cards[i] - tokens[i];
        if (price[i] < 0) price[i] = 0;
      }
      price[5] = tokens[5];
      return price;
    },

    getCardPrice(card, player) {
      var price = [0, 0, 0, 0, 0, 0];
      for (var i = 0; i < 5; i++) {
        var tokens = AI.Players.list[player].tokens;
        var cards = AI.Players.list[player].cards;
        if (tokens[i] + cards[i] >= card.info.price[i]) {
          price[i] = card.info.price[i] - cards[i];
          if (price[i] < 0) price[i] = 0;
        } else {
          var number_wilds = tokens[5] - price[5];
          if (tokens[i] + cards[i] + number_wilds >= card.info.price[i]) {
              price[i] = tokens[i];
              price[5] += price[i] - cards[i] - tokens[i];
          }
        }
      }
      return price;
    },
  },

  Moves: {
    token: function(player, tokens) {
      for (var i = 0; i < 5; i++) {
        //subtract from board pile
        var board_token = document.getElementById('tokens').children[i].firstChild;
        board_token.innerHTML = parseInt(board_token.innerHTML) - tokens[i];
        //add to player pile
        var player_token = document.getElementById('player_' + (player + 2) + '-token-' + i);
        player_token.number_full += tokens[i];
        player_token.number_tokens += tokens[i];
        if (player_token.number_tokens > 0) {
          player_token.innerHTML = player_token.number_tokens;
          player_token.style.backgroundColor = player_token.style.borderColor;
        }

        //keep track of variables
        AI.Players.list[player].tokens[i] += tokens[i];
        AI.Players.list[player].tokens_total += tokens[i];

        if (tokens[i] > 0) console.log('CPU' + (player + 1) + ' just bought a token');
      }
    },

    card: function(player, card) {
      var id = 0;
      if (card.info.color == 'GREEN') id = 1;
      else if (card.info.color == 'BLUE') id = 2;
      else if (card.info.color == 'WHITE') id = 3;
      else if (card.info.color == 'BLACK') id = 4;

      var price = AI.Logic.getCardPrice(card, player);
      console.log('CPU' + (player + 1) + ' just bought a card for ' + price + '; ' + card.info.price);
      for (var i = 0; i < 6; i++) {
        var ai_tokens = AI.Players.list[player].tokens;
        var player_token = document.getElementById('player_' + (player + 2) + '-token-' + i);
        var ai_cards = AI.Players.list[player].cards;
        ai_tokens[i] -= price[i];
        player_token.number_tokens -= price[i];
        AI.Players.list[player].tokens_total -= price[i];
        if (ai_tokens[i] == 0) {
          player_token.innerHTML = '';
          player_token.style.backgroundColor = 'transparent';
        } else {
          player_token.innerHTML = ai_tokens[i];
        }

        document.getElementById('player_' + (player + 2)).number_tokens -= price[i];

        //Add the tokens back into the pile
        var pile_token = document.getElementById('tokens').children[i];
        pile_token.firstChild.innerHTML = parseInt(pile_token.firstChild.innerHTML) + price[i];
      }

      AI.Players.list[player].cards[id]++;
      AI.Players.list[player].score += card.info.score;
      var player_score = document.getElementById('player_' + (player + 2)).children[0].children[1];
      player_score.innerHTML = AI.Players.list[player].score;

      var player_card = document.getElementById('player_' + (player + 2) + '-card-' + id);
      var player_token = document.getElementById('player_' + (player + 2) + '-token-' + id);
      player_token.number_full++;
      player_token.number_cards++;
      player_card.innerHTML = player_token.number_cards;
      player_card.style.backgroundColor = player_card.style.borderColor;

      var info = Game.Board.Card.getCard(card.info.row);
      info.row = card.info.row;
      var board_card = document.getElementById(card.id);
      Game.Board.Card.createInfo(board_card, info);
    },

    reserve: function(player, card) {

    },

    buyReserve: function(player, card) {

    },
  }
};
