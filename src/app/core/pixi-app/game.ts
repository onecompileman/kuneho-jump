import * as PIXI from 'pixi.js';
import { Player } from './game-objects/player';
import { Block } from './game-objects/block';
import * as p5 from 'p5';
import { ParticleSystem } from './game-objects/particle-system';
import { Coin } from './game-objects/coin';
import { Enemy } from './game-objects/enemy';
import { SoundManagerService } from '../services/sound-manager.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

export class Game {
  containerEl: any;
  app: any;
  p5: any;

  container: PIXI.Container;

  player: Player;
  blocks: Block[] = [];
  particleSystems: ParticleSystem[] = [];
  coins: Coin[] = [];
  enemies: Enemy[] = [];

  playerTravelled = 0;

  brokenChance = 25;
  smallChance = 5;
  coinChance = 10;
  enemyChance = 5;

  collectedCoins = 0;

  blocksDistance = {
    min: 60,
    max: 100,
  };

  score = 0;

  distance;

  soundManagerService: SoundManagerService;

  textureBlockIndex = 0;

  scale = 1;

  isPause: boolean;

  router: Router;

  constructor(containerEl, soundManagerService, router) {
    this.containerEl = containerEl;
    this.soundManagerService = soundManagerService;
    this.router = router;
  }

  initGame() {
    this.isPause = false;

    // if (innerWidth <= 620) {
    //   PIXI.settings.RESOLUTION = window.devicePixelRatio;
    // }
    // Disable interpolation when scaling, will make texture be pixelated
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    console.log('haha');
    this.p5 = new p5();
    const maxWidth = 620;

    const width = innerWidth > maxWidth ? maxWidth : innerWidth;
    this.scale = width / maxWidth;
    this.app = new PIXI.Application({
      width,
      height: innerHeight,
      transparent: true,
    });

    this.containerEl.innerHTML = '';
    this.containerEl.appendChild(this.app.view);

    this.container = new PIXI.Container();

    this.app.stage.addChild(this.container);

    this.initPlayer();
    this.initBlocks();

    window.addEventListener('devicemotion', (event) => {
      this.player.velocity.x =
        3 *
        event.accelerationIncludingGravity.x *
        -1 *
        (Math.abs(event.accelerationIncludingGravity.x) / 4) *
        this.scale;
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'd') {
        this.player.velocity.x = 3 * this.scale;
      } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        this.player.velocity.x = -3 * this.scale;
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'd') {
        this.player.velocity.x = 0;
      } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        this.player.velocity.x = 0;
      }
    });

    this.app.ticker.add((delta) => {
      this.update(delta);
    });
  }

  initPlayer() {
    this.player = new Player(this.app, this.container, this.scale);
  }

  initBlocks() {
    const block = new Block(
      this.app,
      this.container,
      new p5.Vector(this.app.screen.width / 2, this.app.screen.height - 20),
      0,
      false,
      false,
      this.scale
    );

    this.blocks.push(block);

    let lastBlock = this.blocks[this.blocks.length - 1];
    while (lastBlock.position.y >= -400) {
      const distance = this.p5.random(
        this.blocksDistance.min,
        this.blocksDistance.max
      );
      const position = new p5.Vector(
        this.p5.random(80, this.app.screen.width - 80),
        lastBlock.position.y - distance
      );

      this.blocks.push(
        new Block(
          this.app,
          this.container,
          position,
          0,
          false,
          false,
          this.scale
        )
      );

      lastBlock = this.blocks[this.blocks.length - 1];
    }

    this.distance = this.p5.random(
      this.blocksDistance.min,
      this.blocksDistance.max
    );
  }

  generateBlocks() {
    let lastBlock = this.blocks[this.blocks.length - 1];
    if (lastBlock.position.y - this.distance >= -400 * this.scale) {
      const position = new p5.Vector(
        this.p5.random(
          80 * this.scale,
          this.app.screen.width - 80 * this.scale
        ),
        lastBlock.position.y - this.distance
      );

      const isSmall = this.smallChance >= this.p5.random(1, 100);
      const isBroken = this.brokenChance >= this.p5.random(1, 100);
      const hasCoin = this.coinChance >= this.p5.random(1, 100);
      const hasEnemy = this.enemyChance >= this.p5.random(1, 100);

      if (hasEnemy) {
        const enemy = new Enemy(
          this.app,
          this.container,
          new p5.Vector(
            this.p5.random(
              80 * this.scale,
              this.app.screen.width - 80 * this.scale
            ),
            position.y - 60 * this.scale
          ),
          this.scale
        );

        this.enemies.push(enemy);
      }

      if (hasCoin) {
        console.log('here');
        const coin = new Coin(
          this.app,
          this.container,
          new p5.Vector(position.x, position.y - 50 * this.scale),
          this.scale
        );

        this.coins.push(coin);
      }

      this.blocks.push(
        new Block(
          this.app,
          this.container,
          position,
          this.textureBlockIndex,
          isSmall,
          isBroken,
          this.scale
        )
      );
      this.distance = this.p5.random(
        this.blocksDistance.min,
        this.blocksDistance.max
      );
    }
  }

  update(delta) {
    console.log(this.isPause);

    if (!this.isPause) {
      this.updatePlayer(delta);
      this.updateBlocks(delta);
      this.updateParticleSystem(delta);
      this.updateCoins(delta);
      this.updateEnemies(delta);
    }
  }

  updateParticleSystem(delta) {
    this.particleSystems = this.particleSystems.filter((particleSystem) => {
      particleSystem.update(delta);

      return !particleSystem.isDead();
    });
  }

  updateCoins(delta) {
    this.coins = this.coins.filter((coin) => {
      coin.update(delta);

      if (coin.collidesWith(this.player)) {
        this.collectedCoins++;
        this.soundManagerService.playSoundByPath('correct');

        coin.destroy();
        this.particleSystems.push(
          new ParticleSystem(
            this.app,
            this.container,
            coin.position.copy(),
            ['assets/images/Particles/portal_yellowParticle.png'],
            10,
            60,
            {
              height: 16 * this.scale,
              width: 16 * this.scale,
            }
          )
        );
        return false;
      }

      if (coin.isOutOfBounds()) {
        coin.destroy();
        return false;
      }

      return true;
    });
  }
  updateEnemies(delta) {
    this.enemies = this.enemies.filter((enemy) => {
      enemy.update(delta);

      if (enemy.collidesWith(this.player)) {
        this.soundManagerService.playSoundByPath('wrong');
        this.isPause = true;
        this.gameOver();
        return false;
      }

      if (enemy.isOutOfBounds()) {
        enemy.destroy();
        return false;
      }

      return true;
    });
  }

  gameOver() {
    const highscore = localStorage.getItem('jp.high-score');

    if (+highscore < this.score) {
      localStorage.setItem('jp.high-score', this.score.toString());
    }

    Swal.fire({
      icon: 'error',
      title: 'Game Over',
      html: `
        <div style="display: flex; align-items: center;justify-content: center;width: 100%">
          <div style="margin-right: 20px">
            <b>Score: </b> ${Math.round(this.score)}
          </div>
          <div style="display: flex; align-items: center;">
            <img src="assets/images/HUD/coin_gold.png" height="24">&nbsp; ${
              this.collectedCoins
            }
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: `Retry`,
      cancelButtonText: `Quit`,
    }).then((result) => {
      console.log(result);
      /* Read more about isConfirmed, isDenied below */
      if (result.dismiss) {
        this.router.navigate(['/']);
        this.app.stage.destroy(true);
      } else {
        this.blocks = [];
        this.particleSystems = [];
        this.coins = [];
        this.enemies = [];
        this.app.stage.destroy(true);

        this.initGame();
      }
    });
  }

  updatePlayer(delta) {
    this.player.update(delta);

    if (
      this.player.position.y <= this.app.screen.height * 0.5 &&
      this.player.velocity.y < 0
    ) {
      this.playerTravelled += Math.abs(this.player.velocity.y);
      this.score += Math.abs(this.player.velocity.y) * 0.1;
      this.player.position.y += Math.abs(this.player.velocity.y);

      this.coins = this.coins.map((coin) => {
        coin.position.y += Math.abs(this.player.velocity.y);

        return coin;
      });
      this.enemies = this.enemies.map((enemy) => {
        enemy.position.y += Math.abs(this.player.velocity.y);

        return enemy;
      });

      this.blocks = this.blocks.map((block) => {
        block.position.y += Math.abs(this.player.velocity.y);

        return block;
      });
    }

    if (this.player.isOutOfBounds()) {
      this.isPause = true;
      this.gameOver();
    }

    if (this.playerTravelled >= 5000) {
      this.blocksDistance.min += this.blocksDistance.min < 120 ? 10 : 0;
      this.blocksDistance.max += this.blocksDistance.max < 240 ? 10 : 0;
      this.enemyChance += this.enemyChance < 20 ? 2 : 0;
      this.smallChance += this.smallChance < 30 ? 5 : 0;
      this.brokenChance += this.smallChance < 35 ? 5 : 0;
      this.playerTravelled = 0;
      this.textureBlockIndex++;
      this.textureBlockIndex =
        this.textureBlockIndex >= 6 ? 0 : this.textureBlockIndex;
    }
  }

  updateBlocks(delta) {
    this.blocks = this.blocks.filter((block) => {
      if (block.collidesWith(this.player) && this.player.velocity.y > 0) {
        console.log('here');
        this.player.jump(delta);
        this.soundManagerService.playSoundByPath('jump');

        if (block.isBroken) {
          this.soundManagerService.playSoundByPath('hit');
          this.particleSystems.push(
            new ParticleSystem(
              this.app,
              this.container,
              block.position.copy(),
              block.particleTexture,
              15,
              80,
              {
                width: 28 * this.scale,
                height: 28 * this.scale,
              }
            )
          );
          block.destroy();
          return false;
        }
      }
      block.update(delta);

      if (block.isOutOfBounds()) {
        block.destroy();
        return false;
      }

      return true;
    });

    this.generateBlocks();
  }
}
