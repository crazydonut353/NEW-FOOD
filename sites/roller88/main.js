import { MapLoader } from "./mapLoader.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('gameCanvas');
canvas.width = 512;
canvas.height = 448;
const ctx = canvas.getContext('2d');
const maploader = new MapLoader();
var fallMap;
var tilemap = [
  0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 0, 0, 0, 2, 2, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1,
  1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1,
  1, 1, 1, 1, 1,0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1]

var numRows = 14;
var numColumns = 16;
const test = true;
var keydown = {"w" : false,"a" : false,"s" : false,"d" : false,}
const gravity = {
  x:-0,
  y:0.5
}
var map;


var player;
var camera;
const tileAtlas = new Image();
const playerImage = new Image();
const tile2 = new Image();
//tile2.src = "https://www.formica.com/en-gb/-/media/formica/emea/products/swatch-images/f2828/f2828-swatch.jpg?rev=75a73ba0f8334b929b1e262aca41fd19"
tileAtlas.onload = function() {
  playerImage.onload = init();
  playerImage.src = "Bababooey.png"
};
tileAtlas.src = 'tileAtlas (2).png';
async function init() {
  
  fallMap = await maploader.parse("./fall_map.json");
  numColumns = fallMap.width;
  numRows = fallMap.height;
  tilemap = fallMap.data;
  console.log(fallMap.data, tilemap)
  function getTile(c, r) {
    if(c>=numColumns || c<0 || r < 0){return 2}
      const index = r * numColumns + c;
      return fallMap.data[index]-1;
    }
    
  map = {
    tsize: 32,
    getTile: getTile
  };
  
  player = {
    x: 32*15, 
    y: 0-100,
    width: 32,
    height: 64,
    jumpHeight:17,
    velocity: {x:0,y:0},
    update:function(){
      //                             collision script
      //psudo code:
      // if point y intersect (move y) else if point x intersect (move x)
      //else, repeat for next point
            this.x+=this.velocity.x;
      this.y+=this.velocity.y;
      let startCol = Math.floor((this.x)/map.tsize);
      let endCol = Math.floor((this.x+this.width)/map.tsize);
      for(let i = startCol; i < endCol; i++) {
        if(map.getTile(i, Math.floor((this.y+this.height)/map.tsize))!=2) {
          this.y=((Math.floor((player.y)/map.tsize))*map.tsize);
          this.velocity.y = 0;
          
          keydown["w"] ? this.velocity.y -= this.jumpHeight : null;
          keydown["d"] ? this.velocity.x += 4 : null;
          keydown["a"] ? this.velocity.x -= 4 : null;
          this.velocity.x *= 0.8;
        } else {
          keydown["d"] ? this.velocity.x += 4 : null;
          keydown["a"] ? this.velocity.x -= 4 : null;
          this.velocity.x *= 0.8;
          this.velocity.y+=gravity.y;
        }
      }
      let startRow = Math.floor(this.y/map.tsize);
      let endRow = Math.floor((this.y+this.height)/map.tsize);
      //console.log(startRow + "  :  " + endRow)
      for(let i = startRow; i < endRow; i++) {
        if(map.getTile(Math.floor((this.x)/map.tsize), i)!=2) {
          this.x=((Math.ceil((player.x)/map.tsize))*map.tsize);
          this.velocity.x = 0;
        }
      }
      
      startCol = Math.floor((this.x)/map.tsize);
      endCol = Math.floor((this.x+this.width)/map.tsize);
      
      for(let i = startCol; i < endCol; i++) {
        if(map.getTile(i, Math.floor((this.y)/map.tsize))!=2){
          this.y=((Math.ceil((player.y)/map.tsize))*map.tsize);
          this.velocity.y = 0;
        }
      }
      
      startRow = Math.floor(this.y/map.tsize);
      endRow = Math.floor((this.y+this.height)/map.tsize);
      
      for(let i = startRow; i < endRow; i++){
        if(map.getTile(Math.floor((this.x+this.width)/map.tsize), i)!=2) {
          this.x=((Math.floor((player.x)/map.tsize))*map.tsize);
          this.velocity.x = 0;
          keydown["a"] ? this.velocity.x -= 4 : null;
        }
      }
      
      /*
      this.y=((Math.floor((player.y)/map.tsize))*map.tsize);
      this.velocity.y = 0;
      
      keydown["w"] ? this.velocity.y -= this.jumpHeight : null;
      keydown["d"] ? this.velocity.x += 4 : null;
      keydown["a"] ? this.velocity.x -= 4 : null;
      this.velocity.x *= 0.8;*/
      

    }
  }
  camera = {
    x: (-numColumns/2)*map.tsize,
    y: (-numRows/2)*map.tsize,
    width: 800,
    height: 608,
    update:function(){
      let movedPlayer = {x:player.x-(canvas.width/2),y:player.y-(canvas.height/2)}
      this.x+=Math.ceil((movedPlayer.x-this.x)/20);
      this.y+=Math.ceil((movedPlayer.y-this.y)/20);
    }
  };
  document.addEventListener("keydown", (e) => {
    keydown[e.key] = true;
  })
  document.addEventListener("keyup", (e) => {
    keydown[e.key] = false
  })
  console.log(fallMap)
  renderGame();
}
function renderGame() {
ctx.clearRect(0,0,canvas.width,canvas.height);
  const startCol = Math.floor(camera.x / map.tsize);
  const endCol = (startCol + camera.width / map.tsize);
  const startRow = Math.floor(camera.y / map.tsize);
  const endRow = startRow + camera.height / map.tsize;
  const offsetX = -camera.x + startCol * map.tsize;
  const offsetY = -camera.y + startRow * map.tsize;

  for (let c = startCol; c <= endCol; c++) {
    for (let r = startRow; r <= endRow; r++) {
      const tile = map.getTile(c, r);
      const x = (c - startCol) * map.tsize + offsetX;
      const y = (r - startRow) * map.tsize + offsetY;
      
  ctx.drawImage(
    tileAtlas,
    (tile % 3) * map.tsize,
    Math.floor(tile/3) * map.tsize,
    map.tsize,
    map.tsize,
    Math.round(x),
    Math.round(y), 
    map.tsize,
    map.tsize 
  );

    }
  }
  player.update();
  camera.update();
  ctx.fillText(`player x: ${player.x}, player y: ${player.y}`,0,8)
  ctx.drawImage(playerImage,player.x-camera.x,player.y-camera.y,player.width,player.height)

  requestAnimationFrame(renderGame)
}
