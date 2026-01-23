import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Pokemon } from './models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly API = 'https://pokeapi.co/api/v2/';

  constructor(private http: HttpClient) {}

  getPokemonPage(limit: number, offset: number): Observable<Pokemon[]> {
    return this.http
      .get<{ results: { url: string }[] }>(`${this.API}/pokemon/?limit=${limit}&offset=${offset}`)
      .pipe(
        switchMap((res) =>
          forkJoin(
            res.results.map((pokemon) =>
              this.http.get<Pokemon>(pokemon.url).pipe(catchError(() => of(null))),
            ),
          ),
        ),
        map((list) => list.filter((pokemon): pokemon is Pokemon => pokemon !== null)),
      );
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.API}/pokemon/${name.toLowerCase().trim()}`);
  }

  getPokemonByType(type: string): Observable<Pokemon[]> {
    return this.http
      .get<{
        pokemon: { pokemon: { url: string } }[];
      }>(`${this.API}/type/${type.toLowerCase().trim()}`)
      .pipe(
        switchMap((res) =>
          forkJoin(
            res.pokemon.map((pokeEntry) =>
              this.http.get<Pokemon>(pokeEntry.pokemon.url).pipe(catchError(() => of(null))),
            ),
          ),
        ),
        map((list) => list.filter((pokemon): pokemon is Pokemon => pokemon !== null)),
      );
  }
  getAllPokemonsSortedByPower(): Observable<Pokemon[]> {
    return this.http.get<{ results: { url: string }[] }>(`${this.API}/pokemon/?limit=2000`).pipe(
      switchMap((res) =>
        forkJoin(
          res.results.map((p) => this.http.get<Pokemon>(p.url).pipe(catchError(() => of(null)))),
        ),
      ),
      map((list) =>
        list
          .filter((p): p is Pokemon => p !== null)
          .sort((a, b) => {
            const powerA = a.stats.reduce((s, st) => s + st.base_stat, 0);
            const powerB = b.stats.reduce((s, st) => s + st.base_stat, 0);
            return powerB - powerA;
          }),
      ),
    );
  }
}
