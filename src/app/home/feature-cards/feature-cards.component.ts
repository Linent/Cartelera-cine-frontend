import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { features } from './feature-cards.data';
@Component({
  selector: 'app-feature-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-cards.component.html'
})
export class FeatureCardsComponent {
  features = features;
}
