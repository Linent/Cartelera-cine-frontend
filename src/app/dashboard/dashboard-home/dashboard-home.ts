import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../models/pokemon.model';
import { PokemonFilters } from '../models/pokemon-filters.model';

import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonFiltersComponent } from '../pokemon-filters/pokemon-filters.component';

type ViewMode = 'all' | 'type' | 'search' | 'strongest';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    PokemonCardComponent,
    PokemonFiltersComponent
  ],
  templateUrl: './dashboard-home.html'
})
export class DashboardHomeComponent implements OnInit {

  pokemons: Pokemon[] = [];
  filtered: Pokemon[] = [];
  allTypePokemons: Pokemon[] = [];

  searchTerm = '';
  selectedType = '';
  currentSort = '';

  mode: ViewMode = 'all';
  loading = false;
  loadingStrongest = false;
  noMore = false;

  offset = 0;
  limit = 30;

  constructor(
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitial();
  }

  loadInitial(): void {
    this.mode = 'all';
    this.offset = 0;
    this.noMore = false;
    this.pokemons = [];
    this.filtered = [];
    this.loadPokemons();
  }

  loadPokemons(): void {
    if (this.loading || this.noMore) return;

    this.loading = true;

    this.pokemonService.getPokemonPage(this.limit, this.offset).subscribe({
      next: (data) => {
        this.pokemons = [...this.pokemons, ...data];
        this.filtered = [...this.pokemons];
        this.offset += this.limit;
        this.noMore = data.length < this.limit;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFiltersChange(filters: PokemonFilters): void {

  if (filters.sort === 'strongest') {
    this.searchTerm = '';
    this.selectedType = '';
    this.loadStrongest();
    return;
  }

  if (filters.search) {
    this.mode = 'search';
    this.searchTerm = filters.search.toLowerCase().trim();
    this.selectedType = '';
    this.noMore = true;
    this.loading = true;

    this.pokemonService.getPokemonByName(this.searchTerm).subscribe({
      next: (pokemon) => {
        this.filtered = [pokemon];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.filtered = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
    return;
  }

  if (filters.type) {
    this.mode = 'type';
    this.searchTerm = '';
    this.selectedType = filters.type;
    this.loadByType(filters.type);
    return;
  }

  this.searchTerm = '';
  this.selectedType = '';
  this.loadInitial();
}


  loadByType(type: string): void {
    this.loading = true;
    this.noMore = false;

    this.pokemonService.getPokemonByType(type).subscribe({
      next: (list) => {
        this.allTypePokemons = list;
        this.filtered = list.slice(0, this.limit);
        this.noMore = this.filtered.length >= list.length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadStrongest(): void {
    if (this.loadingStrongest) return;

    this.mode = 'strongest';
    this.loadingStrongest = true;
    this.loading = true;
    this.noMore = false;

    this.pokemonService.getAllPokemonsSortedByPower().subscribe({
      next: (list) => {
        this.allTypePokemons = list;
        this.filtered = list.slice(0, this.limit);
        this.noMore = this.filtered.length >= list.length;
        this.loadingStrongest = false;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingStrongest = false;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadMore(): void {
    if (this.mode === 'search') return;

    if (this.mode === 'all') {
      this.loadPokemons();
      return;
    }

    const next = this.filtered.length + this.limit;
    this.filtered = this.allTypePokemons.slice(0, next);
    this.noMore = this.filtered.length >= this.allTypePokemons.length;
    this.cdr.detectChanges();
  }
}
