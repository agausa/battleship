//******************************************************************************
//
//  app.js
//
//  Copyright Blue Point Studios, Inc. 2017
//******************************************************************************

// G L O B A L S

var gGridWidth = 30;
var gGridHeight = 30;

var gGridSize = 10;

var gLayoutMap = new Array();         // map to keep ship's layout with extra borders
var gPlayerLeftHitMap = new Array();  // keep hit map to perevent double hit

var gAI = new AI();

var gUserID = gAI.random(0, 0x6FFFFFFF);

var gSunkShips = 0;

// old below

var gWindowWidth = 505;
var gImageWidth = 101;

var gGridStepX = 101;
var gGridStepY = 82;

var gSpriteWidth = 80;
var gSpriteHeight = 50;

var gGridYOffset = -2;

var gHost = 'localhost'; // www.bluepointstudios.com

// Enemies our player must avoid
var Enemy = function(speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/grid_cross.png';

    this.width = gSpriteWidth;   // image size
    this.height = gSpriteHeight;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed*dt;

    // check borders
    if(this.x > gWindowWidth)
      this.x = -gImageWidth;
};

// reset position
Enemy.prototype.reset = function(x, y){
  this.x = x;
  this.y = y;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
  this.sprite = 'images/grid_cross.png';

  this.width = gSpriteWidth;   // image size
  this.height = gSpriteHeight;
};

// reset position
Player.prototype.reset = function(x, y){
  this.x = x;
  this.y = y;
}

Player.prototype.update = function(dt){
  // we can do character anoimation here...
};

Player.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(e){
  console.log(e);
  if(e == 'up'){
    if(this.y - gGridStepY >= gGridYOffset)
    this.y -= gGridStepY;

    // control the end of the game
    if (this.y == gGridYOffset)
    {
      this.sprite = 'images/grid_cross.png';
      // resetTheGame();
    }
  }
  else if(e == 'down'){
    if(this.y + gGridStepY <= 5*gGridStepY)
      this.y += gGridStepY;
  }
  else if(e == 'left'){
    if(this.x - gGridStepX >= 0)
    this.x -= gGridStepX;
  }
  else if(e == 'right'){
    if(this.x + gGridStepX <= 4*gGridStepX)
    this.x += gGridStepX;
  }
};

// check for collisions
function checkCollisions()
{
  allEnemies.forEach(function(enemy) {
    if(player.x  < (enemy.x + enemy.width) && (player.x + player.width) > enemy.x &&
      player.y < (enemy.y + enemy.height) && (player.y + player.height) > enemy.y)
      {
        console.log('Collision!');
        resetTheGame();
      }
  });
};

// reset game parameters
function resetTheGame(){

    // reset placement map
    for(var i = 0; i < gGridSize*gGridSize; i++){
      gLayoutMap[i] = 0;
      gPlayerLeftHitMap[i] = 0;
    }

    console.log('map reset!');

    getEnemyId(gUserID);

    // start pooling server
    poolEnemyMessage(gUserID);

    $('#userid').text(gUserID);

    gSunkShips = 0;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// add mouse click handler
var canvas = document.getElementById("battlefield");
canvas.addEventListener('mousedown', function(e) {
  var x = Math.floor((e.layerX - gFieldSize - gSpaceBetween)/gGridWidth);
  var y = Math.floor(e.layerY/gGridWidth);

  console.log('click at: ' + x + ', ' + y);
  //alert('click at: ' + x + ', ' + y);

  if(x < 0){
    alert('Please play on enemy field!');
    return;
  }

  var index = y*gGridWidth + x;

  // if we hit it before - just exit
  if(gPlayerLeftHitMap[index]){
    console.log('already hit - just exit');
    return;
  }

  // test hit
  var bRet = 0;

  // send request to server
  var request = 'http://'+ gHost + '/battleship/php/index.php?method=postmessage&id='+ gUserID + '&x=' + x + '&y=' + y;
  //alert(request);
  $.ajax({
    url:request,
    success:function(response){
        // alert(response);
        // var response = JSON.parse(responseJSON);
      }
  }).error(function(e){
    alert(e.responseText);
  });

  // mark the field
  if(bRet == 0)
    ctx.drawImage(Resources.get('images/grid_cross.png'), gFieldSize + gSpaceBetween + x * gCellWidth, y * gCellWidth);
  else{
    var damaged = new Sprite(x, y, 'images/grid_red_cross.png', false);
    allEnemies.push(damaged);

    //ctx.drawImage(Resources.get('images/grid_red_cross.png'), gFieldSize + gSpaceBetween + x * gCellWidth, y * gCellWidth);
  }

  // mark the hit map
  gPlayerLeftHitMap[index] = 1;
});

resetTheGame();


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = new Array();


var horizontal;
var position;

// 4

horizontal = gAI.random(0, 1);
position = gAI.getRandomPosition(4, horizontal, gLayoutMap);
var ship4x1 = new Ship(position.left, position.top, horizontal, 4);
allEnemies.push(ship4x1);
ship4x1.markOnMap(gLayoutMap);

// 3

horizontal = gAI.random(0, 1);
position = gAI.getRandomPosition(3, horizontal, gLayoutMap);
var ship3x1 = new Ship(position.left, position.top, horizontal, 3);
allEnemies.push(ship3x1);
ship3x1.markOnMap(gLayoutMap);

horizontal = gAI.random(0, 1);
position = gAI.getRandomPosition(3, horizontal, gLayoutMap);
var ship3x2 = new Ship(position.left, position.top, horizontal, 3);
allEnemies.push(ship3x2);
ship3x2.markOnMap(gLayoutMap);

// 2

horizontal = gAI.random(0, 1);
position = gAI.getRandomPosition(2, horizontal, gLayoutMap);
var ship2x1 = new Ship(position.left, position.top, horizontal, 2);
allEnemies.push(ship2x1);
ship2x1.markOnMap(gLayoutMap);

horizontal = gAI.random(0, 1);
position = gAI.getRandomPosition(2, horizontal, gLayoutMap);
var ship2x2 = new Ship(position.left, position.top, horizontal, 2);
allEnemies.push(ship2x2);
ship2x2.markOnMap(gLayoutMap);

horizontal = gAI.random(0, 1);
position = gAI.getRandomPosition(2, horizontal, gLayoutMap);
var ship2x3 = new Ship(position.left, position.top, horizontal, 2);
allEnemies.push(ship2x3);
ship2x3.markOnMap(gLayoutMap);

// 1

horizontal = gAI.random(0, 1);
position = gAI.getRandomPosition(1, horizontal, gLayoutMap);
var ship1x1 = new Ship(position.left, position.top, horizontal, 1);
allEnemies.push(ship1x1);
ship1x1.markOnMap(gLayoutMap);

horizontal = gAI.random(0, 1);
position = gAI.getRandomPosition(1, horizontal, gLayoutMap);
var ship1x2 = new Ship(position.left, position.top, horizontal, 1);
allEnemies.push(ship1x2);
ship1x2.markOnMap(gLayoutMap);

horizontal = gAI.random(0, 1);
position = gAI.getRandomPosition(1, horizontal, gLayoutMap);
var ship1x3 = new Ship(position.left, position.top, horizontal, 1);
allEnemies.push(ship1x3);
ship1x3.markOnMap(gLayoutMap);

horizontal = gAI.random(0, 1);
position = gAI.getRandomPosition(1, horizontal, gLayoutMap);
var ship1x4 = new Ship(position.left, position.top, horizontal, 1);
allEnemies.push(ship1x4);
ship1x4.markOnMap(gLayoutMap);

var player = new Player();

//________________________________ poolEnemyMessage ___________________________

function poolEnemyMessage(id){
  //alert('pool');

  setTimeout(function(){

    // send request to server
    var request = 'http://' + gHost + '/battleship/php/index.php?method=getmessage&id=' + id;
    //alert(request);
    $.ajax({
      url:request,
      success:function(responseJSON){
          if(responseJSON != null && responseJSON.length > 0){ // not empty result

            var response = JSON.parse(responseJSON);
            var x = parseInt(response[0].x);
            var y = parseInt(response[0].y);
            var reply = parseInt(response[0].reply);
            var result = parseInt(response[0].result);

            if(reply){
              // alert(responseJSON);

              // mark on enemy field
              var damaged = new Sprite(x, y, 'images/grid_red_cross.png', true);
              allEnemies.push(damaged);
              if(result == 2){
                alert('Sunk!');
                gSunkShips++;
                if(gSunkShips == 10)
                  alert('G A M E   O V E R !');
              }
              else
                alert('Hit!');
            } else {
              var bRet = enemyHit(x, y);

              // mark the field
              if(bRet == 0)
                ctx.drawImage(Resources.get('images/grid_cross.png'), x * gCellWidth, y * gCellWidth);
              else {
                // mark on our field
                var damaged = new Sprite(x, y, 'images/grid_red_cross.png');
                allEnemies.push(damaged);

                // send message to enemy with result
                var request = 'http://' + gHost + '/battleship/php/index.php?method=postmessage&id='+ gUserID + '&x=' + x + '&y=' + y + '&result=' + bRet;
                $.ajax({
                  url:request,
                  success:function(response){
                    }
                }).error(function(e){
                  alert(e.responseText);
                });
              }
            }
          }
        }
    }).error(function(e){
      alert(e.responseText);
    });

    $('#userid').text(id);

    poolEnemyMessage(id);
  }, 1000);
}

//________________________________ getEnemyId _________________________________

function getEnemyId(id){
  var request = 'http://' + gHost + '/battleship/php/index.php?method=getenemyid&id=' + id;
  //alert(request);
  $.ajax({
    url:request,
    success:function(responseJSON){
        if(responseJSON != null && responseJSON.length > 0){ // not empty result
          var response = JSON.parse(responseJSON);
          alert('Your enemy is: ' + response.userA);
        }
        else{ // we need to wait till enemy will show up
          alert('No enemy available yet - will wait...')
          setTimeout(wait4enemy, 500);
        }
      }
  }).error(function(e){
    alert(e.responseText);
  });
}

//________________________________ wait4enemy _________________________________

function wait4enemy(){
  var request = 'http://' + gHost + '/battleship/php/index.php?method=waitenemyid&id=' + gUserID;
  //alert(request);
  $.ajax({
    url:request,
    success:function(responseJSON){
        console.log(responseJSON);
        if(responseJSON != null && responseJSON.length > 0){ // not empty result
          var response = JSON.parse(responseJSON);

          if(response.userB == null) // wait more
            setTimeout(wait4enemy, 500);
          else
            alert('Your enemy: ' + response.userB + ' just join the GAME!');
        }
      }
  }).error(function(e){
    alert(e.responseText);
  });
}

//________________________________ enemyHit ___________________________________

function enemyHit(x, y){
  var bRet = false;
  for(var i = 0; i < allEnemies.length; i++){
    bRet = allEnemies[i].IsHit(x,y);
    if(bRet == 1){
      // alert('hit!');
      break;
    }
    else if(bRet == 2){
      //  alert('sunk!');
      break;
    }
  }
  return bRet;
};
