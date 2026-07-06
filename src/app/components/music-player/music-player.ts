import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [],
  templateUrl: './music-player.html',
  styleUrl: './music-player.scss'
})
export class MusicPlayer implements AfterViewInit {

  @ViewChild('player')
  player!: ElementRef<HTMLAudioElement>;

  ngAfterViewInit() {
    setTimeout(() => {
      this.player.nativeElement.volume = 0.35;
      this.player.nativeElement.play().catch(() => {});
    }, 500);
  }

}