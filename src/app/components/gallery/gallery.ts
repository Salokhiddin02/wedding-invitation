import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery {

  images = [
    'assets/images/1.jpg',
    'assets/images/2.jpg',
    'assets/images/3.jpg',
    'assets/images/4.jpg',
    'assets/images/5.jpg',
    'assets/images/6.jpg'
  ];

  current = signal(0);

  constructor() {

    setInterval(() => {

      this.next();

    },3000);

  }

  next(){

    this.current.update(v=>

      (v+1)%this.images.length

    );

  }

}