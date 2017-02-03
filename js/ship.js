//******************************************************************************
//
//  ship.js
//
//  Copyright Blue Point Studios, Inc. 2017
//******************************************************************************

function Ship(x, y, horizontal, size){
  this.x = x;
  this.y = y;

  this.drawX = x * gGridWidth;
  this.drawY = y * gGridWidth;

  this.horizontal = horizontal;
  this.size = size;

  this.hitCount = 0;  // how many time got hit
  this.sunk = false;  // sunk or afloat

  if(size == 1)
    this.sprite = 'images/ship1x1.png';
  else if(size == 2){
    if(horizontal == true)
      this.sprite = 'images/ship2x1.png';
    else
      this.sprite = 'images/ship1x2.png';
  }
  else if(size == 3){
    if(horizontal == true)
      this.sprite = 'images/ship3x1.png';
    else
      this.sprite = 'images/ship1x3.png';
  }
  else if(size == 4){
    if(horizontal == true)
      this.sprite = 'images/ship4x1.png';
    else
      this.sprite = 'images/ship1x4.png';
  }
};

Ship.prototype.update = function(dt) {
};

Ship.prototype.reset = function(x, y){
};

//________________________________ render _____________________________________

// Draw the enemy on the screen, required method for game
Ship.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.drawX, this.drawY);
};

//________________________________ mark1x1 ____________________________________

Ship.prototype.mark1x1 = function(map, x, y){
  var index = y*gGridSize + x;
  if(index < gGridSize*gGridSize)
    map[y*gGridSize + x] = 1;
}

//________________________________ markOnMap __________________________________

Ship.prototype.markOnMap = function(map){
  if(this.size == 1)
    this.markOnMapAround1x1(map, this.x, this.y);
  else if(this.size == 2){
    if(this.horizontal){
      this.markOnMapAround1x1(map, this.x, this.y);
      this.markOnMapAround1x1(map, this.x + 1, this.y);
    }
    else{
      this.markOnMapAround1x1(map, this.x, this.y);
      this.markOnMapAround1x1(map, this.x, this.y + 1);
    }
  }
  else if(this.size == 3){
    if(this.horizontal){
      this.markOnMapAround1x1(map, this.x, this.y);
      this.markOnMapAround1x1(map, this.x + 1, this.y);
      this.markOnMapAround1x1(map, this.x + 2, this.y);
    }
    else{
      this.markOnMapAround1x1(map, this.x, this.y);
      this.markOnMapAround1x1(map, this.x, this.y + 1);
      this.markOnMapAround1x1(map, this.x, this.y + 2);
    }
  }
  else if(this.size == 4){
    if(this.horizontal){
      this.markOnMapAround1x1(map, this.x, this.y);
      this.markOnMapAround1x1(map, this.x + 1, this.y);
      this.markOnMapAround1x1(map, this.x + 2, this.y);
      this.markOnMapAround1x1(map, this.x + 3, this.y);
    }
    else{
      this.markOnMapAround1x1(map, this.x, this.y);
      this.markOnMapAround1x1(map, this.x, this.y + 1);
      this.markOnMapAround1x1(map, this.x, this.y + 2);
      this.markOnMapAround1x1(map, this.x, this.y + 3);
    }
  }
};

//________________________________ markOnMapAround1x1 _________________________

Ship.prototype.markOnMapAround1x1 = function(map, x, y){
    // mark the point itself
    this.mark1x1(map, x, y);

    // start walking around
    this.mark1x1(map, x + 1, y);
    this.mark1x1(map, x + 1, y + 1);
    this.mark1x1(map, x, y + 1);
    this.mark1x1(map, x - 1, y + 1);
    this.mark1x1(map, x - 1, y);
    this.mark1x1(map, x - 1, y - 1);
    this.mark1x1(map, x, y - 1);
    this.mark1x1(map, x + 1, y - 1);
};

//________________________________ IsHit ______________________________________

Ship.prototype.IsHit = function(x, y){
  var bRet = false;
  if(this.size == 1){
    if(this.x == x && this.y == y)
      bRet = true;
  }
  else if(this.size == 2){
    if(this.horizontal){
      if((this.x == x && this.y == y) || (this.x + 1 == x && this.y == y)) bRet = true;
    }
    else{
      if((this.x == x && this.y == y) || (this.x == x && this.y + 1 == y)) bRet = true;
    }
  }
  else if(this.size == 3){
    if(this.horizontal){
      if((this.x == x && this.y == y) || (this.x + 1 == x && this.y == y) || (this.x + 2 == x && this.y == y)) bRet = true;
    }
    else{
      if((this.x == x && this.y == y) || (this.x == x && this.y + 1 == y) || (this.x == x && this.y + 2 == y)) bRet = true;
    }
  }
  else if(this.size == 4){
    if(this.horizontal){
      if((this.x == x && this.y == y) || (this.x + 1 == x && this.y == y) || (this.x + 2 == x && this.y == y) || (this.x + 3 == x && this.y == y)) bRet = true;
    }
    else{
      if((this.x == x && this.y == y) || (this.x == x && this.y + 1 == y) || (this.x == x && this.y + 2 == y) || (this.x == x && this.y + 3 == y)) bRet = true;
    }
  }

  if(bRet){
    this.hitCount++;

    if(this.hitCount == this.size){
      this.sunk = true;
      bRet = 2;// suncked!
      this.setSunkImage();
      console.log(this.size + 'x ship suncked!');
    }
  }
  return bRet;
}

//________________________________ setSunkImage _______________________________

Ship.prototype.setSunkImage = function(){
  if(this.size == 1)
    this.sprite = 'images/ship1x1_sunk.png';
  else if(this.size == 2){
    if(this.horizontal == true)
      this.sprite = 'images/ship2x1_sunk.png';
    else
      this.sprite = 'images/ship1x2_sunk.png';
  }
  else if(this.size == 3){
    if(this.horizontal == true)
      this.sprite = 'images/ship3x1_sunk.png';
    else
      this.sprite = 'images/ship1x3_sunk.png';
  }
  else if(this.size == 4){
    if(this.horizontal == true)
      this.sprite = 'images/ship4x1_sunk.png';
    else
      this.sprite = 'images/ship1x4_sunk.png';
  }
}
