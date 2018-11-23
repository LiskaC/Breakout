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
  var gameOver = new Image();
  gameOver.src = 'images/GameOver.png';

  /*
  todo: limit launch pad
  add sounds (and toggle button)
  add levels
  add congrats for top high score if array full
  add highscore database
  */

  var blockWidth = 50;
  var blockHeight = 10;
  var launchPadX;

  var brickRowCount = 5;
  var brickColumnCount = 5;
  var brickPaddingVertical = 10;
  var brickPaddingSide = 40;
  var brickOffSetTop = 30;
  var brickOffSetLeft = 30;
  var bricks = [];

  /*everything relating to score: 
  first updating the running score, 
  then storing in highscore array and pushing to table*/
  var score = 0;
  function updateScore() { document.getElementById("incrementingScore").innerHTML = score; }

  var leaderboard = ["", "", "", "", "", "", "", "", ""];
  function updateLeaderBoard() {
    leaderboard.unshift(score);
    if (leaderboard.length > 10) {
      leaderboard.pop();
    }
    leaderboard.sort(function (a, b) {
      return b - a;
    });
    document.getElementById("1st").innerHTML = leaderboard[0];
    document.getElementById("2nd").innerHTML = leaderboard[1];
    document.getElementById("3rd").innerHTML = leaderboard[2];
    document.getElementById("4th").innerHTML = leaderboard[3];
    document.getElementById("5th").innerHTML = leaderboard[4];
    document.getElementById("6th").innerHTML = leaderboard[5];
    document.getElementById("7th").innerHTML = leaderboard[6];
    document.getElementById("8th").innerHTML = leaderboard[7];
    document.getElementById("9th").innerHTML = leaderboard[8];
    document.getElementById("10th").innerHTML = leaderboard[9];
  }


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
    ctx.beginPath();
    ctx.fillStyle = '#353551';
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          ctx.fillRect((bricks[c][r].x), (bricks[c][r].y), blockWidth, blockHeight);
        }
      }
      ctx.closePath();

    }
  }

  function createBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] =
          {
            x: (c * (blockWidth + brickPaddingSide)) + brickOffSetLeft,
            y: (r * (blockHeight + brickPaddingVertical)) + brickOffSetTop,
            status: 1
          };
      }
    }
  }

  //default positions for the game
  function resetGame() {
    x = canvas.width / 2;
    y = canvas.height - 60;
    dx = 2;
    dy = -2;
    launchPadX = (canvas.width - blockWidth) / 2;

    createBricks()

    score = 0;

  }

  //detecting when sprite is in the space of a brick;
  function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];

        if (x > b.x && x < (b.x + blockWidth) && y > b.y && y < (b.y + blockHeight)) {
          dy = -dy;
          b.status = 0;
          score += 5;
        };
      };
    };
  };

  //draw: running the game 
  function draw() {
    console.log('DIRECTION', y + dy > canvas.height - 30);
    ctx.clearRect(0, 0, 480, 320);
    drawSprite();
    drawLaunchPad();
    drawBricks();
    updateScore();
    if (gameRunning == false) { return; };
    x += dx;
    y += dy;

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
        ctx.drawImage(gameOver, 0, 0, 480, 320);
        updateLeaderBoard();
        gameRunning = false;
        clearInterval(interval)
        setTimeout(function () { interval = setInterval(draw, 10); }, 5000)
        resetGame();
      };
    };

    collisionDetection();
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
  var interval = setInterval(draw, 10);
};