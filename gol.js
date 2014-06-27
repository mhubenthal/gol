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
  var gol_board1isCurrent = true, gol_board2isCurrent = false;
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
    for(var xPos=1;xPos<gol_backgroundWidth;xPos+=11){
      for(var yPos=1;yPos<gol_backgroundHeight;yPos+=11){
        gol_ctx.fillRect(xPos,yPos,gol_cellSize,gol_cellSize);
      }
    }
  }

  // Draw current board of life
  function gol_drawLife(){
    // Use board1 if current
    if(gol_board1isCurrent){
      for(var xPos=1;xPos<gol_backgroundWidth;xPos+=11){
        for(var yPos=1;yPos<gol_backgroundHeight;yPos+=11){
          // Dead cell
          if(gol_lifeBoard1[yPos][xPos] === 0){
            gol_ctx.fillStyle = gol_backgroundColor;
            gol_ctx.fillRect(xPos,yPos,gol_cellSize,gol_cellSize);
          } 
          // Else live cell
          gol_ctx.fillStyle = gol_cellColor;
          gol_ctx.fillRect(xPos,yPos,gol_cellSize,gol_cellSize);
        }
      }
    } 
    // Else, board2 is current 
    if(gol_board2isCurrent){
      for(xPos=1;xPos<gol_backgroundWidth;xPos+=11){
        for(yPos=1;yPos<gol_backgroundHeight;yPos+=11){
          // Dead cell
          if(gol_lifeBoard1[yPos][xPos] === 0){
            gol_ctx.fillStyle = gol_backgroundColor;
            gol_ctx.fillRect(xPos,yPos,gol_cellSize,gol_cellSize);
          } 
          // Else live cell
          gol_ctx.fillStyle = gol_cellColor;
          gol_ctx.fillRect(xPos,yPos,gol_cellSize,gol_cellSize);
        }
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
      }
      gol_board1isCurrent = false;
      gol_clearLife(gol_lifeBoard1);
      gol_board2isCurrent = true;
    }
    // Else board 2 is current
    if(gol_board2isCurrent){
      for(xPos=0;xPos<gol_boardCellWidth;xPos++){
        for(yPos=0;yPos<gol_boardCellHeight;yPos++){
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
      }
      gol_board2isCurrent = false;
      gol_clearLife(gol_lifeBoard2);
      gol_board1isCurrent = true;
    }
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
    gol_isPaused = true;
    gol_clearLife(gol_lifeBoard1);
    gol_clearLife(gol_lifeBoard2);
  };

  // Customize gol
  // Change grid color, takes a valid CSS color string
  gol.setGridColor = function(newGridColor){
    gol_isPaused = true;
    gol_backgroundColor = newGridColor;
    gol_isPaused = false;
    gol_playLife();
  };
  // Change interval in ms of lifecycles
  gol.setLifeSpeed = function(newLifeSpeed){
    gol_isPaused = true;
    gol_lifeSpeed = newLifeSpeed;
    gol_isPaused = false;
    gol_playLife();
  };
  // Change cell color, takes a valid CSS color string
  gol.setCellColor = function (newCellColor) {
    gol_isPaused = true;
    gol_cellColor = newCellColor;
    gol_isPaused = false;
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
