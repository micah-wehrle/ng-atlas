import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, take, takeUntil } from 'rxjs';

import { JobData, JobsResponse } from 'src/app/models/jobs-response.model';
import { WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import { JobService } from 'src/app/services/job.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  public weatherAlertResponse: WeatherAlertResponse;
  public jobsResponse: JobsResponse;

  public techUUID: string;
  private jobServiceSubscription: Subscription;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private jobCount: number;

  private shownDate: Date = new Date();
  public dateIsInPast: boolean = false;
  
  constructor(private weatherService: WeatherService, private jobService: JobService) { }

  ngOnInit(): void {    
    this.techUUID = 'mw224g'; // TODO - Make part of a sort of "login" feature. Aaron is working on this I believe, possibly a sort of modal.
    this.jobsResponse = this.jobService.getResults();
    if (!this.jobsResponse) { // don't call the api if it already has data
      this.onRefreshJobList();
    }
    else {
      this.calculateJobCount();
      const dateParts = this.jobsResponse.getDate().split('-');
      this.shownDate.setMonth(Number(dateParts[0])-1);
      this.shownDate.setDate(Number(dateParts[1]));
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * @description Gives the currently stored date in the format mm/dd, or as the text "Today" if the stored date is today
   * @returns 
   */
  public get displayDate(): string {
    const formattedDate = this.formatDate(this.shownDate);
    const todayFormatted = this.formatDate(new Date());
    return formattedDate === todayFormatted ? 'Today' : formattedDate;
  }

  /**
   * @description Formats the given date as a string of month and day
   * @param day The date to format
   * @returns In the format mm/dd
   */
  private formatDate(day: Date): string {
    return `${day.getMonth()+1}/${day.getDate()}`;
  }

  /**
   * @description Adjusts the stored date by the given offset, then refreshes the job list to call the back end with the new date
   * @param offset How many days to adjust the stored date, typically +1 or -1
   */
  public onAddDay(offset: number): void {
    this.shownDate.setDate(this.shownDate.getDate() + offset);
    this.onRefreshJobList();
  }

  /**
   * @description Sets the stored date to today's date. If the date wasn't already today, then refreshes the job list to call the back end with today's date
   */
  public onToToday(): void {
    const formattedDate = this.formatDate(this.shownDate);
    const todayFormatted = this.formatDate(new Date());
    if (formattedDate === todayFormatted) {
      return;
    }
    
    this.shownDate = new Date();
    this.onRefreshJobList();
  }

  /**
   * @todo This method requires implementation, now that the job generation has been moved to the back end. Will require back end changes as well, requesting the back end to generate a new job. This should be done by creating a system where the front end can do: backendURL/jobs/get/{uuid}/{job-index}. Usually, when removing job-index, the back end will decide how many jobs should be returned. However, when passing job-index, the back end will then then generate that many jobs and remove them. So essentially the front end will request job-index as current job count + 1
   * @description For use in html when the request job button is clicked. Will Generate a new job to add to the job list
   * @returns {void}
   */
  public onRequestJobButtonClick(): void {
    this.jobCount++;
    this.onRefreshJobList();
  }

  /**
   * @description For use in html when the refresh button is clicked. Will call JobService 
   * @returns {void}
   */
  public onRefreshJobList(): void {
    this.dateIsInPast = this.isDateInPast(this.shownDate);
    this.callJobServiceJobs(this.techUUID, this.formatDate(this.shownDate));
  }

  /**
   * @description Will compare the given date to the current system date to see if given date is in the past. Only compares the calendar date, and ignores hours/minutes/etc.
   * @param dateToCheck The date to validate if it is in the past
   * @returns True only if the calendar date of the given value is less than the current system calendar date
   */
  private isDateInPast(dateToCheck: Date): boolean {
    const zeroedDateToCheck = new Date(dateToCheck); // should remove the pointer potential issue
    zeroedDateToCheck.setHours(0, 0, 0, 0); // zero the date to midnight

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // zero the date to midnight

    return currentDate.getTime() > zeroedDateToCheck.getTime();
  }

  /**
   * @description To be used in ngOnInit, will do subscribe to job service jobs so that when the api is called it will update the jobResponse data.
   * @returns {void}
   */
  private subscribeToJobServiceJobs(): void {
    if (this.jobServiceSubscription && !this.jobServiceSubscription.closed) {
      this.jobServiceSubscription.unsubscribe(); // This prevents a situation where the user attempts to subscribe to the api call when there is already a pending api call.
    }
    this.jobServiceSubscription = this.jobService.getLoading().pipe(take(2), takeUntil(this.ngUnsubscribe)).subscribe({
      next: (loading: boolean) => {
        if(!loading && this.jobService.hasSuccessfullyCompleted()) {
          this.jobsResponse = this.jobService.getResults();
          this.calculateJobCount();
          // Putting this here is bad practice, you shouldn't string calls together! We should talk about how to fix long term. I'm fine leaving it in for now.
          this.callAndSubscribeToWeatherService(); 
        }
      }
    });
  }

  /**
   * @description Calls the job list api, passing the tech uuid, which invoke a response from the api containing a list of jobs procedurally generated from the given uuid. Also subscribes to the service for when the response comes through
   * @param {string} uuid The uuid for the tech for which to retrieve the job list. 
   * @returns {void}
   */
  private callJobServiceJobs(uuid: string, date: string): void {
    this.jobsResponse = null;
    this.jobService.resetData();
    this.jobService.call(uuid, date, this.jobCount);
    this.subscribeToJobServiceJobs();
  }

  /**
   * @description - Subscribes to weather service and sets global variable for the api response
   * @returns {void}
   */
  private callAndSubscribeToWeatherService(): void {
    const jobList = this.jobsResponse.getJobs();
    if (Array.isArray(jobList) && jobList.length > 0) { // only want to make this call if there are 
      this.weatherService.call(jobList[0].location.lat, jobList[0].location.long); // calls with first assigned job cause alerts should be similar to the area
      this.weatherService.getLoading().pipe(take(2), takeUntil(this.ngUnsubscribe)).subscribe({
        next: (loading: boolean) => {
          if (!loading && this.weatherService.hasSuccessfullyCompleted()) {
            this.weatherAlertResponse = this.weatherService.getResults();
          }
        }
      });
    }
  }

  /**
   * @description Sets jobCount variable by counting jobs from jobsResponse
   */
  private calculateJobCount(): void {
    const jobs: JobData[] = this.jobsResponse?.getJobs();
    this.jobCount = Array.isArray(jobs) ? jobs.length : 0;
  }
}