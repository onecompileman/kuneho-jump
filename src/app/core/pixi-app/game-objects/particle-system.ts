import * as PIXI from 'pixi.js';
import * as p5 from 'p5';
import { Particle } from './particle';

export class ParticleSystem {
  app: PIXI.Application;
  container: PIXI.Container;
  p5: any;

  particles: Particle[] = [];

  constructor(app, container, position, textures, count, life, size) {
    this.app = app;
    this.container = container;
    this.p5 = new p5();

    textures = textures.map((texture) => PIXI.Texture.from(texture));

    this.particles = Array(count)
      .fill(1)
      .map(() => {
        const velocity = new p5.Vector(
          this.p5.random(-2, 2),
          this.p5.random(-2, 2)
        );
        const texture = this.p5.random(textures);

        return new Particle(
          app,
          container,
          position.copy(),
          velocity,
          texture,
          life,
          size
        );
      });
  }

  isDead() {
    return !this.particles.length;
  }

  update(delta) {
    this.particles = this.particles.filter((particle) => {
      particle.update(delta);
      if (particle.isDead()) {
        particle.destroy();
        return false;
      }

      return true;
    });
  }
}
