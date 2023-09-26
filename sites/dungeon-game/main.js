import { Images } from "./lib/BetterImage.js";
import { MapLoader } from "./lib/mapLoader.js";
import { TilesetLoader } from "./lib/TilesetLoader.js";
import { Tiles } from "./lib/tiles.js";

var imageAssets = new Images(["./TILED/TILESET/bricks.db32.png", "./player.png"]);

/**
 * @type { Tiles }
 */

var MainLayer;

var stsize = 50;

var keys = 0;

var frame = 0;

var enemys;

/**
 * @type { HTMLCanvasElement }
 */
var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");

var gameover = false;

var health = 100;

function drawGAMEOVER() {
    
}

function resize() {
    
    document.body.style.overflow = "hidden"
    document.body.style.padding = "0px";
    document.body.style.margin = "0px";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight+1;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx.imageSmoothingEnabled = false;
}
function drawPlayer(x,y,width,height, velX, velY) {
    
    
    if(velX>0){frame=2}
    if(velX<0){frame=3}
    if(velY<0){frame=1}
    if(velY>0){frame=0}
    
    ctx.drawImage(imageAssets.files[1], 32*frame, 0, 32, 32, x, y, width, height);
}
function printKeys(font) {
    ctx.font = "50px " + font;
    ctx.fillText(`keys: ` + keys, 50, 90, 140);
}
function checkfortile(posX,posY) {
    switch(frame) {
        case 1:
            return {tile:MainLayer.map.getTile(Math.floor((posX)/50), Math.floor((posY)/50)-1), index:MainLayer.map.getTileIndex(Math.floor((posX)/50), Math.floor((posY)/50)-1)};
            break;
        case 0:
            return {tile:MainLayer.map.getTile(Math.floor((posX)/50), Math.floor((posY)/50)+1), index:MainLayer.map.getTileIndex(Math.floor((posX)/50), Math.floor((posY)/50)+1)};
            break;
        case 2:
            return {tile:MainLayer.map.getTile(Math.floor((posX)/50)+1, Math.floor((posY)/50)), index:MainLayer.map.getTileIndex(Math.floor((posX)/50)+1, Math.floor((posY)/50))};
            break;
        case 3:
            return {tile:MainLayer.map.getTile(Math.floor((posX)/50)-1, Math.floor((posY)/50)), index:MainLayer.map.getTileIndex(Math.floor((posX)/50)-1, Math.floor((posY)/50))};
            break;
    }
}

var GMKeys = {};

var player = {
    x: 16*8,
    y: 16*7,
    speed: 10,
    velX:0,
    velY:0,
    update(){
        
        this["d"] == false ? player.velX= 0 : null;
        
        this["a"] == false ? player.velX= 0 : null;
        
        this["w"] == false ? player.velY= 0 : null;
        
        this["s"] == false ? player.velY= 0 : null;
        
        
        this["d"] == true ? player.velX= player.speed : null;
        
        this["a"] == true ? player.velX= -player.speed : null;
        
        this["w"] == true ? player.velY= -player.speed : null;
        
        this["s"] == true ? player.velY= player.speed : null;
        
        MainLayer.map.getTile(Math.floor((player.x+player.velX)/stsize), Math.floor(player.y/stsize)) != MainLayer.emptyTile ? null : player.x+=player.velX;
        
        MainLayer.map.getTile(Math.floor((player.x)/stsize), Math.floor((player.y+player.velY)/stsize)) != MainLayer.emptyTile ? null : player.y+=player.velY;
        
        
        
        ctx.fillStyle = "green"
        
        drawPlayer((canvas.width/2)-(32/2),(canvas.height/2)-(32/2), 32, 32,player.velX,player.velY)
        
    }
}
player.update = player.update.bind(GMKeys);

function events() {
    var data = checkfortile(player.x,player.y);
    if(GMKeys["e"] == true && data.tile == 23){
        keys++;
        MainLayer.tilemap[data.index] = 36;
    } else if(data.tile == 23) {
        ctx.font = "50px serif";
        ctx.fillText(`press 'e' to open chest`, 50, canvas.height-90, 240);
        
    }
    if(GMKeys["e"] == true && data.tile == 21 && keys>0) {
        MainLayer.tilemap[data.index] = MainLayer.emptyTile+1;
        keys--;
    }else if(data.tile == 21 && keys>0) {
        ctx.font = "50px serif";
        ctx.fillText(`press 'e' to unlock the door`, 50, canvas.height-90, 240);
        
    }
    
}

async function init() {
    
    
    resize();
    
    ctx.imageSmoothingEnabled = false;
    
    let map = await new MapLoader().parse("./TILED/MAPS/1.json");
    
    enemys;
    
    let tilesetData = await new TilesetLoader().parse("./TILED/TILESET/dungeon.json");
    
    await imageAssets.load();
    
    MainLayer = new Tiles(map, canvas, imageAssets.files[0], tilesetData, 13);
    
    gameloop();
    
}

function gameloop() {
    
    resize();
    
    MainLayer.camera.x = player.x-(window.innerWidth/2);
    MainLayer.camera.y = player.y-(window.innerHeight/2)
    
    MainLayer.render(ctx,stsize);
    
    player.update();
    
    events();
    
    printKeys("serif");
    
    requestAnimationFrame(gameloop);
    
}

init();

document.addEventListener("click", (e)=>{
    
    
});
document.addEventListener("keydown", (e)=>{
    
    GMKeys[e.key] = true;
    
});
document.addEventListener("keyup", (e)=>{
    
    GMKeys[e.key] = false;
    
});