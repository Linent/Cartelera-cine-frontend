import {
  Component,
  OnInit,
  OnDestroy,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { POKEMON_SLIDES } from './pokemon-slides.data';
import { PokemonSlide } from './pokemon-slide.model';

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-slider.component.html'
})
export class HeroSliderComponent implements OnInit, OnDestroy {

  slides: PokemonSlide[] = POKEMON_SLIDES;
  currentIndex = 0;
  intervalId: any;

  isMobile = false;

  // drag / swipe
  isDragging = false;
  startX = 0;
  currentX = 0;

  readonly DRAG_THRESHOLD = 80; 

  ngOnInit() {
    this.checkViewport();
    this.startAutoPlay();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  @HostListener('window:resize')
  checkViewport() {
    this.isMobile = window.innerWidth < 768;
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 5000);
  }

  resetAutoplay() {
    clearInterval(this.intervalId);
    this.startAutoPlay();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }



  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.currentX = event.clientX;
    clearInterval(this.intervalId);
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    this.currentX = event.clientX;
  }

  onMouseUp() {
    if (!this.isDragging) return;

    const diff = this.currentX - this.startX;

    if (Math.abs(diff) > this.DRAG_THRESHOLD) {
      diff < 0 ? this.next() : this.prev();
    }

    this.isDragging = false;
    this.resetAutoplay();
  }



  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
    clearInterval(this.intervalId);
  }

  onTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0].clientX;
    const diff = endX - this.startX;

    if (Math.abs(diff) > this.DRAG_THRESHOLD) {
      diff < 0 ? this.next() : this.prev();
    }

    this.resetAutoplay();
  }


  getGradient() {
    const aura = this.slides[this.currentIndex].auraColor;

    if (this.isMobile) {
      return `
        linear-gradient(
          0deg,
          rgba(${aura}, 0.45) 0%,
          rgba(${aura}, 0.25) 40%,
          rgba(0,0,0,0.85) 70%,
          rgba(0,0,0,1) 100%
        )
      `;
    }

    return `
      linear-gradient(
        90deg,
        rgba(${aura}, 0.45) 0%,
        rgba(${aura}, 0.25) 35%,
        rgba(0,0,0,0.85) 70%,
        rgba(0,0,0,1) 100%
      )
    `;
  }
}
