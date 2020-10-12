import * as PIXI from 'pixi.js';
import * as p5 from 'p5';

export class Coin {
  position: any;
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
    this.scale = scale;

    for (let i = 1; i <= 6; i++) {
      this.textures.push(
        PIXI.Texture.from(`assets/images/Items/gold_${i}.png`)
      );
    }

    this.size = { width: 32 * this.scale, height: 32 * this.scale };

    this.sprite = new PIXI.AnimatedSprite(this.textures);
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
    this.sprite.width = this.size.width;
    this.sprite.height = this.size.height;
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
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
    this.sprite.update(delta);
  }

  isOutOfBounds() {
    return this.position.y >= this.app.screen.height + this.size.height;
  }

  destroy() {
    this.app.stage.removeChild(this.sprite);
    this.sprite.destroy();
  }
}
