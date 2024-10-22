import { Injectable } from '@angular/core';

import { Pokemon } from '../models/pokemon-response.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private pokemonData: PokemonCollection = {};

  constructor() { }

  public spotPokemon(pokemon: Pokemon): void {
    if (this.pokemonData[pokemon.id]) {
      return;
    }

    this.pokemonData[pokemon.id] = {
      name: pokemon.name,
      sprite: pokemon.sprites,
      caught: false,
    }
  }

  public catchPokemon(pokemon: Pokemon): void {
    if (!this.pokemonData[pokemon.id]) {
      this.spotPokemon(pokemon);
    }

    this.pokemonData[pokemon.id].caught = true;
  }
}

export type PokemonCollection = {
  [key: number]: {
    name: string, 
    sprite: {[key: string]: string}, 
    caught: boolean
  }
}