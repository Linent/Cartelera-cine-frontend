import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PokemonFilters } from '../models/pokemon-filters.model';
import { SearchIconComponent } from '../../shared/navbar/icons/search-icon.component';
import { DropdownComponent } from '../../shared/ui/dropdown/dropdown.component';
import { typesPokemon } from './typesPokemon';

@Component({
  selector: 'app-pokemon-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchIconComponent,
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

  sortOptions = [
    { label: 'Más fuertes', value: 'strongest' },
    { label: 'Más débiles', value: 'weakest' }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['externalFilters'] && this.externalFilters) {
      this.filters = { ...this.externalFilters };
    }
  }


  applySearch() {
    if (this.disabled) return;

    this.filters.type = '';
    this.filters.sort = 'none';
    this.filtersChange.emit({ ...this.filters });
  }


  onTypeChange(type: string) {
    if (this.disabled) return;

    this.filters.type = type;
    this.filters.search = '';
    this.filters.sort = 'none';
    this.filtersChange.emit({ ...this.filters });
  }


  onSortChange(sort: string) {
  if (this.disabled) return;

  if (sort !== 'strongest' && sort !== 'weakest') return;

  this.filters.search = '';
  this.filters.type = '';
  this.filters.sort = sort;

  this.filtersChange.emit({ ...this.filters });
}
}
