import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { HeroSliderComponent } from './hero-slider/hero-slider.component';
import { FeatureCardsComponent } from './feature-cards/feature-cards.component';
import { LoginComponent } from '../auth/login/login.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroSliderComponent,
    FeatureCardsComponent,
    LoginComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  showLogin = false;

  constructor(private router: Router) {}

  openLogin() {
    this.showLogin = true;
  }

  closeLogin() {
    this.showLogin = false;
  }

  onLoginSuccess() {
    this.showLogin = false;

    this.router.navigate(['/dashboard']);
  }
}
