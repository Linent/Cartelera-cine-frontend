import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../models/pokemon.model';
import { typeColors } from '../types/typeColors';
import { imagePokemonDefault } from './types';
@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.component.html'
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() disabled = false;
  typeColors = typeColors;

  get artwork(): string {
    return (
      this.pokemon.sprites.other['official-artwork'].front_default ||
      imagePokemonDefault
    );
  }

  get mainType(): string {
    return this.pokemon.types[0]?.type.name || 'normal';
  }

  statWidth(stat: number): string {
    return `${Math.min((stat / 150) * 100, 100)}%`;
  }
}
