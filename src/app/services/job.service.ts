import { Injectable, Injector } from '@angular/core';

import { JobsResponse, JobData } from '../models/jobs-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class JobService extends ApiService<JobsResponse> {
  protected serverUrl: string = 'http://localhost:3000/jobs/get'; // For use with https://github.com/micah-wehrle/ABCNest
  protected apiResultsConstructor: new (response: any) => JobsResponse = JobsResponse;
  private selectedJobAccountNumber: number = 0;

  constructor(injector: Injector) {
    super('Job Service', injector);
  }

  /**
   * @description Taking either no data or the number of jobs to request, and calls the job list api to get the current job list
   * @param uuid The "UUID" for the tech to generate job data, used to seed the back end random number generator with the UUID
   * @param date The date to generate jobs for, used to seed the back end random number generator with the date
   * @param {number} [jobCount] The current number of jobs to request. If left empty, will be selected by seed in backend.
   */
  public call(uuid: string, date: string, jobCount?: number): void {
    if (!uuid || !uuid.toLowerCase().match(/^[a-z]{2}\d{3}[a-z0-9]$/i) ) {
      console.error(`${uuid} is not a valid uuid!`)
      return;
    }

    // the back end has two controller routes, one for /uuid/date and one for uuid/date/jobCount. Will only include job count if it is truthy
    this.get(`${uuid}/${date.replace('/', '-')}/${jobCount ? jobCount : ''}`);
  }

  /**
   * @description Getter for currently selected job.
   * @returns {JobData} Returns the selected job
   */
  public getSelectedJob(): JobData {
    const jobs: JobData[] = this.apiResults.getJobs();

    if (!this.loading && this.isSuccessfullyCompleted && this.apiResults && Array.isArray(jobs)) {
      for (let i = 0; i < jobs.length; i++) {
        const curJob = jobs[i];
        if (curJob && curJob.accountNumber === this.selectedJobAccountNumber) {
          return jobs[i];
        }
      }
    }
    return null;
  }

  /**
   * @description Setter for setting the account number of the selected job.
   * @param {number} accountNumber The account number of the selected job
   * @returns {void}
   */
  public setSelectedJob(accountNumber: number): void {
    this.selectedJobAccountNumber = accountNumber;
  }
}
