import { Component, signal } from '@angular/core';

import { Hero } from './components/hero/hero';
import { Countdown } from './components/countdown/countdown';
import { Invitation } from './components/invitation/invitation';
import { Timeline } from './components/timeline/timeline';
import { Location } from './components/location/location';
import { Gallery } from './components/gallery/gallery';
import { Footer } from './components/footer/footer';
import { LoadingScreen } from './components/loading-screen/loading-screen';
import { MusicPlayer } from './components/music-player/music-player';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LoadingScreen,
    Hero,
    Countdown,
    Invitation,
    Timeline,
    Location,
    Gallery,
    Footer,
    MusicPlayer
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  opened = signal(false);

  openInvitation() {
    this.opened.set(true);
  }

}