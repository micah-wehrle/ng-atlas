import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { JobData } from 'src/app/models/jobs-response.model';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-job-list-card',
  templateUrl: './job-list-card.component.html',
  styleUrls: ['./job-list-card.component.scss']
})
export class JobListCardComponent implements OnInit, OnDestroy {

  @Input('job') job: JobData;
  @Input('i') i: number;

  public showPopup: boolean = false;
  private popupTimerId: ReturnType<typeof setTimeout>;

  constructor(private readonly pokemonService: PokemonService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.showPopup) {
      clearTimeout(this.popupTimerId);
    }
  }

  public onPokeballClick($event: Event): void {
    $event.stopPropagation();

    this.pokemonService.spotPokemon(this.job.pokemon);
    
    if (this.showPopup) {
      this.closePopup();
      return;
    }

    this.showPopup = true;

    this.popupTimerId = setTimeout(() => this.showPopup = false, 2000);
  }

  public onPokeCardClick($event: Event): void {
    if (!this.showPopup) {
      return;
    }
    $event.stopPropagation();
    this.closePopup();
  }

  private closePopup(): void {
    this.showPopup = false;
    clearTimeout(this.popupTimerId);
  }

}
