import {
  Component,
  output,
  signal
} from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [],
  templateUrl: './loading-screen.html',
  styleUrl: './loading-screen.scss',
})
export class LoadingScreen {

  openInvitation = output<void>();

  opened = signal(false);

  open() {
    this.opened.set(true);

    setTimeout(() => {
      this.openInvitation.emit();
    }, 800);
  }

}