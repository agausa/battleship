//******************************************************************************
//
//  sprite.js
//
//  Copyright Blue Point Studios, Inc. 2017
//******************************************************************************

function Sprite(x, y, image, enemy){
  this.x = x;
  this.y = y;

  if(enemy){
    this.drawX = gFieldSize + gSpaceBetween + x * gCellWidth;
    this.drawY = y * gGridWidth;
  } else {
    this.drawX = x * gGridWidth;
    this.drawY = y * gGridWidth;

  }

  this.sprite = image;
}

//________________________________ render _____________________________________

// Draw the enemy on the screen, required method for game
Sprite.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.drawX, this.drawY);
};

//________________________________ Virtual functions __________________________

Sprite.prototype.IsHit = function(x, y){
  return false;
}

Sprite.prototype.update = function(dt) {
};

Sprite.prototype.reset = function(x, y){
};
