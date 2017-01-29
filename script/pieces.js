var Pieces = {
  Tile: [
    //Price = [RED, GREEN, BLUE, WHITE, BLACK]
    {score: 3, price: [4, 0, 0, 0, 4]},
    {score: 3, price: [3, 0, 0, 3, 3]},
    {score: 3, price: [0, 0, 4, 4, 0]},
    {score: 3, price: [0, 0, 3, 3, 3]},
    {score: 3, price: [0, 0, 0, 4, 4]},
    {score: 3, price: [4, 4, 0, 0, 0]},
    {score: 3, price: [0, 4, 4, 0, 0]},
    {score: 3, price: [0, 3, 3, 3, 0]},
    {score: 3, price: [3, 3, 3, 0, 0]},
    {score: 3, price: [3, 3, 0, 0, 3]}
  ],
  Cards: {
    Row1: [
      //Price = [RED, GREEN, BLUE, WHITE, BLACK]
      {score: 0, color: 'GREEN', price: [1, 0, 1, 1, 1]},
      {score: 0, color: 'BLUE', price: [1, 1, 0, 1, 1]},
      {score: 0, color: 'WHITE', price: [0, 2, 2, 0, 1]},
      {score: 0, color: 'GREEN', price: [0, 0, 1, 2, 0]},
      {score: 0, color: 'GREEN', price: [1, 0, 1, 1, 2]},
      {score: 0, color: 'BLACK', price: [1, 1, 2, 1, 0]},
      {score: 0, color: 'GREEN', price: [2, 0, 2, 0, 0]},
      {score: 0, color: 'BLUE', price: [0, 0, 0, 0, 3]},
      {score: 0, color: 'GREEN', price: [2, 0, 1, 0, 2]},
      {score: 0, color: 'RED', price: [0, 1, 1, 2, 1]},
      {score: 0, color: 'RED', price: [0, 1, 1, 1, 1]},
      {score: 0, color: 'GREEN', price: [3, 0, 0, 0, 0]},
      {score: 0, color: 'BLUE', price: [1, 3, 1, 0, 0]},
      {score: 0, color: 'RED', price: [2, 0, 0, 2, 0]},
      {score: 0, color: 'WHITE', price: [0, 0, 3, 0, 0]},
      {score: 0, color: 'WHITE', price: [0, 0, 2, 0, 2]},
      {score: 0, color: 'BLACK', price: [1, 0, 2, 2, 0]},
      {score: 0, color: 'BLUE', price: [2, 2, 0, 1, 0]},
      {score: 0, color: 'BLUE', price: [0, 0, 0, 1, 2]},
      {score: 1, color: 'BLUE', price: [4, 0, 0, 0, 0]},
      {score: 1, color: 'WHITE', price: [0, 4, 0, 0, 0]},
      {score: 1, color: 'GREEN', price: [0, 0, 0, 0, 4]},
      {score: 0, color: 'BLACK', price: [0, 2, 0, 2, 0]},
      {score: 0, color: 'GREEN', price: [0, 1, 3, 1, 0]},
      {score: 0, color: 'BLUE', price: [0, 2, 0, 0, 2]},
      {score: 0, color: 'BLACK', price: [1, 2, 0, 0, 0]},
      {score: 0, color: 'BLACK', price: [1, 1, 1, 1, 0]},
      {score: 0, color: 'BLUE', price: [2, 1, 0, 1, 1]},
      {score: 0, color: 'WHITE', price: [0, 0, 1, 3, 1]},
      {score: 0, color: 'WHITE', price: [1, 2, 1, 0, 1]},
      {score: 0, color: 'WHITE', price: [2, 0, 0, 0, 1]},
      {score: 0, color: 'WHITE', price: [1, 1, 1, 0, 1]},
      {score: 0, color: 'RED', price: [0, 1, 2, 0, 0]},
      {score: 1, color: 'RED', price: [0, 0, 0, 4, 0]},
      {score: 0, color: 'RED', price: [1, 0, 0, 1, 3]},
      {score: 0, color: 'RED', price: [0, 1, 0, 2, 2]},
      {score: 0, color: 'RED', price: [0, 0, 0, 3, 0]},
      {score: 0, color: 'BLACK', price: [3, 1, 0, 0, 1]},
      {score: 1, color: 'BLACK', price: [0, 0, 4, 0, 0]},
      {score: 0, color: 'BLACK', price: [0, 3, 0, 0, 0]}
    ],

    Row2: [
      //Price = [RED, GREEN, BLUE, WHITE, BLACK]
      {score: 2, color: 'BLACK', price: [3, 5, 0, 0, 0]},
      {score: 2, color: 'WHITE', price: [5, 0, 0, 0, 3]},
      {score: 2, color: 'BLUE', price: [1, 0, 0, 2, 4]},
      {score: 3, color: 'BLACK', price: [0, 0, 0, 0, 6]},
      {score: 3, color: 'BLUE', price: [0, 0, 6, 0, 0]},
      {score: 1, color: 'RED', price: [2, 0, 3, 0, 3]},
      {score: 2, color: 'RED', price: [0, 0, 0, 0, 5]},
      {score: 1, color: 'BLUE', price: [0, 3, 2, 0, 3]},
      {score: 2, color: 'GREEN', price: [0, 3, 5, 0, 0]},
      {score: 1, color: 'BLACK', price: [0, 2, 2, 3, 0]},
      {score: 1, color: 'GREEN', price: [3, 2, 0, 3, 0]},
      {score: 1, color: 'WHITE', price: [2, 3, 0, 0, 2]},
      {score: 1, color: 'BLACK', price: [0, 3, 0, 3, 2]},
      {score: 1, color: 'WHITE', price: [3, 0, 3, 2, 0]},
      {score: 2, color: 'RED', price: [0, 0, 0, 3, 5]},
      {score: 2, color: 'RED', price: [0, 2, 4, 1, 0]},
      {score: 3, color: 'WHITE', price: [0, 0, 0, 6, 0]},
      {score: 2, color: 'BLACK', price: [0, 0, 0, 5, 0]},
      {score: 1, color: 'RED', price: [2, 0, 0, 2, 3]},
      {score: 1, color: 'GREEN', price: [0, 0, 3, 2, 2]},
      {score: 2, color: 'GREEN', price: [0, 5, 0, 0, 0]},
      {score: 2, color: 'WHITE', price: [4, 1, 0, 0, 2]},
      {score: 1, color: 'BLUE', price: [3, 2, 2, 0, 0]},
      {score: 2, color: 'BLUE', price: [0, 0, 3, 5, 0]},
      {score: 2, color: 'BLUE', price: [0, 0, 5, 0, 0]},
      {score: 2, color: 'WHITE', price: [5, 0, 0, 0, 0]},
      {score: 3, color: 'GREEN', price: [0, 6, 0, 0, 0]},
      {score: 3, color: 'RED', price: [6, 0, 0, 0, 0]},
      {score: 2, color: 'BLACK', price: [2, 4, 1, 0, 0]},
      {score: 2, color: 'GREEN', price: [0, 0, 2, 4, 1]},
    ],

    Row3: [
      //Price = [RED, GREEN, BLUE, WHITE, BLACK]
      {score: 4, color: 'BLACK', price: [7, 0, 0, 0, 0]},
      {score: 5, color: 'WHITE', price: [0, 0, 0, 3, 7]},
      {score: 5, color: 'RED', price: [3, 7, 0, 0, 0]},
      {score: 4, color: 'BLUE', price: [0, 0, 0, 7, 0]},
      {score: 3, color: 'BLACK', price: [3, 5, 3, 3, 0]},
      {score: 3, color: 'RED', price: [0, 3, 5, 3, 3]},
      {score: 4, color: 'BLUE', price: [0, 0, 3, 6, 3]},
      {score: 3, color: 'GREEN', price: [3, 0, 3, 5, 3]},
      {score: 4, color: 'WHITE', price: [3, 0, 0, 3, 6]},
      {score: 3, color: 'GREEN', price: [0, 3, 6, 3, 0]},
      {score: 4, color: 'RED', price: [3, 6, 3, 0, 0]},
      {score: 3, color: 'WHITE', price: [0, 0, 0, 0, 7]},
      {score: 3, color: 'WHITE', price: [5, 3, 3, 0, 3]},
      {score: 3, color: 'BLUE', price: [3, 3, 0, 3, 5]},
      {score: 5, color: 'BLACK', price: [7, 0, 0, 0, 3]},
      {score: 5, color: 'GREEN', price: [0, 3, 7, 0, 0]},
      {score: 4, color: 'BLACK', price: [6, 3, 0, 0, 3]},
      {score: 4, color: 'RED', price: [0, 7, 0, 0, 0]},
      {score: 5, color: 'BLUE', price: [0, 0, 3, 7, 0]},
      {score: 4, color: 'GREEN', price: [0, 0, 7, 0, 0]}
    ]
  }
};