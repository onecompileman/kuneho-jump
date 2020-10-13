import * as PIXI from 'pixi.js';
import * as p5 from 'p5';

export class Block {
  position: any;
  acceleration: any;
  velocity: any;
  textures: string[] = [
    'ground_cake',
    'ground_grass',
    'ground_sand',
    'ground_snow',
    'ground_stone',
    'ground_wood',
  ];

  particleTextures: string[][] = [
    ['particle_darkBrown', 'particle_pink'],
    ['particle_brown', 'particle_green'],
    ['particle_brown', 'particle_beige'],
    ['particle_brown', 'particle_blue'],
    ['particle_darkGrey', 'particle_grey'],
    ['particle_darkBrown', 'particle_brown'],
  ];

  springSprite: PIXI.Sprite;

  particleTexture: string[];
  isSmall: boolean;
  isBroken: boolean;
  isSpring: boolean;

  size: any;
  scale;

  blockTexture: PIXI.Texture;

  app: PIXI.Application;
  container: PIXI.Container;

  sprite: PIXI.Sprite;

  constructor(
    app,
    container,
    position,
    textureIndex,
    isSmall,
    isBroken,
    scale
  ) {
    this.app = app;
    this.container = container;
    this.isSmall = isSmall;
    this.isBroken = isBroken;
    this.position = position;
    this.scale = scale;

    let textureName = this.textures[textureIndex];
    textureName = isSmall ? textureName + '_small' : textureName;
    textureName = isBroken ? textureName + '_broken' : textureName;
    textureName += '.png';

    this.particleTexture = this.particleTextures[textureIndex].map(
      (texture) => {
        return `assets/images/Particles/${texture}.png`;
      }
    );

    this.size = isSmall
      ? { width: 75 * this.scale, height: 37.5 * this.scale }
      : { width: 146.25 * this.scale, height: 35.25 * this.scale };

    this.blockTexture = PIXI.Texture.from(
      `assets/images/Environment/${textureName}`
    );
    this.sprite = new PIXI.Sprite(this.blockTexture);
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
    this.sprite.width = this.size.width;
    this.sprite.height = this.size.height;
    this.sprite.anchor.set(0.5);

    this.container.addChild(this.sprite);
  }

  collidesWith(target) {
    const bounds1 = target.sprite.getBounds();
    const bounds2 = this.sprite.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y &&
      target.position.y + target.size.height * 0.45 < this.position.y
    );
    // return (
    //   this.position.x < target.position.x + target.size.width &&
    //   this.position.x + this.size.width > target.position.x &&
    //   this.position.y < target.position.y + target.size.height &&
    //   this.position.y + this.size.height > target.position.y &&
    //   target.position.y < this.position.y
    // );
  }

  update(delta) {
    // this.velocity.add(this.gravity.copy().mult(delta));
    this.position.add(this.velocity);
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
