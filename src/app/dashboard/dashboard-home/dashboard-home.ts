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

  // 📦 Data
  pokemons: Pokemon[] = [];
  filtered: Pokemon[] = [];
  allTypePokemons: Pokemon[] = [];
  loadingMore = false;
  // 🔍 Filters state
  searchTerm = '';
  selectedType = '';

  // 🧠 UI state
  mode: ViewMode = 'all';
  loading = false;
  noMore = false;

  // 📄 Pagination
  offset = 0;
  limit = 30;

  constructor(
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitial();
  }

  // ========================
  // 🚀 INITIAL LOAD
  // ========================
  loadInitial(): void {
    this.mode = 'all';
    this.offset = 0;
    this.noMore = false;
    this.pokemons = [];
    this.filtered = [];
    this.loadPokemons();
  }

  // ========================
  // 📦 GENERAL POKEDEX
  // ========================
  loadPokemons(): void {
    // Si ya estamos cargando algo, salimos para evitar duplicados
    if (this.loading || this.loadingMore || this.noMore) return;

    // Si ya hay pokémons, usamos loadingMore para no disparar el loading de pantalla completa
    if (this.pokemons.length > 0) {
      this.loadingMore = true;
    } else {
      this.loading = true;
    }

    this.pokemonService.getPokemonPage(this.limit, this.offset).subscribe({
      next: (data) => {
        // Concatenamos los nuevos datos
        this.pokemons = [...this.pokemons, ...data];
        this.filtered = [...this.pokemons];
        this.offset += this.limit;

        // Verificamos si llegamos al final
        this.noMore = data.length < this.limit;

        // Apagamos ambas banderas
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
  // 🔍 FILTERS HANDLER
  // ========================
  onFiltersChange(filters: PokemonFilters): void {

    // 💪 Strongest / Weakest
    if (filters.sort === 'strongest' || filters.sort === 'weakest') {
      this.searchTerm = '';
      this.selectedType = '';
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

    // 🧬 Filter by type
    if (filters.type) {
      this.mode = 'type';
      this.searchTerm = '';
      this.selectedType = filters.type;
      this.loadByType(filters.type);
      return;
    }

    // 🔄 Reset
    this.searchTerm = '';
    this.selectedType = '';
    this.loadInitial();
  }

  // ========================
  // 🧬 LOAD BY TYPE
  // ========================
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

  // ========================
  // 🥇 STRONGEST / WEAKEST
  // ========================
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

  // ========================
  // ➕ LOAD MORE (NO SCROLL JUMP)
  // ========================
  loadMore(): void {
    // Evitar múltiples clics o carga en búsqueda individual
    if (this.mode === 'search' || this.loadingMore || this.loading || this.noMore) return;

    if (this.mode === 'all') {
      // Llamamos a la carga de API directamente
      this.loadPokemons();
      return;
    }

    // Paginación local para modo 'type' o 'strongest/weakest'
    this.loadingMore = true;

    // Simulamos un pequeño delay para que la UX sea suave, o lo hacemos instantáneo
    setTimeout(() => {
      const nextCount = this.filtered.length + this.limit;
      this.filtered = this.allTypePokemons.slice(0, nextCount);
      this.noMore = this.filtered.length >= this.allTypePokemons.length;

      this.loadingMore = false;
      this.cdr.detectChanges();
    }, 300);
  }

}
