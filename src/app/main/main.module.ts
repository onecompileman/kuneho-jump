import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [MainComponent, HomeComponent, GameComponent],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
