import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-countdown',
  imports: [],
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss',
})
export class Countdown implements OnInit {

  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);

  ngOnInit() {

    this.update();

    setInterval(() => this.update(), 1000);

  }

  update() {

    const wedding = new Date('2026-07-19T18:00:00');

    const now = new Date();

    const diff = wedding.getTime() - now.getTime();

    if (diff <= 0) return;

    this.days.set(Math.floor(diff / (1000 * 60 * 60 * 24)));

    this.hours.set(Math.floor(diff / (1000 * 60 * 60)) % 24);

    this.minutes.set(Math.floor(diff / (1000 * 60)) % 60);

    this.seconds.set(Math.floor(diff / 1000) % 60);

  }

}