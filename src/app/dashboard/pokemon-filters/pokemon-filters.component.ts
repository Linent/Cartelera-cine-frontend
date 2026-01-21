import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PokemonFilters } from '../models/pokemon-filters.model';
import { SearchIconComponent } from '../../shared/navbar/icons/search-icon.component';
import { ChartIconComponent } from '../../shared/navbar/icons/chart-icon.component';
import { DropdownComponent } from '../../shared/ui/dropdown/dropdown.component';
import { typesPokemon } from './typesPokemon';

@Component({
  selector: 'app-pokemon-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchIconComponent,
    ChartIconComponent,
    DropdownComponent
  ],
  templateUrl: './pokemon-filters.component.html',
})
export class PokemonFiltersComponent implements OnChanges {

  @Input() disabled = false;

  @Input() externalFilters!: PokemonFilters;

  @Output() filtersChange = new EventEmitter<PokemonFilters>();

  filters: PokemonFilters = {
    search: '',
    type: '',
    sort: 'none',
  };

  types = typesPokemon;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['externalFilters'] && this.externalFilters) {
      this.filters = { ...this.externalFilters };
    }
  }

applyFilters() {
  if (this.disabled || !this.filters.search.trim()) return;

  this.filters.type = '';
  this.filters.sort = 'none';
  this.filtersChange.emit({ ...this.filters });
}

applyStrongest() {
  if (this.disabled) return;

  this.filters.search = '';
  this.filters.type = '';
  this.filters.sort = 'strongest';
  this.filtersChange.emit({ ...this.filters });
}

onTypeChange(type: string) {
  if (this.disabled) return;

  this.filters.type = type;
  this.filters.search = '';
  this.filters.sort = 'none';
  this.filtersChange.emit({ ...this.filters });
}
}
