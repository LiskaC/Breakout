window.onload = function () {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d")
  var x;
  var y;
  var dx;
  var dy;
  var robot = new Image();
  robot.src = 'images/2dRobo.png';
  var rocket = new Image();
  rocket.src = 'images/rocket.png';
  var gameOver = new Image();
  gameOver.src = 'images/GameOver.png';
  var nextLevel = new Image();
  nextLevel.src = 'images/nextLevel.png';



  var emptyLeaderboard = [
    { user: "", boardscore: "" },
    { user: "", boardscore: "" },
    { user: "", boardscore: "" },
    { user: "", boardscore: "" },
    { user: "", boardscore: "" },
    { user: "", boardscore: "" },
    { user: "", boardscore: "" },
    { user: "", boardscore: "" },
    { user: "", boardscore: "" },
    { user: "", boardscore: "" },
  ];

  drawLeaderboard()

  /*
  todo:
  fix levels
  add sounds (and toggle button)
  add congrats for top high score if array full
  */

  var blockWidth = 50;
  var blockHeight = 10;
  var launchPadX;

  /* var bricksLevel1 = {
    this.ColumnCount: 5;
  }
    var bricksLevel2 = {
    this.ColumnCount: 6;
  }
    var bricksLevel3 = {
    this.ColumnCount: 7;
  }*/

  var brickRowCount = 5;
  var brickColumnCount = 5;
  var brickPaddingVertical = 10;
  var brickPaddingSide = (410 - (brickColumnCount * 50)) / (brickColumnCount - 1);
  var brickOffSetTop = 30;
  var brickOffSetLeft = 30;
  var bricks = [];

  /*everything relating to score: 
  first updating the running score, 
  then storing in highscore array and pushing to table*/
  var score = 0;
  function updateScore() { document.getElementById("incrementingScore").innerHTML = score; };

  var username;

  function drawLeaderboard() {
    var leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    if (!leaderboard) leaderboard = emptyLeaderboard;
    document.getElementById("1stUser").innerHTML = leaderboard[0]["user"];
    document.getElementById("1st").innerHTML = leaderboard[0]["boardscore"];
    document.getElementById("2ndUser").innerHTML = leaderboard[1]["user"];
    document.getElementById("2nd").innerHTML = leaderboard[1]["boardscore"];
    document.getElementById("3rdUser").innerHTML = leaderboard[2]["user"];
    document.getElementById("3rd").innerHTML = leaderboard[2]["boardscore"];
    document.getElementById("4thUser").innerHTML = leaderboard[3]["user"];
    document.getElementById("4th").innerHTML = leaderboard[3]["boardscore"];
    document.getElementById("5thUser").innerHTML = leaderboard[4]["user"];
    document.getElementById("5th").innerHTML = leaderboard[4]["boardscore"];
    document.getElementById("6thUser").innerHTML = leaderboard[5]["user"];
    document.getElementById("6th").innerHTML = leaderboard[5]["boardscore"];
    document.getElementById("7thUser").innerHTML = leaderboard[6]["user"];
    document.getElementById("7th").innerHTML = leaderboard[6]["boardscore"];
    document.getElementById("8thUser").innerHTML = leaderboard[7]["user"];
    document.getElementById("8th").innerHTML = leaderboard[7]["boardscore"];
    document.getElementById("9thUser").innerHTML = leaderboard[8]["user"];
    document.getElementById("9th").innerHTML = leaderboard[8]["boardscore"];
    document.getElementById("10thUser").innerHTML = leaderboard[9]["user"];
    document.getElementById("10th").innerHTML = leaderboard[9]["boardscore"];
  }

  function updateLeaderBoard() {
    var leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    if (!leaderboard) leaderboard = emptyLeaderboard;

    leaderboard.unshift({ user: username, boardscore: score });
    if (leaderboard.length > 10) {
      leaderboard.pop();
    }
    leaderboard.sort(function (a, b) {
      return b["boardscore"] - a["boardscore"];
    });

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    drawLeaderboard()
  }


  var gameRunning = false;

  //checking for object intersects
  function intersect(rect1, rect2) {
    var rect1left = rect1.x
    var rect1top = rect1.y
    var rect1right = rect1.x + rect1.width
    var rect1bottom = rect1.y + rect1.height

    var rect2left = rect2.x
    var rect2top = rect2.y
    var rect2right = rect2.x + rect2.width
    var rect2bottom = rect2.y + rect2.height

    return !(rect1left > rect2right
      || rect1right < rect2left
      || rect1top > rect2bottom
      || rect1bottom < rect2top)
  }

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

  //default positions for the game
  function resetGame() {
    x = canvas.width / 2;
    y = canvas.height - 60;
    dx = 2;
    dy = -2;
    launchPadX = (canvas.width - blockWidth) / 2;

    createBricks()

  }

  /*
    function levelUp() {
      var statusCount = 0
  
      for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
          var b = bricks[c][r];
          statusCount += b.status
        };
      };
  
      if (statusCount === 0) {
        ctx.drawImage(nextLevel, 0, 0, 480, 320);
        gameRunning = false;
        clearInterval(interval)
        setTimeout(function () { interval = setInterval(draw, 13); }, 3000)
        if (brickColumnCount < 7) {
          brickColumnCount += 1;
          //for some reason the padding isnt updating
        };
        resetGame();
      };
    };
    */



  //detecting when sprite is in the space of a brick;
  function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];

        if (b.status == 1) {
          if (intersect({ x: x, y: y, width: 30, height: 30 }, { x: b.x, y: b.y, width: blockWidth, height: blockHeight })) {
            dy = -dy;
            b.status = 0;
            score += 5;
          };
        }
      };
    };
    // levelUp();
  };


  //draw: running the game 
  function draw() {
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
      if (intersect({ x: x, y: y, width: 30, height: 20 },
        { x: launchPadX, y: (canvas.height - blockHeight - 40), width: blockWidth, height: blockHeight })) {
        dy = -dy;
      }

      //hits the bottom, game over and back to starting position
      else if (y + dy > canvas.height - 30) {
        ctx.drawImage(gameOver, 0, 0, 480, 320);
        updateLeaderBoard();
        gameRunning = false;
        clearInterval(interval)
        setTimeout(function () { interval = setInterval(draw, 13); }, 2000)
        resetGame();
        score = 0;
      };
    };

    collisionDetection();
  };



  //launchPad moves left/right
  document.onkeydown = function (e) {
    if (gameRunning == false) { return; };
    switch (e.keyCode) {
      case 37:
        if (launchPadX > 0) { launchPadX -= 10 }; break;
      case 39:
        if (launchPadX < canvas.width - blockWidth) { launchPadX += 10 }; break;
    };
  };


  document.getElementById("startBtn").onclick = function () {
    if (gameRunning == true) {
      gameRunning = false;
      resetGame();
    };

    var userInputs = document.getElementById("declareUsername").elements;
    var usernameInput = userInputs[0]["value"];
    function updateUsername() { username = usernameInput };
    updateUsername();

    if (username == "") {
      alert("DECLARE YOURSELF!");
      return;
    } else {
      document.getElementById("currentUser").innerHTML = (usernameInput + "'s");
      gameRunning = true;
    };
  };

  resetGame();
  var interval = setInterval(draw, 13);
};


/* if gamerunning = false can we clear interval 
and set interval when the start button is clicked?*/