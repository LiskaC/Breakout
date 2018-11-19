window.onload = function () {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d")
  var x;
  var y;
  var dx;
  var dy;
  var robot = new Image();
  robot.src = 'images/2drobo.png';


  var launchPadWidth = 50;
  var launchPadHeight = 10;
  var launchPadX;

  var gameRunning = false;
  document.getElementById("startBtn").onclick = function () {
    if (gameRunning == true) return;
    gameRunning = true;
  }

  function drawRobot() {
    ctx.drawImage(robot, x - 15, y, 30, 30);
  };

  function drawLaunchPad() {
    ctx.beginPath();
    ctx.fillStyle = '#353551';
    ctx.fillRect(launchPadX, (canvas.height - launchPadHeight - 20), launchPadWidth, launchPadHeight);
    ctx.closePath();
  };

  function resetGame() {
    x = canvas.width / 2;
    y = canvas.height - 60;
    dx = 2;
    dy = -2;
    launchPadX = (canvas.width - launchPadWidth) / 2;
  }

  function draw() {
    console.log(y + dy > canvas.height - 30);
    ctx.clearRect(0, 0, 480, 320);
    drawRobot();
    drawLaunchPad();
    if (gameRunning == false) { return; };
    x += dx;
    y += dy;

    //hits the sides and top, changes direction
    if (x + dx < 10 || x + dx > canvas.width) {
      dx = -dx;
    };
    if (y + dy < 0) {
      dy = -dy;
    }

    //hits the launchPad, changes direction
    else if (y + dy > canvas.height - 60) {
      if (x > launchPadX && x < launchPadX + launchPadWidth) {
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

  resetGame();
  setInterval(draw, 10);
};