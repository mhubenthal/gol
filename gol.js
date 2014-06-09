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

  // Default gol grid values
  var gol_gridWidth = gol_canvas.width = 672, gol_gridHeight = gol_canvas.height = 122, gol_gridUnitSize = 10, gol_gridColor, gol_gridLineWidth = 1;
    
  // Default gol message values
  var gol_message = [], gol_messageShapeArray = [], gol_messageColor, gol_gridOffset = gol_gridUnitSize + gol_gridLineWidth, gol_charOffset = 672, gol_messageInterval = 60;
    
  // Default gol run status values
  var gol_IntervalId, gol_isPaused = false, gol_isForward = false, gol_isReversed = false;
    
  // JSON object of gol char shapes for UTF-8 codes
  //  in decimal from 32 to 126.
  //  Here is a good list of the available chars:
  //    http://utf8-chartable.de/unicode-utf8-table.pl?utf8=dec
  // Position [0] of each "pattern" is the width of the shape.
  // Note: lowercase letters default to uppercase.
  var gol_JSONcharShapes = {"charPatterns": [
      {"char": " ", "pattern": [3]},
      {"char": "!", "pattern": [2,6,12,18,30]},
      {"char": "\"", "pattern": [4,6,12,8,14]},
      {"char": "#", "pattern": [6,7,9,12,13,14,15,16,19,21,24,25,26,27,28,31,33]},
      {"char": "$", "pattern": [4,1,6,7,8,12,18,19,20,26,30,31,32,37]},
      {"char": "%", "pattern": [5,12,15,20,25,30,33]},
      {"char": "&", "pattern": [4,13,18,19,20,25]},
      {"char": "'", "pattern": [2,6,12]},
      {"char": "(", "pattern": [4,2,7,12,18,25,32]},
      {"char": ")", "pattern": [4,0,7,14,20,25,30]},
      {"char": "*", "pattern": [6,6,8,10,13,14,15,18,19,20,21,22,25,26,27,30,32,34]},
      {"char": "+", "pattern": [4,13,18,19,20,25]},
      {"char": ",", "pattern": [2,30,36]},
      {"char": "-", "pattern": [4,18,19,20]},
      {"char": ".", "pattern": [2,30]},
      {"char": "/", "pattern": [5,15,20,25,30]},
      {"char": "0", "pattern": [4,6,7,8,12,14,18,20,24,26,30,31,32]},
      {"char": "1", "pattern": [2,6,12,18,24,30]},
      {"char": "2", "pattern": [4,6,7,8,14,18,19,20,24,30,31,32]},
      {"char": "3", "pattern": [4,6,7,8,14,18,19,20,26,30,31,32]},
      {"char": "4", "pattern": [4,6,8,12,14,18,19,20,26,32]},
      {"char": "5", "pattern": [4,6,7,8,12,18,19,20,26,30,31,32]},
      {"char": "6", "pattern": [4,6,7,8,12,18,19,20,24,26,30,31,32]},
      {"char": "7", "pattern": [4,6,7,8,14,20,26,32]},
      {"char": "8", "pattern": [4,6,7,8,12,14,18,19,20,24,26,30,31,32]},
      {"char": "9", "pattern": [4,6,7,8,12,14,18,19,20,26,30,31,32]},
      {"char": ":", "pattern": [2,18,30]},
      {"char": ";", "pattern": [2,18,30,36]},
      {"char": "<", "pattern": [3,13,18,25]},
      {"char": "=", "pattern": [4,12,13,14,24,25,26]},
      {"char": ">", "pattern": [3,12,19,24]},
      {"char": "?", "pattern": [4,0,1,2,8,13,14,19,31]},
      {"char": "@", "pattern": [6,0,1,2,3,4,6,10,12,14,16,18,20,21,22,24,30,31,32,33,34]},
      {"char": "A", "pattern": [4,6,7,8,12,14,18,19,20,24,26,30,32]},
      {"char": "B", "pattern": [4,6,7,8,12,14,18,19,20,24,26,30,31,32]},
      {"char": "C", "pattern": [4,6,7,8,12,18,24,30,31,32]},
      {"char": "D", "pattern": [4,8,14,18,19,20,24,26,30,31,32]},
      {"char": "E", "pattern": [4,6,7,8,12,18,19,20,24,30,31,32]},
      {"char": "F", "pattern": [4,6,7,8,12,18,19,20,24,30]},
      {"char": "G", "pattern": [4,6,7,8,12,18,20,24,26,30,31,32]},
      {"char": "H", "pattern": [4,6,8,12,14,18,19,20,24,26,30,32]},
      {"char": "I", "pattern": [2,6,12,18,24,30]},
      {"char": "J", "pattern": [4,8,14,20,24,26,30,31,32]},
      {"char": "K", "pattern": [4,6,8,12,14,18,19,24,26,30,32]},
      {"char": "L", "pattern": [4,6,12,18,24,30,31,32]},
      {"char": "M", "pattern": [6,6,7,8,9,10,12,14,16,18,20,22,24,26,28,30,32,34]},
      {"char": "N", "pattern": [5,6,9,12,13,15,18,20,21,24,27,30,33]},
      {"char": "O", "pattern": [4,6,7,8,12,14,18,20,24,26,30,31,32]},
      {"char": "P", "pattern": [4,6,7,8,12,14,18,19,20,24,30]},
      {"char": "Q", "pattern": [4,6,7,8,12,14,18,19,20,26,32]},
      {"char": "R", "pattern": [4,6,7,8,12,14,18,19,24,26,30,32]},
      {"char": "S", "pattern": [4,6,7,8,12,18,19,20,26,30,31,32]},
      {"char": "T", "pattern": [4,6,7,8,13,19,25,31]},
      {"char": "U", "pattern": [4,6,8,12,14,18,20,24,26,30,31,32]},
      {"char": "V", "pattern": [4,6,8,12,14,18,20,25,31]},
      {"char": "W", "pattern": [6,6,8,10,12,14,16,18,20,22,24,26,28,30,31,32,33,34]},
      {"char": "X", "pattern": [6,6,10,13,15,20,25,27,30,34]},
      {"char": "Y", "pattern": [4,6,8,12,14,19,25,31]},
      {"char": "Z", "pattern": [4,6,7,8,14,19,24,30,31,32]},
      {"char": "[", "pattern": [3,6,7,12,18,24,30,31]},
      {"char": "\\", "pattern": [5,12,19,26,33]},
      {"char": "]", "pattern": [3,6,7,13,19,25,30,31]},
      {"char": "^", "pattern": [4,7,12,14]},
      {"char": "_", "pattern": [5,30,31,32,33]},
      {"char": "`", "pattern": [3,6,13]},
      {"char": "a", "pattern": [4,6,7,8,12,14,18,19,20,24,26,30,32]},
      {"char": "b", "pattern": [4,6,7,8,12,14,18,19,20,24,26,30,31,32]},
      {"char": "c", "pattern": [4,6,7,8,12,18,24,30,31,32]},
      {"char": "d", "pattern": [4,8,14,18,19,20,24,26,30,31,32]},
      {"char": "e", "pattern": [4,6,7,8,12,18,19,20,24,30,31,32]},
      {"char": "f", "pattern": [4,6,7,8,12,18,19,20,24,30]},
      {"char": "g", "pattern": [4,6,7,8,12,18,20,24,26,30,31,32]},
      {"char": "h", "pattern": [4,6,8,12,14,18,19,20,24,26,30,32]},
      {"char": "i", "pattern": [2,6,12,18,24,30]},
      {"char": "j", "pattern": [4,8,14,20,24,26,30,31,32]},
      {"char": "k", "pattern": [4,6,8,12,14,18,19,24,26,30,32]},
      {"char": "l", "pattern": [4,6,12,18,24,30,31,32]},
      {"char": "m", "pattern": [6,6,7,8,9,10,12,14,16,18,20,22,24,26,28,30,32,34]},
      {"char": "n", "pattern": [5,6,9,12,13,15,18,20,21,24,27,30,33]},
      {"char": "o", "pattern": [4,6,7,8,12,14,18,20,24,26,30,31,32]},
      {"char": "p", "pattern": [4,6,7,8,12,14,18,19,20,24,30]},
      {"char": "q", "pattern": [4,6,7,8,12,14,18,19,20,26,32]},
      {"char": "r", "pattern": [4,6,7,8,12,14,18,19,24,26,30,32]},
      {"char": "s", "pattern": [4,6,7,8,12,18,19,20,26,30,31,32]},
      {"char": "t", "pattern": [4,6,7,8,13,19,25,31]},
      {"char": "u", "pattern": [4,6,8,12,14,18,20,24,26,30,31,32]},
      {"char": "v", "pattern": [4,6,8,12,14,18,20,25,31]},
      {"char": "w", "pattern": [6,6,8,10,12,14,16,18,20,22,24,26,28,30,31,32,33,34]},
      {"char": "x", "pattern": [6,6,10,13,15,20,25,27,30,34]},
      {"char": "y", "pattern": [4,6,8,12,14,19,25,31]},
      {"char": "z", "pattern": [4,6,7,8,14,19,24,30,31,32]},
      {"char": "{", "pattern": [4,7,8,13,18,25,31,32]},
      {"char": "|", "pattern": [2,6,12,18,24,30]},
      {"char": "}", "pattern": [4,6,7,13,20,25,30,31]},
      {"char": "~", "pattern": [5,18,13,20,15]}
  ]};

  /////////////////////////////////////////////
  //  Internal gol functions
  /////////////////////////////////////////////

  // Draw grid on canvas element
  function gol_drawGrid(){
    // Clear canvas of remnants
    gol_ctx.clearRect(0,0,gol_gridWidth,gol_gridHeight);
    gol_ctx.lineWidth = gol_gridLineWidth;
      
    // Draw vertical grid, start at 0.5 to allo for non-blurry 1px line
    for (var x = 0.5; x <= gol_gridWidth; x++){
      gol_ctx.fillStyle = gol_gridColor;
      gol_ctx.beginPath();
      gol_ctx.moveTo(x, 0);
      gol_ctx.lineTo(x, gol_gridHeight);
      gol_ctx.closePath();
      gol_ctx.stroke();
      x += gol_gridUnitSize;
    }
      
    // Draw horizontal grid, start at 0.5 to allo for non-blurry 1px line
    for (var y = 0.5; y <= gol_gridHeight; y++){
      gol_ctx.fillStyle = gol_gridColor;
      gol_ctx.beginPath();
      gol_ctx.moveTo(0, y);
      gol_ctx.lineTo(gol_gridWidth, y);
      gol_ctx.closePath();
      gol_ctx.stroke();
      y += gol_gridUnitSize;
    }
  }

  // Shape class constructor
  function gol_shape(arrayOfSquaresToColor){
    // Create generic 6x6 grid, which is positioned on the canvas with a 2 box
    //   border to the top and bottom.
    //
    // gol_shape takes an array of squares to color,
    //   which correspond to the following positions:
    //
    // 00--01--02--03--04--05
    // 06--07--08--09--10--11
    // 12--13--14--15--16--17
    // 18--19--20--21--22--23
    // 24--25--26--27--28--29
    // 30--31--32--33--34--35
    // 36--37--38--39--40--41
    //
    this.squaresToColor = arrayOfSquaresToColor;
    this.genericShape = [[],[]];
    // Declare array of rectangle coordinates
    this.shapeArray = [[],[]];
    // Overall width of ticker
    this.reset = gol_gridWidth;
    // Grid line width
    this.gridLineWidth = gol_gridLineWidth;
  }

  // Declare Shape class properties on prototype
  gol_shape.prototype = {
    // Constructor
    constructor: gol_shape,
    
    // Load a generic array of coordinates for use in drawing shapes
    loadGenericShape: function(){
      // Fill generic shape with zero-based coordinates
      var xVal = 0;
      var yVal = 2*gol_gridOffset;
      var counter = 0;
      while(counter<48){
        for(var i=0;i<6;i++){
          this.genericShape[counter] = [xVal,yVal];
          xVal += gol_gridOffset;
          counter++;
        }
        xVal = 0;
        yVal += gol_gridOffset;
      }
    },
      
    // Load a shape with generic coordinates from an array of squares to "turn on"
    loadShape: function (){
      // Add positions to color to the shape
      for (var i = 1; i < this.squaresToColor.length; i++){
        this.shapeArray[i] = this.genericShape[this.squaresToColor[i]];
        // Set each x coordinate of shape to offset position in message string
        this.shapeArray[i][0] += gol_charOffset;
        // Set each y coordinate of shape to account for grid line width
        this.shapeArray[i][1] += this.gridLineWidth;
      }
      // After loading the shape, increment the offset(pointer) to
      //   allow for writing the next char
      gol_charOffset += (this.squaresToColor[0] * gol_gridOffset);
    },

    // Draw a shape, given a '2d' <canvas> context
    animateShapeForward: function (){
      for (var i = 0; i < this.shapeArray.length; i++){
        // Pixel is ready to cycle back to enter right of ticker
        if (this.shapeArray[i][0] < 0) {
          // Reset position to ticker display width
          this.shapeArray[i][0] = gol_charOffset;
        }
        var tempX = this.shapeArray[i][0];
        var tempY = this.shapeArray[i][1];
          
        // Draw shape
        gol_ctx.fillStyle = gol_messageColor;
        gol_ctx.fillRect(tempX,tempY,gol_gridUnitSize,gol_gridUnitSize);
        this.shapeArray[i][0] -= gol_gridOffset; // Decrement x coordinate position
      }
    },
    animateShapeBackwards: function (){
      for (var i = 0; i < this.shapeArray.length; i++){
        // Pixel is ready to cycle back to enter right of ticker
        if (this.shapeArray[i][0] > gol_gridWidth) {
          // Reset position to ticker display width
          this.shapeArray[i][0] = -gol_charOffset;
        }
        var tempX = this.shapeArray[i][0];
        var tempY = this.shapeArray[i][1];
          
        // Draw shape
        gol_ctx.fillStyle = gol_messageColor;
        gol_ctx.fillRect(tempX,tempY,gol_gridUnitSize,gol_gridUnitSize);
        this.shapeArray[i][0] += gol_gridOffset; // Decrement x coordinate position
      }
    }
  };

  // Load a message array of gol_shape objects from an array of UTF-8 codes
  function gol_loadMessageShapeArray(newCharArray){
    // Make sure gol_messageShapeArray is empty
    gol_messageShapeArray = [];
    // Reset the message offset
    gol_charOffset = 672;
    var newShape;
    // Convert chars to gol_shape objects and add to message array
    for(var i=0;i<newCharArray.length;i++){
      // Invalid char is passed in, "!" is returned.
      if((newCharArray[i]>94)||(newCharArray[i]<0)){
        newShape = new gol_shape(gol_JSONcharShapes.charPatterns[1].pattern);
      }
      newShape = new gol_shape(gol_JSONcharShapes.charPatterns[newCharArray[i]-32].pattern);
      newShape.loadGenericShape();  // Load the generic gol shape template
      // Load the shape, which creates an array of (x,y) coordinates
      newShape.loadShape();  
      gol_messageShapeArray[i] = newShape;  // Add the shape to the message array
    }
  }
  
  // Draw letters from message to canvas, an array of gol_shape objects are passed in
  function gol_writeMessageForward(messageArray){
    for(var i=0; i<messageArray.length; i++){
        messageArray[i].animateShapeForward();
    }
  }
  function gol_writeMessageBackwards(messageArray){
    for(var i=0; i<messageArray.length; i++){
        messageArray[i].animateShapeBackwards();
    }
  }

  // Internal gol contol methods
  function gol_playForward(){ 
    // If gol is not already running, start it up, otherwise do nothing
    if(!gol_isForward){
      clearInterval(gol_IntervalId);  // Clear any previously running gol
      gol_isForward = true;
      gol_isReversed = false;
      gol_IntervalId = setInterval(function(){
        gol_drawGrid();
        gol_writeMessageForward(gol_messageShapeArray);
      }, gol_messageInterval);
    }
  }
  function gol_playReverse(){
    // If gol is not already running, start it up, otherwise do nothing
    if(!gol_isReversed){
      clearInterval(gol_IntervalId);  // Clear any previously running gol
      gol_isReversed = true;
      gol_isForward = false;
      gol_IntervalId = setInterval(function(){
        gol_drawGrid();
        gol_writeMessageBackwards(gol_messageShapeArray);
      }, gol_messageInterval);
    }
  }
  
  function gol_pause(){
    clearInterval(gol_IntervalId);
    gol_isPaused = true;
    gol_isForward = false;
    gol_isReversed = false;
  }

  /////////////////////////////////////////////
  //  External functions to be called by user
  /////////////////////////////////////////////

  // Setters
  gol.setMessage = function(newMessage){
    // Make sure the array is empty
    gol_message = [];
    // Place array of UTF-8 codes into gol_message
    for(var i=0;i<newMessage.length;i++){
      gol_message[i] = newMessage.charCodeAt(i);
    }
    // Load shapes with array of UTF-8 codes
    gol_loadMessageShapeArray(gol_message);
  };
  gol.setMessageColor = function(newMessageColor){
    gol_messageColor = newMessageColor;
  };
  gol.setMessageInterval = function(newMessageInterval){
    gol_messageInterval = newMessageInterval;
  };
    
  // The below methods may break the library at this point if called.
  // Future versions will allow for a flexible sized grid.
  /*
  gol.setGridColor = function(newGridColor){
    gol_gridColor = newGridColor;
  };
  gol.setGridHeight = function(newGridHeight){
    gol_gridHeight = newGridHeight;
  };
  gol.setGridWidth = function(newGridWidth){
    gol_gridWidth = newGridWidth;
  };
  gol.setGridUnitSize = function(newGridUnitSize){
    gol_gridUnitSize = newGridUnitSize;
  };
  */
  
  // gol controls
  gol.playForward = function(){
    gol_playForward();
  };
  gol.pause = function(){
    gol_pause();
  };
  // gol.playReverse function is buggy, use/improve at your own peril!
  /*
  gol.playReverse = function(){
    gol_playReverse();
  };
  */

  // Sample code to test all the available gol chars
  //gol.setMessage(" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`{|}~");

  // Register the gol object to the global namespace
  this.gol = gol;
}());
