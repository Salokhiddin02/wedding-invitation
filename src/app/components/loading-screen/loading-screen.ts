import {
  Component,
  ElementRef,
  ViewChild,
  output,
  signal
} from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  imports: [],
  templateUrl: './loading-screen.html',
  styleUrl: './loading-screen.scss',
})
export class LoadingScreen {

  @ViewChild('music')
  music!: ElementRef<HTMLAudioElement>;

  openInvitation = output<void>();

  opened = signal(false);

  open() {

    this.music.nativeElement.volume = 0.35;

    this.music.nativeElement.play().catch(console.error);

    this.opened.set(true);

    setTimeout(() => {
      this.openInvitation.emit();
    }, 1800);

  }

}