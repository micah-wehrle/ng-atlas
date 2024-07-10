import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { JobData } from 'src/app/models/jobs-response.model';
import { JobService } from 'src/app/services/job.service';
import { WeatherService } from 'src/app/services/weather.service';

import { JobListComponent } from './job-list.component';

describe('JobListComponent', () => {
  let component: JobListComponent;
  let fixture: ComponentFixture<JobListComponent>;

  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  let jobServiceSpy = jasmine.createSpyObj('JobService', ['setSelectedJob']);
  let weatherServiceSpy = jasmine.createSpyObj('WeatherService', ['call']);

  
  let selectedJob: Partial<JobData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobListComponent ],
      providers: [
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: JobService,
          useValue: jobServiceSpy
        },
        {
          provide: WeatherService,
          useValue: weatherServiceSpy
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    selectedJob = {
      location: {
        lat: 100,
        long: -100,
        city: '', state: '', streetAddress: '',
      },
      accountNumber: 12345
    };

    // fakeRouter = {
    //   navigate: (commands: any[]): Promise<boolean> => {
    //     fakeData['commands'] = commands;
    //     return;
    //   }
    // };

    // fakeWeatherService = {
    //   call: (lat: number, long: number): void => {
    //     if (lat && long) {
    //       fakeData['lat and long'] = true;
    //     }
    //   }
    // };

    // fakeJobService = {
    //   setSelectedJob: (accountNumber: number): void => {
    //     fakeData['selectedJob'] = accountNumber;
    //   }
    // }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can route to a job', () => {
    component.onJobClicked(selectedJob as JobData);

    expect(routerSpy.navigate).toHaveBeenCalled();
  });
});
