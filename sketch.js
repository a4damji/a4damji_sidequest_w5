const VIEW_W = 800;
const VIEW_H = 480;

let worldData;
let level;
let player;

let camX = 0;
let camY = 0;

let bg1;
let bg2;
let bg3;
let bg4;
let bg5;
let gem;
let sub;

function preload() {
  bg1 = loadImage("Assets/jellyfish.png"); // [figure 1]
  bg2 = loadImage("Assets/fish.png"); // [figure 2]
  bg3 = loadImage("Assets/bufffish.png"); // [figure 3]
  bg4 = loadImage("Assets/mermaid.png"); // [figure 4]
  bg5 = loadImage("Assets/shark.png"); // [figure 5]
  gem = loadImage("Assets/gem.png"); // [figure 6]
  sub = loadImage("Assets/sub.png"); // [figure 7]

  worldData = loadJSON("world.json"); // load JSON before setup [web:122]
}

function setup() {
  createCanvas(VIEW_W, VIEW_H);
  textFont("sans-serif");
  textSize(14);

  level = new WorldLevel(worldData);

  const start = worldData.playerStart ?? { x: 300, y: 300, speed: 3 };
  player = new Player(start.x, start.y, start.speed);

  camX = player.x - width / 2;
  camY = player.y - height / 2;
}

function draw() {
  player.updateInput();

  // Keep player inside world
  player.x = constrain(player.x, 0, level.w);
  player.y = constrain(player.y, 0, level.h);

  const hitObstacle = level.checkPlayerObstacleCollision(player);

  if (hitObstacle) {
    if (!level.hitCooldown) {
      level.handleObstacleHit(hitObstacle);
      level.hitCooldown = true;
    }
  } else {
    level.hitCooldown = false;
  }
  // Target camera (center on player)
  let targetX = player.x - width / 2;
  let targetY = player.y - height / 2;

  // Clamp target camera safely
  const maxCamX = max(0, level.w - width);
  const maxCamY = max(0, level.h - height);
  targetX = constrain(targetX, 0, maxCamX);
  targetY = constrain(targetY, 0, maxCamY);

  // Smooth follow using the JSON knob
  const camLerp = level.camLerp; // ← data-driven now
  camX = lerp(camX, targetX, camLerp);
  camY = lerp(camY, targetY, camLerp);

  level.drawBackground();

  push();
  translate(-camX, -camY);
  level.drawWorld();
  player.draw();
  pop();

  level.drawHUD(player, camX, camY);
}
