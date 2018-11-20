window.onload = function () {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d")
  var x;
  var y;
  var dx;
  var dy;
  var robot = new Image();
  robot.src = 'images/2drobo.png';
  var rocket = new Image();
  rocket.src = 'images/rocket.png';


  var blockWidth = 50;
  var blockHeight = 10;
  var launchPadX;

  var brickRowCount = 5;
  var brickColumnCount = 7;
  var brickPadding = 10;
  var brickOffSetTop = 30;
  var brickOffSetLeft = 30;
  var bricks = [];


  var gameRunning = false;

  //switching between robot and rocket  
  function getSprite() {
    return robot;
  }
  document.getElementById("getRocket").onclick = function () {
    getSprite = function () { return rocket };
    document.getElementById("SpriteTitle").innerText = "Rocket";
  }
  document.getElementById("getRobot").onclick = function () {
    getSprite = function () { return robot };
    document.getElementById("SpriteTitle").innerText = "Robo";
  }


  //drawing all the elements  
  function drawSprite() {
    ctx.drawImage(getSprite(), x - 15, y, 30, 30);
  };

  function drawLaunchPad() {
    ctx.beginPath();
    ctx.fillStyle = '#353551';
    ctx.fillRect(launchPadX, (canvas.height - blockHeight - 20), blockWidth, blockHeight);
    ctx.closePath();
  };

  function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] =
          {
            x: (c * (blockWidth + brickPadding)) + brickOffSetLeft,
            y: (r * (blockHeight + brickPadding)) + brickOffSetTop
          };
      }
    }

    ctx.beginPath();
    ctx.fillStyle = '#353551';
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        ctx.fillRect((bricks[c][r].x), (bricks[c][r].y), blockWidth, blockHeight);
      }
    }
    ctx.closePath();
    console.log(bricks)

  }


  //default positions for the game
  function resetGame() {
    x = canvas.width / 2;
    y = canvas.height - 60;
    dx = 2;
    dy = -2;
    launchPadX = (canvas.width - blockWidth) / 2;
  }


  //draw: running the game 
  function draw() {
    console.log('DIRECTION', y + dy > canvas.height - 30);
    ctx.clearRect(0, 0, 480, 320);
    drawSprite();
    drawLaunchPad();
    if (gameRunning == false) { return; };
    x += dx;
    y += dy;
    drawBricks();

    //figure how to change (only rocket's) direction
    //hits the sides and top, changes direction
    if (x + dx < 10 || x + dx > canvas.width) {
      dx = -dx;
    };
    if (y + dy < 0) {
      dy = -dy;
    }

    //hits the launchPad, changes direction
    else if (y + dy > canvas.height - 60) {
      if (x > launchPadX && x < launchPadX + blockWidth) {
        dy = -dy;
      }

      //hits the bottom, game over and back to starting position
      else if (y + dy > canvas.height - 30) {
        alert("GAME OVER");
        gameRunning = false;
        resetGame();
      };
    };
  };

  //launchPad moves left/right
  document.onkeydown = function (e) {
    if (gameRunning == false) { return; };
    switch (e.keyCode) {
      case 37: launchPadX -= 10; break;
      case 39: launchPadX += 10; break;
    };
  };


  document.getElementById("startBtn").onclick = function () {
    if (gameRunning == true) {
      gameRunning = false;
      resetGame();
    };
    gameRunning = true;
  }

  resetGame();
  setInterval(draw, 10);
};