import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/core/pixi-app/game';
import { SoundManagerService } from 'src/app/core/services/sound-manager.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'jp-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game: Game;

  started: boolean;

  constructor(
    private soundManagerService: SoundManagerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initGame();
  }

  start() {
    this.started = true;
    this.game.isPause = false;
  }

  pause() {
    this.game.isPause = true;

    Swal.fire({
      icon: 'info',
      title: 'Pause',
      html: `
        <div style="display: flex; align-items: center;justify-content: center;width: 100%">
          <div style="margin-right: 20px">
            <b>Score: </b> ${Math.round(this.game.score)}
          </div>
          <div style="display: flex; align-items: center;">
            <img src="assets/images/HUD/coin_gold.png" height="24">&nbsp; ${
              this.game.collectedCoins
            }
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: `Resume`,
      cancelButtonText: `Quit`,
    }).then((result) => {
      console.log(result);
      /* Read more about isConfirmed, isDenied below */
      if (result) {
        this.game.isPause = false;
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  private initGame() {
    this.game = new Game(
      document.getElementById('gameContainer'),
      this.soundManagerService,
      this.router
    );
    this.game.initGame();
    this.game.isPause = true;
  }
}
