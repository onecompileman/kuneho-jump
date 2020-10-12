import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'jp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  play() {
    this.router.navigate(['/game']);
  }

  about() {
    Swal.fire({
      title: 'About the Game',
      html: `
        <div style="display: flex;flex-direction:column; align-items: center;justify-content: center;width: 100%">
          <p>Game is created by: <b><a href="https://www.linkedin.com/in/stephen-vinuya-54441b106/" target="_blank">Stephen Vinuya</a></b></p>
          <p>Assets by: <b><a href="https://www.kenney.nl/" target="_blank">Kenney</a></b></p>
          <p>Description: Created using Angular 7, Howler, Pixi.js, p5</p>
        </div>
      `,
    });
  }

  highScore() {
    const highscore = localStorage.getItem('jp.high-score');

    Swal.fire({
      icon: 'info',
      title: 'HighScore',
      html: `
        <div style="display: flex; align-items: center;justify-content: center;width: 100%">
          <div style="margin-right: 20px">
            <b>Score: </b> ${Math.round(+highscore) || 0}
          </div>
         
        </div>
      `,
    });
  }
}
