// gol.js
// (TODO: gol.js website here)
// (c) 2014 Max Hubenthal
// Gol may be freely distributed under the MIT license.

// Wrap the library in an IIFE
(function(window){ 
  // Declare gol object for use in global namespace
  var gol = {
      
    // Current version.
    VERSION: "1.0"
  };

  /////////////////////////////////////////////
  //  gol constants & gol setup
  /////////////////////////////////////////////

  // References to <canvas> element
  // Note: for gol to work, set the id of the <canvas>
  //   element to "gol_canvas".
  var gol_canvas = document.getElementById("gol_canvas");
  var gol_ctx = gol_canvas.getContext('2d');   

  // Use two boards, one for current gol, one to hold next gol
  var gol_lifeBoard1 = [], gol_lifeBoard2 = [];
    
  // Set flag to start gol at board one
  var gol_board1isCurrent = true;
  // Set default gol board and cell sizes and colors, and interval for speed of life
  // (Grid lines are drawn at 1px wide)
  var gol_backgroundColor = "black", gol_backgroundWidth, gol_backgroundHeight, gol_boardCellHeight = 30, gol_boardCellWidth = 60, gol_cellSize = 10, gol_cellColor = "white", gol_lifeSpeed = 100, gol_intervalId;
  // Set offset values for gol origin
  var gol_originX = 0, gol_originY = 0;
  // Set default canvas size
  gol_backgroundWidth = ((gol_boardCellWidth*gol_cellSize)+gol_boardCellWidth+1);
  gol_backgroundHeight = ((gol_boardCellHeight*gol_cellSize)+gol_boardCellHeight+1);
  gol_canvas.width = gol_backgroundWidth;
  gol_canvas.height = gol_backgroundHeight;

  // Set default values for state of board
  var gol_isPaused = true, gol_shouldPlayIntro = true;

  /////////////////////////////////////////////
  //  Internal gol functions
  /////////////////////////////////////////////

  // Draw black rectangle container, size of life board
  function gol_drawBackground(){
    gol_ctx.fillStyle = gol_backgroundColor;
    gol_ctx.fillRect(gol_originX,gol_originY,gol_backgroundWidth,gol_backgroundHeight);
  }

  // Draw complete board of dead(white) cells
  function gol_drawEmptyLife(){
    gol_ctx.fillStyle = gol_cellColor;
    for(var xPos=1;xPos<gol_backgroundWidth;xPos+=(gol_cellSize+1)){
      for(var yPos=1;yPos<gol_backgroundHeight;yPos+=(gol_cellSize+1)){
        gol_ctx.fillRect(xPos,yPos,gol_cellSize,gol_cellSize);
      }
    }
  }

  // Draw current board of life
  function gol_drawLife(){
    var x=0, y=0;
    // Use board1 if current
    if(gol_board1isCurrent){
      for(var xPos=1;xPos<gol_backgroundWidth;xPos+=(gol_cellSize+1)){
        y=0;
        for(var yPos=1;yPos<gol_backgroundHeight;yPos+=(gol_cellSize+1)){
          // Dead cell
          if(gol_lifeBoard1[y][x] === 0){
            gol_ctx.fillStyle = gol_cellColor;
            gol_ctx.fillRect(xPos,yPos,gol_cellSize,gol_cellSize);
          } 
          // Else live cell
          if(gol_lifeBoard1[y][x] === 1){
            gol_ctx.fillStyle = gol_backgroundColor;
            gol_ctx.fillRect(xPos,yPos,gol_cellSize,gol_cellSize);
          }
          y++;
        }
        x++;
      }
    } 
    // Else, board2 is current 
    if(!gol_board1isCurrent){
      for(xPos=1;xPos<gol_backgroundWidth;xPos+=(gol_cellSize+1)){
        y=0;
        for(yPos=1;yPos<gol_backgroundHeight;yPos+=(gol_cellSize+1)){
          // Dead cell
          if(gol_lifeBoard2[y][x] === 0){
            gol_ctx.fillStyle = gol_cellColor;
            gol_ctx.fillRect(xPos,yPos,gol_cellSize,gol_cellSize);
          } 
          // Else live cell
          if(gol_lifeBoard2[y][x] === 1){
            gol_ctx.fillStyle = gol_backgroundColor;
            gol_ctx.fillRect(xPos,yPos,gol_cellSize,gol_cellSize);
          }
          y++;
        }
        x++;
      }
    }
  } 

  // Draw complete empty board
  function gol_drawEmptyBoard(){
    gol_drawBackground();
    gol_drawEmptyLife();
  }

  // Set both life boards to all dead ("0" values)
  function gol_clearLife(boardToClear){
    for(var yPos=0;yPos<gol_boardCellHeight;yPos++){
      boardToClear[yPos] = [];
      for(var xPos=0;xPos<gol_boardCellWidth;xPos++){
        boardToClear[yPos][xPos] = 0;
      }
    }
  }

  // Check current board agains rules for Conway's
  // game of life and change next board accordingly.
  //    Conway's Game of Life rules (Wikipedia):
  //      1. Any live cell with fewer than two live neighbors dies, as if caused by under-population.
  //      2. Any live cell with two or three live neighbors lives on to the next generation.
  //      3. Any live cell with more than three live neighbors dies, as if by overcrowding.
  //      4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
  function gol_checkBoard(){
    // N holds number of live neighbors of current cell
    var n = 0;
    // Check which board is current
    // Board 1 is current
    if(gol_board1isCurrent){
      for(var xPos=0;xPos<gol_boardCellWidth;xPos++){
        for(var yPos=0;yPos<gol_boardCellHeight;yPos++){
          // Get number of current live neighbors for cells not on perimeter of board
          if(((xPos > 0)&&(yPos > 0))&&((xPos < (gol_boardCellWidth-1))&&(yPos < (gol_boardCellHeight-1)))){
          if(gol_lifeBoard1[yPos-1][xPos-1]===1){n++;}
          if(gol_lifeBoard1[yPos-1][xPos]===1){n++;}
          if(gol_lifeBoard1[yPos-1][xPos+1]===1){n++;}
          if(gol_lifeBoard1[yPos][xPos-1]===1){n++;}
          if(gol_lifeBoard1[yPos][xPos+1]===1){n++;}
          if(gol_lifeBoard1[yPos+1][xPos-1]===1){n++;}
          if(gol_lifeBoard1[yPos+1][xPos]===1){n++;}
          if(gol_lifeBoard1[yPos+1][xPos+1]===1){n++;}
          }
          // Get number of current live neighbors for cells on perimeter of board
          if(((xPos === 0)||(yPos === 0))||((xPos === (gol_boardCellWidth-1))||(yPos === (gol_boardCellHeight-1)))){
            // Cell in upper left corner
            if((xPos === 0)&&(yPos === 0)){

            }
            // Cell in upper right corner
            if(){

            }
            // Cell in lower right corner
            if(){

            }
            // Cell in lower left corner
            if(){

            }
            // Cell in top most row, not in a corner
            if(){

            }
            // Cell in left most column, not in a corner
            if(){

            }
            // Cell in bottom most row, not in a corner
            if(){

            }
            // Cell in right most column, not in a corner
            if(){
              
            }


            if(gol_lifeBoard1[yPos-1][xPos-1]===1){n++;}
            if(gol_lifeBoard1[yPos-1][xPos]===1){n++;}
            if(gol_lifeBoard1[yPos-1][xPos+1]===1){n++;}
            if(gol_lifeBoard1[yPos][xPos-1]===1){n++;}
            if(gol_lifeBoard1[yPos][xPos+1]===1){n++;}
            if(gol_lifeBoard1[yPos+1][xPos-1]===1){n++;}
            if(gol_lifeBoard1[yPos+1][xPos]===1){n++;}
            if(gol_lifeBoard1[yPos+1][xPos+1]===1){n++;}
          }
          // Check if current cell is live
          if(gol_lifeBoard1[yPos][xPos]===1){
            if((n>3)||(n<2)){
              gol_lifeBoard2[yPos][xPos] = 0; // Set next board to dead cell
            }
            gol_lifeBoard2[yPos][xPos] = 1; // Set next board to live cell
          }
          // Else cell is dead
          if(n===3){
            gol_lifeBoard2[yPos][xPos] = 1; // Set next board to live cell
          }
          gol_lifeBoard2[yPos][xPos] = 0; // Set next board to dead cell
        }
        n=0;
      }
      gol_clearLife(gol_lifeBoard1);
    }
    // Else board 2 is current
    if(!gol_board1isCurrent){
      for(xPos=0;xPos<gol_boardCellWidth;xPos++){
        for(yPos=0;yPos<gol_boardCellHeight;yPos++){
          // Get number of current live neighbors
          if(((xPos > 1)&&(yPos > 1))&&((xPos < (gol_boardCellWidth-2))&&(yPos < (gol_boardCellHeight-2)))){
          if(gol_lifeBoard1[yPos-1][xPos-1]===1){n++;}
          if(gol_lifeBoard1[yPos-1][xPos]===1){n++;}
          if(gol_lifeBoard1[yPos-1][xPos+1]===1){n++;}
          if(gol_lifeBoard1[yPos][xPos-1]===1){n++;}
          if(gol_lifeBoard1[yPos][xPos+1]===1){n++;}
          if(gol_lifeBoard1[yPos+1][xPos-1]===1){n++;}
          if(gol_lifeBoard1[yPos+1][xPos]===1){n++;}
          if(gol_lifeBoard1[yPos+1][xPos+1]===1){n++;}
          }
          // Check if current cell is live
          if(gol_lifeBoard2[yPos][xPos]===1){
            if((n>3)||(n<2)){
              gol_lifeBoard1[yPos][xPos] = 0; // Set next board to dead cell
            }
            gol_lifeBoard1[yPos][xPos] = 1; // Set next board to live cell
          }
          // Else cell is dead
          if(n===3){
            gol_lifeBoard1[yPos][xPos] = 1; // Set next board to live cell
          }
          gol_lifeBoard1[yPos][xPos] = 0; // Set next board to dead cell
        }
        n=0;
      }
      gol_clearLife(gol_lifeBoard2);
    }
    // Reset current board
    gol_board1isCurrent = !gol_board1isCurrent;
  }

  // Plays gol intro
  function gol_playIntro(){
    ;
  }

  // Gol life loop
  function gol_playLife(){
    // If gol is not already playing, start it up
    if(gol_isPaused){
      clearInterval(gol_intervalId); // Clear any previously running gol
      gol_isPaused = false;
      gol_intervalId = setInterval(function(){
        gol_checkBoard();
        gol_drawLife();
      }, gol_lifeSpeed);  
    }
  }

  // Pause gol
  function gol_pauseLife() {
    clearInterval(gol_intervalId);
    gol_isPaused = true;
  }

  /////////////////////////////////////////////
  //  External functions to be called by user
  /////////////////////////////////////////////

  // Basic gol operations
  // Setup blank board and intro if desired
  gol.setupLife = function(){
    // Check if time to play intro
    if(gol_shouldPlayIntro){
      gol_playIntro();
    }
    // If intro is over, or not chosen, turn off intro
    gol_shouldPlayIntro = false;
    gol_drawEmptyBoard();
    gol_clearLife(gol_lifeBoard1);
    gol_clearLife(gol_lifeBoard2);
    // Let user select initial live cells
    gol_canvas.addEventListener("mousedown", getPosition, false);
    function getPosition(event){
      // Get mouse position
      var x = event.x;
      var y = event.y;
      // Get x and y relative to canvas
      x -= gol_canvas.offsetLeft;
      y -= gol_canvas.offsetTop;
      // Fill appropriate square at mouse click
      var adjX = Math.floor(x/(gol_cellSize+1)) * (gol_cellSize+1) + 1;
      var adjY = Math.floor(y/(gol_cellSize+1)) * (gol_cellSize+1) + 1;
      // Fill selected square
      gol_ctx.fillStyle = gol_backgroundColor;
      gol_ctx.fillRect(adjX,adjY,gol_cellSize,gol_cellSize);
      // Update board with user selected live cells
      var colX = Math.floor(x/(gol_cellSize+1));
      if(x<(gol_cellSize+2)){colX=0;}
      var rowY = Math.floor(y/(gol_cellSize+1));
      if(y<(gol_cellSize+2)){rowY=0;}
      gol_lifeBoard1[rowY][colX] = 1;
    }
  };
  // Play current gol board
  gol.playLife = function(){
    gol_playLife();
  };
  // Pause
  gol.pauseLife = function(){
    gol_pauseLife();
  };
  // Reset the board
  gol.clearLife = function(){
    gol_pauseLife();
    gol_clearLife(gol_lifeBoard1);
    gol_clearLife(gol_lifeBoard2);
    gol_drawLife();
  };

  // Customize gol
  // Change grid color, takes a valid CSS color string, pauses game
  gol.setGridColor = function(newGridColor){
    gol_pauseLife();
    gol_backgroundColor = newGridColor;
    gol_drawBackground();
    gol_drawLife();
  };
  // Change cell color, takes a valid CSS color string, pauses game
  gol.setCellColor = function (newCellColor) {
    gol_pauseLife();
    gol_cellColor = newCellColor;
    gol_drawLife();
  };
  // Change interval in ms of lifecycles
  gol.setLifeSpeed = function(newLifeSpeed){
    gol_pauseLife();
    gol_lifeSpeed = newLifeSpeed;
    gol_playLife();
  };
  // Turn intro on/off, "1" = on, "0" = off
  gol.setIntro = function(newSetting){
    gol_shouldPlayIntro = false;
    if(newSetting===1){
      gol_shouldPlayIntro = true;
    }
  };

  // Register the gol object to the global namespace
  window.gol = gol;
}(window));
