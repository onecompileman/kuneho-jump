import * as PIXI from 'pixi.js';
import * as p5 from 'p5';

export class Particle {
  life = 60;
  originalLife = 60;
  sprite: PIXI.Sprite;
  texture: PIXI.Texture;
  app: PIXI.Application;
  container: PIXI.Container;

  size = {
    width: 20,
    height: 20,
  };

  velocity: any;
  position: any;
  gravity: any;

  constructor(app, container, position, velocity, texture, life, size) {
    this.app = app;
    this.container = container;
    this.position = position;
    this.velocity = velocity;
    this.velocity.limit(8);
    this.texture = texture;
    this.size = size;
    this.originalLife = this.life = life;

    this.gravity = new p5.Vector(0, 0.06);

    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
    this.sprite.width = this.size.width;
    this.sprite.height = this.size.height;
    this.sprite.anchor.set(0.5);

    this.container.addChild(this.sprite);
  }

  update(delta) {
    this.velocity.add(this.gravity.copy());
    this.position.add(this.velocity);
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
    this.sprite.alpha = this.life / this.originalLife;

    this.sprite.alpha = this.sprite.alpha < 0.8 ? 0.8 : this.sprite.alpha;

    this.life--;
  }

  isDead() {
    return this.life <= 0;
  }

  destroy() {
    this.app.stage.removeChild(this.sprite);
    this.sprite.destroy();
  }
}
