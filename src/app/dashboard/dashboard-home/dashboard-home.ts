import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../models/pokemon.model';
import { PokemonFilters } from '../models/pokemon-filters.model';

import Fuse from 'fuse.js';

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
  templateUrl: './dashboard-home.html',
   styleUrls: ['./style.css']
})
export class DashboardHomeComponent implements OnInit {

  // 🔎 Fuzzy search
  private fuse!: Fuse<string>;
  private pokemonNames: string[] = [];

  // 📦 Data
  pokemons: Pokemon[] = [];
  filtered: Pokemon[] = [];
  allTypePokemons: Pokemon[] = [];

  // 💡 UI state
  loading = false;
  loadingMore = false;
  noMore = false;

  // 🔍 Filters
  searchTerm = '';
  selectedType = '';
  suggestedPokemon: string | null = null;

  // 🧭 View
  mode: ViewMode = 'all';

  // 📄 Pagination
  offset = 0;
  limit = 30;

  constructor(
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef
  ) {}

  // ========================
  // 🚀 INIT
  // ========================
  ngOnInit(): void {
    this.loadInitial();

    this.pokemonService.getPokemonNames().subscribe(names => {
      this.pokemonNames = names;
      this.fuse = new Fuse(names, {
        threshold: 0.35,
      });
    });
  }

  // ========================
  // 📦 INITIAL LOAD
  // ========================
  loadInitial(): void {
    this.mode = 'all';
    this.offset = 0;
    this.noMore = false;
    this.pokemons = [];
    this.filtered = [];
    this.suggestedPokemon = null;
    this.loadPokemons();
  }

  loadPokemons(): void {
    if (this.loading || this.loadingMore || this.noMore) return;

    this.pokemons.length ? this.loadingMore = true : this.loading = true;

    this.pokemonService.getPokemonPage(this.limit, this.offset).subscribe({
      next: data => {
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

  // ========================
  // 🔍 FILTERS
  // ========================
  onFiltersChange(filters: PokemonFilters): void {

    // 💪 Strongest / Weakest
    if (filters.sort === 'strongest' || filters.sort === 'weakest') {
      this.searchTerm = '';
      this.selectedType = '';
      this.suggestedPokemon = null;
      this.loadByPower(filters.sort);
      return;
    }

    // 🔎 Search by name
    if (filters.search) {
      this.mode = 'search';
      this.searchTerm = filters.search.toLowerCase().trim();
      this.selectedType = '';
      this.noMore = true;
      this.loading = true;
      this.suggestedPokemon = null;

      this.pokemonService.getPokemonByName(this.searchTerm).subscribe({
        next: pokemon => {
          this.filtered = [pokemon];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          const result = this.fuse?.search(this.searchTerm);

          if (result && result.length > 0) {
            this.suggestedPokemon = result[0].item;

            // ✅ cargamos automáticamente el sugerido
            this.pokemonService.getPokemonByName(this.suggestedPokemon).subscribe({
              next: pokemon => {
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

          this.filtered = [];
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    // 🧬 Type
    if (filters.type) {
      this.mode = 'type';
      this.searchTerm = '';
      this.selectedType = filters.type;
      this.suggestedPokemon = null;
      this.loadByType(filters.type);
      return;
    }

    // 🔄 Reset
    this.loadInitial();
  }

  // ========================
  // 💡 Suggested click
  // ========================
  searchSuggested(): void {
    if (!this.suggestedPokemon) return;

    this.searchTerm = this.suggestedPokemon;
    this.suggestedPokemon = null;
  }

  // ========================
  // 🧬 By type
  // ========================
  loadByType(type: string): void {
    this.loading = true;
    this.noMore = false;

    this.pokemonService.getPokemonByType(type).subscribe({
      next: list => {
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

  // ========================
  // 💪 By power
  // ========================
  loadByPower(order: 'strongest' | 'weakest'): void {
    if (this.loading) return;

    this.mode = order;
    this.loading = true;
    this.noMore = false;
    this.filtered = [];

    this.pokemonService.getAllPokemonsSortedByPower().subscribe({
      next: list => {
        const ordered = order === 'weakest' ? [...list].reverse() : list;
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

  // ========================
  // ➕ Load more
  // ========================
  loadMore(): void {
    if (this.mode === 'search' || this.loading || this.loadingMore || this.noMore) return;

    if (this.mode === 'all') {
      this.loadPokemons();
      return;
    }

    this.loadingMore = true;

    setTimeout(() => {
      const next = this.filtered.length + this.limit;
      this.filtered = this.allTypePokemons.slice(0, next);
      this.noMore = this.filtered.length >= this.allTypePokemons.length;
      this.loadingMore = false;
      this.cdr.detectChanges();
    }, 300);
  }
}
