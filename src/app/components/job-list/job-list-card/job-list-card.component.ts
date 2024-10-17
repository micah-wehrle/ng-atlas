import { Component, Input, OnInit } from '@angular/core';
import { JobData } from 'src/app/models/jobs-response.model';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-job-list-card',
  templateUrl: './job-list-card.component.html',
  styleUrls: ['./job-list-card.component.scss']
})
export class JobListCardComponent implements OnInit {

  @Input('job') job: JobData;
  @Input('i') i: number;

  public showPopup: boolean = false;
  private deleteLaterButPopupTimerId;

  constructor(private readonly pokemonService: PokemonService) { }

  ngOnInit(): void {
  }

  public onPokeballClick($event: Event): void {
    $event.stopPropagation();

    // console.log(this.job.pokemon.sprites);

    this.pokemonService.spotPokemon(this.job.pokemon);
    
    if (this.showPopup) {
      this.showPopup = false;
      clearTimeout(this.deleteLaterButPopupTimerId);
      return;
    }

    this.showPopup = true;

    this.deleteLaterButPopupTimerId = setTimeout(() => this.showPopup = false, 2000);

  }

}
