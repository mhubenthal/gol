// gol.js
// (TODO: gol.js website here)
// (c) 2014 Max Hubenthal
// Gol may be freely distributed under the MIT license.

// Wrap the library in an IIFE
(function(){ 
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
  var gol_lifeBoard1 = new Array(gol_boardCellHeight), gol_lifeBoard2 = new Array(gol_boardCellHeight);
  // Initialize two dimensional arrays for cells
  for(var i=0;i<gol_boardCellHeight;i++) {
    gol_lifeBoard1[i] = new Array(gol_boardCellWidth);
    gol_lifeBoard2[i] = new Array(gol_boardCellWidth);
  }
  x[5][12] = 3.0;
  // Set flag to start gol at board one
  var gol_board1isCurrent = true, gol_board2isCurrent = false;
  // Set default gol board and cell sizes and colors, and interval for speed of life
  // (Grid lines are drawn at 1px wide)
  var gol_backgroundColor = "black", gol_backgroundWidth, gol_backgroundHeight, gol_boardCellHeight = 30, gol_boardCellWidth = 60, gol_cellSize = 10, gol_cellColor = "black", gol_lifeSpeed = 100;
  // Set offset values for gol origin
  var gol_originX = 0, gol_originY = 0;
  // Set default canvas size
  gol_backgroundWidth = ((gol_boardCellWidth*gol_cellSize)+gol_boardCellWidth+1);
  gol_backgroundHeight = ((gol_boardCellHeight*gol_cellSize)+gol_boardCellHeight+1)
  gol_canvas.width = gol_backgroundWidth;
  gol_canvas.height = gol_backgroundHeight;

  // Set default values for state of board
  var gol_isPlaying = false, gol_isPaused = true, gol_shouldPlayIntro = true;

  // Instantiate life, all dead cells to begin
  for(var yPos=0;yPos<gol_boardCellHeight;yPos++){
    for(var xPos=0;xPos<gol_boardCellWidth;xPos++){
      gol_lifeBoard1[yPos][xPos] = 0;
      gol_lifeBoard2[yPos][xPos] = 0;
    }
  }

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
    gol_ctx.fillStyle = "white";
    for(var xPos=1;xPos<gol_backgroundWidth;xPos+=11){
      for(var yPos=1;yPos<gol_backgroundHeight;yPos+=11){
        gol_ctx.fillRect(xPos,yPos,gol_cellSize,gol_cellSize);
      }
    }
  }

  // Draw complete empty board
  function gol_drawEmptyBoard(){
    gol_drawBackground();
    gol_drawEmptyLife();
  }

  // Check current board agains rules for Conway's
  // game of life and change next board accordingly.
  //    Conway's Game of Life rules (Wikipedia):
  //      1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
  //      2. Any live cell with two or three live neighbours lives on to the next generation.
  //      3. Any live cell with more than three live neighbours dies, as if by overcrowding.
  //      4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  function gol_checkBoard(){
    // Check which board is current
    // Board 1 is current
    if(gol_board1isCurrent){
      for(var xPos=0;xPos<gol_boardCellWidth;xPos++){
        for(var yPos=0;yPos<gol_boardCellHeight;yPos++){
          gol_lifeBoard1[xPos][yPos] = 0;
          gol_lifeBoard2[xPos][yPos] = 0;
        }
      }
    }
    // Board 2 is current
    if(gol_board2isCurrent){
      for(var xPos=0;xPos<gol_boardCellWidth;xPos++){
        for(var yPos=0;yPos<gol_boardCellHeight;yPos++){
          gol_lifeBoard1[xPos][yPos] = 0;
          gol_lifeBoard2[xPos][yPos] = 0;
        }
      }
    }
  }

  // Plays gol intro
  function gol_playIntro(){

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
    // Turn off intro
    gol_shouldPlayIntro = false;
    gol_drawEmptyBoard();
  };
  gol.playLife = function(){

  };
  // Pause
  gol.pauseLife = function(){
  };
  // Reset the board
  gol.clearLife = function(){
  };
  // Play gol intro
  gol.playIntro = function(){
  };

  // Cusomize gol
  // Change grid color, takes a valid CSS color string
  gol.setGridColor = function(newGridColor){
    gol_backgroundColor = newGridColor;
  };
  // Change interval in ms of lifecycles
  gol.setLifeSpeed = function(newLifeSpeed){
    gol_lifeSpeed = newLifeSpeed;
  };
  // Change cell color, takes a valid CSS color string
  gol.setLifeColor = function (newLifeColor) {
    gol_cellColor = newLifeColor;
  };
  // Turn intro on/off, "1" = on, "0" = off
  gol.setIntro = function(newSetting){
    gol_shouldPlayIntro = false;
    if(newSetting==1){
      gol_playIntro = true;
    }
  }

  // Register the gol object to the global namespace
  this.gol = gol;
}());
