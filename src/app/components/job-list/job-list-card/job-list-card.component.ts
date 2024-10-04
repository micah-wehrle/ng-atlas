import { Component, Input, OnInit } from '@angular/core';
import { JobData } from 'src/app/models/jobs-response.model';

@Component({
  selector: 'app-job-list-card',
  templateUrl: './job-list-card.component.html',
  styleUrls: ['./job-list-card.component.scss']
})
export class JobListCardComponent implements OnInit {

  @Input('job') job: JobData;
  @Input('i') i: number;

  constructor() { }

  ngOnInit(): void {
  }

  public onPokeballClick($event): void {

  }

}
