import { Injectable } from '@angular/core';

import { Howl, Howler } from 'howler';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SoundManagerService {
  backgroundMusic: Howl;
  backgroundPaused = true;

  loadedSounds: BehaviorSubject<number> = new BehaviorSubject(0);

  sound: any;

  constructor() {
    if (!this.backgroundMusic) {
      this.backgroundMusic = new Howl({
        src: ['assets/sounds/BGM1.mp3'],
        autoplay: false,
        loop: true,
        volume: 0.55,
        onload: () => this.loadedSounds.next(this.loadedSounds.getValue() + 1),
      });

      this.sound = {
        timesUp: new Howl({
          src: ['assets/sounds/timesup.mp3'],
          autoplay: false,
          loop: false,
          volume: 0.5,
          onload: () =>
            this.loadedSounds.next(this.loadedSounds.getValue() + 1),
        }),
        correct: new Howl({
          src: ['assets/sounds/correct.mp3'],
          autoplay: false,
          loop: false,
          volume: 0.5,
          onload: () =>
            this.loadedSounds.next(this.loadedSounds.getValue() + 1),
        }),
        wrong: new Howl({
          src: ['assets/sounds/wrong.mp3'],
          autoplay: false,
          loop: false,
          volume: 0.5,
          onload: () =>
            this.loadedSounds.next(this.loadedSounds.getValue() + 1),
        }),
        jump: new Howl({
          src: ['assets/sounds/jump.wav'],
          autoplay: false,
          loop: false,
          volume: 0.2,
          onload: () =>
            this.loadedSounds.next(this.loadedSounds.getValue() + 1),
        }),
        hit: new Howl({
          src: ['assets/sounds/hit.wav'],
          autoplay: false,
          loop: false,
          volume: 0.5,
          onload: () =>
            this.loadedSounds.next(this.loadedSounds.getValue() + 1),
        }),
      };
    }
  }

  get sounds() {
    return this.loadedSounds;
  }

  stopBackgroundMusic() {
    this.backgroundPaused = true;
    this.backgroundMusic.pause();
  }

  playBackgroundMusic() {
    if (this.backgroundPaused) {
      this.backgroundPaused = false;

      this.backgroundMusic.play();
    }
  }

  stopAllSounds() {
    // Object.keys(this.sound).forEach((key) => this.sound[key].stop());
    this.sound.win.stop();
  }

  playSoundByPath(path: string) {
    this.sound[path].play();
  }
}
