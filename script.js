window.onload = function () {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d")
  var x = canvas.width / 2;
  var y = canvas.height - 60;
  var dx = 2;
  var dy = -2;


  var launchPadWidth = 50;
  var launchPadHeight = 10;
  var launchPadX = (canvas.width - launchPadWidth) / 2;

  var gameStarted = false;
  document.getElementById("startBtn").onclick = function () {
    if (gameStarted == true) return;
    startGame();
    gameStarted = true;
  }

  function drawRobot() {
    var robot = new Image();
    robot.onload = function () {
      ctx.drawImage(robot, x - 15, y, 30, 30);
    }
    robot.src = 'images/2drobo.png';
  };
  drawRobot()

  function drawLaunchPad() {
    ctx.beginPath();
    ctx.fillStyle = '#353551';
    ctx.fillRect(launchPadX, (canvas.height - launchPadHeight - 20), launchPadWidth, launchPadHeight);
    ctx.closePath();
  };
  drawLaunchPad();

  function startGame() {

    function draw() {
      console.log(y + dy > canvas.height - 30);
      ctx.clearRect(0, 0, 480, 320);
      drawRobot();
      drawLaunchPad();
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
          ctx.clearRect(0, 0, 480, 320);
          /*save these in a 'default'/'reset' variable? 
          gameStarted switch to false and toggle when start button reclicked */
          x = canvas.width / 2;
          y = canvas.height - 60;
          launchPadX = (canvas.width - launchPadWidth) / 2;
          dy = -2;
        };
      };

      //launchPad moves left/right
      document.onkeydown = function (e) {
        switch (e.keyCode) {
          case 37: launchPadX -= 10; break;
          case 39: launchPadX += 10; break;
        }
      };
    };

    setInterval(draw, 10);
  };
};