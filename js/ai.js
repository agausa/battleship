//******************************************************************************
//
//  ship.js
//
//  Copyright Blue Point Studios, Inc. 2017
//******************************************************************************

function AI(){

};

//________________________________ random _____________________________________

AI.prototype.random = function(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//________________________________ getRandomPosition __________________________

AI.prototype.getRandomPosition = function(size, horizontal, map){
  var x;
  var y;

  var index = 0;

  do{
    x = this.random(0, 9);
    y = this.random(0, 9);
  }while(!this.testPosition(x, y, size, horizontal, map))

  return{left:x, top:y};
};

//________________________________ testPosition _______________________________

AI.prototype.testPosition = function(x, y, size, horizontal, map){

  console.log('x: ' + x + ' y: ' + y + ' size: ' + size + ' horizontal: ' + horizontal);
  // test if it will fit horizontally
  if(horizontal){
    if( x + size > gGridSize) return false;
  }else{
    // test if it will fit vertically
    if(y + size > gGridSize) return false;
  }

  // test map
  var i = 0;
  if(horizontal){
    for(i = 0; i < size; i++){
      if(this.test1x1Position(x + i, y, map)){
        console.log('position x: ' + (x + i) + ' taken');
        return false;
      }
    }
  }else{
    for(i = 0; i < size; i++){
      if(this.test1x1Position(x, y + i, map)){
        console.log('position y: ' + (y + i) + ' taken');
        return false;
      }
    }
  }

  return true;
}

//________________________________ test1x1Position ____________________________

AI.prototype.test1x1Position = function(x, y, map){
  return map[y*gGridSize + x];
}
