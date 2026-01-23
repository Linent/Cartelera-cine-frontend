import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../models/pokemon.model';
import { PokemonFilters } from '../models/pokemon-filters.model';

import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonFiltersComponent } from '../pokemon-filters/pokemon-filters.component';
import { ViewMode } from '../dashboard-home/types';

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
  loadingMore = false;

  searchTerm = '';
  selectedType = '';


  mode: ViewMode = 'all';
  loading = false;
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

    if (this.loading || this.loadingMore || this.noMore) return;


    if (this.pokemons.length > 0) {
      this.loadingMore = true;
    } else {
      this.loading = true;
    }

    this.pokemonService.getPokemonPage(this.limit, this.offset).subscribe({
      next: (data) => {

        this.pokemons = [...this.pokemons, ...data];
        this.filtered = [...this.pokemons];
        this.offset += this.limit;


        this.noMore = data.length < this.limit;


        this.loading = false;
        this.loadingMore = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.loadingMore = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFiltersChange(filters: PokemonFilters): void {


    if (filters.sort === 'strongest' || filters.sort === 'weakest') {
      this.searchTerm = '';
      this.selectedType = '';
      this.loadByPower(filters.sort);
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


  loadByPower(order: 'strongest' | 'weakest'): void {
    if (this.loading) return;

    this.mode = order;
    this.loading = true;
    this.noMore = false;
    this.filtered = [];

    this.pokemonService.getAllPokemonsSortedByPower().subscribe({
      next: (list) => {
        const ordered =
          order === 'weakest'
            ? [...list].reverse()
            : list;

        this.allTypePokemons = ordered;
        this.filtered = ordered.slice(0, this.limit);
        this.noMore = this.filtered.length >= ordered.length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }


  loadMore(): void {

    if (this.mode === 'search' || this.loadingMore || this.loading || this.noMore) return;

    if (this.mode === 'all') {

      this.loadPokemons();
      return;
    }


    this.loadingMore = true;


    setTimeout(() => {
      const nextCount = this.filtered.length + this.limit;
      this.filtered = this.allTypePokemons.slice(0, nextCount);
      this.noMore = this.filtered.length >= this.allTypePokemons.length;

      this.loadingMore = false;
      this.cdr.detectChanges();
    }, 300);
  }

}
