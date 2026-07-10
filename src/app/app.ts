import { Component, ElementRef, ViewChild, signal } from '@angular/core';

import { Hero } from './components/hero/hero';
import { Countdown } from './components/countdown/countdown';
import { Invitation } from './components/invitation/invitation';
import { Timeline } from './components/timeline/timeline';
import { Location } from './components/location/location';
import { Footer } from './components/footer/footer';
import { LoadingScreen } from './components/loading-screen/loading-screen';
import { Rsvp } from './components/rsvp/rsvp';
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
    Footer,
    Rsvp
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  @ViewChild('player')
  player!: ElementRef<HTMLAudioElement>;

  opened = signal(false);

  openInvitation() {
    this.opened.set(true);

    setTimeout(() => {
      this.player.nativeElement.volume = 0.35;
      this.player.nativeElement.play().catch(console.error);
    }, 100);
  }

}