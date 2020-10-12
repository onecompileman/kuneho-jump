import * as PIXI from 'pixi.js';
import * as p5 from 'p5';

export class Player {
  standTexture: PIXI.Texture;
  jumpTexture: PIXI.Texture;
  position: any;
  velocity: any;
  acceleration: any;
  gravity: any;
  size: any;
  sprite: any;

  app: PIXI.Application;
  container: PIXI.Container;

  isCollided: boolean;

  scale;

  constructor(app, container, scale) {
    this.app = app;
    this.container = container;
    this.scale = scale;

    this.standTexture = PIXI.Texture.from(
      '/assets/images/Players/bunny1_stand.png'
    );
    this.jumpTexture = PIXI.Texture.from(
      '/assets/images/Players/bunny1_jump.png'
    );

    this.size = {
      width: 50 * this.scale,
      height: 83.5 * this.scale,
    };

    this.sprite = new PIXI.Sprite(this.standTexture);
    this.sprite.width = this.size.width;
    this.sprite.height = this.size.height;

    this.position = new p5.Vector(
      this.app.screen.width / 2,
      this.app.screen.height - this.size.height - 60
    );

    this.velocity = new p5.Vector(0, 0);
    this.velocity.limit(8 * this.scale);
    this.gravity = new p5.Vector(0, 0.07 * this.scale);

    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
    this.sprite.zIndex = 999;
    this.sprite.anchor.set(0.5);

    this.container.addChild(this.sprite);
  }

  update(delta) {
    this.velocity.add(this.gravity.copy().mult(delta));
    this.position.add(this.velocity);
    if (
      this.position.x - this.size.width / 2 > this.app.screen.width &&
      this.velocity.x > 0
    ) {
      console.log('here');
      this.position.x = -this.size.width / 2;
    } else if (
      this.position.x - this.size.width / 2 < 0 &&
      this.velocity.x < 0
    ) {
      this.position.x = this.app.screen.width - this.size.width / 2;
    }
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;

    this.sprite.zIndex = 9999999999999;
    this.app.stage.children.sort();
  }

  isOutOfBounds() {
    return this.position.y >= this.app.screen.height + this.size.height;
  }

  jump(delta) {
    this.sprite.texture = this.standTexture;

    setTimeout(() => {
      this.sprite.texture = this.jumpTexture;
    }, 60);
    this.velocity.y = -8.5 * delta * this.scale;
    this.velocity.y =
      this.velocity.y < -8.5 * this.scale ? -8.5 * this.scale : this.velocity.y;

    console.log(this.velocity.y);
  }
}
