// checkers.js
// Orginally Authored by Professor Nathan Bean
// Edited by Elijah Seigel for CIS580

/** The state of the game */
var state = {
  over: false,
  turn: 'bp',
  board: [
    [null,'wp',null,'wp',null,'wp',null,'wp',null,'wp'],
    ['wp',null,'wp',null,'wp',null,'wp',null,'wp',null],
    [null,'wp',null,'wp',null,'wp',null,'wp',null,'wp'],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    ['bp',null,'bp',null,'bp',null,'bp',null,'bp',null],
    [null,'bp',null,'bp',null,'bp',null,'bp',null,'bp'],
    ['bp',null,'bp',null,'bp',null,'bp',null,'bp',null]
  ]
}

/** @function getLegalMoves
  * returns a list of legal moves for the specified
  * piece to make.
  * @param {String} piece - 'bp' or 'wp' for black or white pawns,
  *    'bk' or 'wk' for white or black kings.
  * @param {integer} x - the x position of the piece on the board
  * @param {integer} y - the y position of the piece on the board
  * @returns {Array} the legal moves as an array of objects.
  */
function getLegalMoves(piece, x, y) {
  var moves = [];
  switch(piece) {
    case 'bp': // black can only move down the board diagonally
      checkSlide(moves, x-1, y+1);
      checkSlide(moves, x+1, y+1);
      checkJump(moves, {captures:[],landings:[]}, piece, x, y);
      break;
    case 'wp':  // white can only move up the board diagonally
      checkSlide(moves, x-1, y-1);
      checkSlide(moves, x+1, y-1);
      checkJump(moves, {captures:[],landings:[]}, piece, x, y);
      break;
    case 'bk': // kings can move diagonally any direction
    case 'wk': // kings can move diagonally any direction
      checkSlide(moves, x-1, y+1);
      checkSlide(moves, x+1, y+1);
      checkSlide(moves, x-1, y-1);
      checkSlide(moves, x+1, y-1);
      checkJump(moves, {captures:[],landings:[]}, piece, x, y);
      break;
  }
  return moves;
}

/** @function checkSlide
  * A helper function to check if a slide move is legal.
  * If it is, it is added to the moves array.
  * @param {Array} moves - the list of legal moves
  * @param {integer} x - the x position of the movement
  * @param {integer} y - the y position of the movement
  */
function checkSlide(moves, x, y) {
  // Check square is on grid
  if(x < 0 || x > 9 || y < 0 || y > 9) return;
  // check square is unoccupied
  if(state.board[y][x]) return;
  // legal move!  Add it to the move list
  moves.push({type: 'slide', x: x, y: y});
}

/** @function copyJumps
  * A helper function to clone a jumps object
  * @param {Object} jumps - the jumps to clone
  * @returns The cloned jump object
  */
function copyJumps(jumps) {
  // Use Array.prototype.slice() to create a copy
  // of the landings and captures array.
  var newJumps = {
    landings: jumps.landings.slice(),
    captures: jumps.captures.slice()
  }
  return newJumps;
}

/** @function checkJump
  * A recursive helper function to determine legal jumps
  * and add them to the moves array
  * @param {Array} moves - the moves array
  * @param {Object} jumps - an object describing the
  *  prior jumps in this jump chain.
  * @param {String} piece - 'bp' or 'wp' for black or white pawns,
  *    'bk' or 'wk' for white or black kings
  * @param {integer} x - the current x position of the piece
  * @param {integer} y - the current y position of the peice
  */
function checkJump(moves, jumps, piece, x, y) {
  switch(piece) {
    case 'bp': // black can only move down the board diagonally
      checkLanding(moves, copyJumps(jumps), x-1, y+1, x-2, y+2);
      checkLanding(moves, copyJumps(jumps), x+1, y+1, x+2, y+2);
      break;
    case 'wp':  // white can only move up the board diagonally
      checkLanding(moves, copyJumps(jumps), x-1, y-1, x-2, y-2);
      checkLanding(moves, copyJumps(jumps), x+1, y-1, x+2, y-2);
      break;
    case 'bk': // kings can move diagonally any direction
    case 'wk': // kings can move diagonally any direction
      checkLanding(moves, copyJumps(jumps), x-1, y+1, x-2, y+2);
      checkLanding(moves, copyJumps(jumps), x+1, y+1, x+2, y+2);
      checkLanding(moves, copyJumps(jumps), x-1, y-1, x-2, y-2);
      checkLanding(moves, copyJumps(jumps), x+1, y-1, x+2, y-2);
      break;
  }
}

/** @function checkLanding
  * A helper function to determine if a landing is legal,
  * if so, it adds the jump sequence to the moves list
  * and recursively seeks additional jump opportunities.
  * @param {Array} moves - the moves array
  * @param {Object} jumps - an object describing the
  *  prior jumps in this jump chain.
  * @param {String} piece - 'bp' or 'wp' for black or white pawns,
  *    'bk' or 'wk' for white or black kings
  * @param {integer} cx - the 'capture' x position the piece is jumping over
  * @param {integer} cy - the 'capture' y position of the peice is jumping over
  * @param {integer} lx - the 'landing' x position the piece is jumping onto
  * @param {integer} ly - the 'landing' y position of the peice is jumping onto
  */
function checkLanding(moves, jumps, piece, cx, cy, lx, ly) {
  // Check landing square is on grid
  if(lx < 0 || lx > 9 || ly < 0 || ly > 9) return;
  // Check landing square is unoccupied
  if(state.board[ly][lx]) return;
  // Check capture square is occuped by opponent
  if(piece == 'bp' || 'bk' && state.board[cy][cx] != 'wp' || state.board[cy][cx] != 'wk') return;
  if(piece == 'wp' || 'wk' && state.board[cy][cx] != 'bp' || state.board[cy][cx] != 'bk') return;
  // legal jump! add it to the moves list
  jumps.captures.push({x: cx, y: cy});
  jumps.landings.push({x: lx, y: ly});
  moves.push({
    type: 'jump',
    captures: jumps.captures.slice(),
    landings: jumps.landings.slice()
  });
  // check for further jump opportunities
  checkJump(moves, jumps, piece, lx, ly);
}

/** @function ApplyMove
  * A function to apply the selected move to the game
  * @param {object} move - the move to apply.
  */
function applyMove(x, y, move) {
  // TODO: Apply the move DONE
	if(move.type==="slide"){
		state.board[move.y][move.x] = state.board[y][x];
		state.board[y][x] = null;
	}
	else
	{
		move.captures.foreach(function(square){
			state.board[square.y][square.x]=null;
		});
		var index = move.landings.length-1;
		state.board [move.landings[index].y][move.landings[index].x] = state.board[y][x];
		state.board[y][x] = null;
	}
}

/** @function nextTurn
  * A function which swithces the turn variable in state
  * to indicate a change in turn
  */
function nextTurn (){
		if(state.turn === 'bp') state.turn='wp';
		else state.turn='bp';
}

/** @function checkVictory
  * A function which checks if a player has won, and updates state.over accordingly
  */
function checkVictory (){
	var wcount = 0;
	var bcount = 0;
	for (y=0; y<10; y++){
		for (x=0; x<10; x++){
			if (state.board[y][x] === "wp" || state.board[y][x] === "wk") wcount ++;
			if (state.board[y][x] === "bp" || state.board[y][x] === "bk") bcount ++;
		}
	}

	if(wcount === 0)
	{
		state.over = true;
		return'black wins';
	}
	if (bcount === 0)
	{
		state.over = true;
		return'white wins';
	}

	return false;
}

/** @function printBoard
  * A function which prints the formatted 
  * contents of state.board to console.log
  */
function printBoard(){
  for (y=0; y<10; y++){
  		for (x=0; x<10; x++){
        if (state.board[y][x] != null)
          console.log(state.board[y][x]);
        else
          console.log('__');
  		}
          console.log('\n');
  	}
}

function main()
{

}
