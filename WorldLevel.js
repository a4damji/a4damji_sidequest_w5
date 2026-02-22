class WorldLevel {
  constructor(json) {
    this.schemaVersion = json.schemaVersion ?? 1;

    this.w = json.world?.w ?? 2400;
    this.h = json.world?.h ?? 1600;
    this.bg = json.world?.bg ?? [235, 235, 235];
    this.gridStep = json.world?.gridStep ?? 160;

    this.obstacles = json.obstacles ?? [];

    // NEW: camera tuning knob from JSON (data-driven)
    this.camLerp = json.camera?.lerp ?? 0.12;
    this.hitCooldown = false;

    // Background variants
    this.bgVariants = [bg1, bg2, bg3, bg4, bg5];
  }

  drawBackground() {
    background(220);
  }

  drawWorld() {
    image(this.bg[1], 0, 0);

    noStroke();
    fill(170, 190, 210);
    for (const o of this.obstacles) rect(o.x, o.y, o.w, o.h, o.r ?? 0);
  }

  drawHUD(player, camX, camY) {
    noStroke();
    fill(20);
    text("Ocean Exploration", 12, 20);
    text(
      "camLerp(JSON): " +
        this.camLerp +
        "  Player: " +
        (player.x | 0) +
        "," +
        (player.y | 0) +
        "  Cam: " +
        (camX | 0) +
        "," +
        (camY | 0),
      12,
      40,
    );
  }
  checkPlayerObstacleCollision(player) {
    const playerSize = 24;
    const px = player.x - playerSize / 2;
    const py = player.y - playerSize / 2;

    for (const o of this.obstacles) {
      const hit =
        px < o.x + o.w &&
        px + playerSize > o.x &&
        py < o.y + o.h &&
        py + playerSize > o.y;

      if (hit) return o;
    }

    return null;
  }

  handleObstacleHit(obstacle) {
    // Change background to random preset
    const index = floor(random(this.bgVariants.length));
    this.bg = this.bgVariants[index];

    // Move obstacle to new random position
    obstacle.x = random(100, this.w - 100);
    obstacle.y = random(100, this.h - 100);
  }
}
