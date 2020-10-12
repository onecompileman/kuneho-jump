import * as PIXI from 'pixi.js';
import * as p5 from 'p5';

export class Enemy {
  position: any;
  velocity: any;
  textures: PIXI.Texture[] = [];

  size: any;
  app: PIXI.Application;
  container: PIXI.Container;

  sprite: PIXI.AnimatedSprite;

  activeFrameIndex = 0;

  frameCount = 0;
  scale;

  constructor(app, container, position, scale) {
    this.app = app;
    this.container = container;
    this.position = position;
    this.velocity = new p5.Vector(1.5 * scale, 0);
    this.scale = scale;

    for (let i = 1; i <= 8; i++) {
      this.textures.push(
        PIXI.Texture.from(`assets/images/Enemies/e3-${i}.png`)
      );
    }

    this.size = { width: 60 * this.scale, height: 45 * this.scale };

    this.sprite = new PIXI.AnimatedSprite(this.textures);
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
    this.sprite.scale.x = 0.35 * this.scale;
    this.sprite.scale.y = 0.35 * this.scale;
    // this.sprite.width = this.size.width;
    // this.sprite.height = this.size.height;
    this.sprite.anchor.set(0.5);

    this.container.addChild(this.sprite);
    this.sprite.play();
    this.sprite.animationSpeed = 0.1;
  }

  collidesWith(target) {
    const bounds1 = target.sprite.getBounds();
    const bounds2 = this.sprite.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }

  update(delta) {
    if (this.position.x >= this.app.screen.width - this.size.width) {
      this.velocity.x = -1.5 * this.scale;
    } else if (this.position.x <= this.size.width) {
      this.velocity.x = 1.5 * this.scale;
    }
    this.position.add(this.velocity.copy().mult(delta));
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }

  isOutOfBounds() {
    return this.position.y >= this.app.screen.height + this.size.height;
  }

  destroy() {
    this.app.stage.removeChild(this.sprite);
    this.sprite.destroy();
  }
}
