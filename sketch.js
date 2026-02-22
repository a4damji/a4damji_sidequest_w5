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

function preload() {
  bg1 = loadImage(
    "C:\Users\amara\OneDrive\Desktop\a4damji_sidequest_w5\Assets\jellyfish.png",
  );
  bg2 = loadImage(
    "C:\Users\amara\OneDrive\Desktop\a4damji_sidequest_w5\Assets\fish.png",
  );
  bg3 = loadImage(
    "C:\Users\amara\OneDrive\Desktop\a4damji_sidequest_w5\Assets\bufffish.png",
  );
  bg4 = loadImage(
    "C:\Users\amara\OneDrive\Desktop\a4damji_sidequest_w5\Assets\mermaid.png",
  );
  bg5 = loadImage(
    "C:\Users\amara\OneDrive\Desktop\a4damji_sidequest_w5\Assets\shark.png",
  );
}

function preload() {
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

function keyPressed() {
  if (key === "r" || key === "R") {
    const start = worldData.playerStart ?? { x: 300, y: 300, speed: 3 };
    player = new Player(start.x, start.y, start.speed);
  }
}
