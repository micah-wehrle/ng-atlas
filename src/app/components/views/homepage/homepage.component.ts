import { Component, OnInit } from '@angular/core';

import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  public readonly preselectedLocations: {location: string, lat: number, long: number}[] = [ // An array of location names and lat/longs, used to generate location buttons in the component html
    {
      location: 'Loading...', // can be placed anywhere in array, just ensure that location equals 'Loading...'
      lat: 999, // default lat and long to an impossible coordinate so that the component html knows not to enable this button
      long: 999
    },
    { location: 'Cleveland, OH', lat: 41.4993, long: -81.6944 },
    { location: 'Milwaukee, WI', lat: 43.0722, long: -89.4008 },
    { location: 'Santa Monica, CA', lat: 34.0195, long: -118.4912 },
    { location: 'Austin, TX', lat: 30.2672, long: -97.7431 },
    { location: 'Fort Lauderdale, FL', lat: 26.1224, long: -80.1373 },
    { location: 'Dallas, TX', lat: 32.7767, long: -96.7970 },
    { location: 'Rapid City, SD', lat: 44.0805, long: -103.2310 },
  ];

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    // When the page is loaded, grab the current location and add it to the current location button in the preselectedLocations array
    // this.initializeCurrentLocation(); // TODO rework this bad boy. Removing for now.
  }

  /**
   * @TODO //TODO this honestly needs to be reworked I think.
   * @description For use when the user clicks a button generated by the preselectedLocation array, will execute weatherService.call
   * @param {number} lat The latitude for the location you'd like to call the weather api
   * @param {number} long The longitude for the location you'd like to call the weather api
   * @returns {void}
   */
  public onChangeLocation(lat: number, long:number): void {
    this.weatherService.call(lat, long);
  }

  /**
   * @description For use in ngOnInit, to load the user's current location, add the location to the current location button in the preselectedLocations array, and call the weather service API if it hasn't been already.
   * @returns {void}
   */
  private initializeCurrentLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (pos: GeolocationPosition) => { // On successful location call..
        if (!(pos && pos.coords)) {
          return; 
        } 

        for (let curLocation of this.preselectedLocations) { // loop through each location button 
          if (!curLocation || curLocation.location !== 'Loading...') { continue; } // skip the iteration until we find the button titled 'Loading...'

          curLocation.location = 'Current location' // Change the button formerly called 'Loading...' to reflect that the user current location has been found
          curLocation.lat = pos.coords.latitude;
          curLocation.long = pos.coords.longitude;

          if (!this.weatherService.hasSuccessfullyCompleted()) { // Check if the user has already called and gotten 
            // TODO - move the call method into app.component.ts. May require a service file 
            this.weatherService.call(pos.coords.latitude, pos.coords.longitude);
          }
          break; // since 'Loading...' button was found, do not need to continue
        }
      }, 
      (err) => { // Location call failed
        console.error(err);
        this.preselectedLocations[0].location = 'No local pos'; // Update button to indicate finished loading but no position available
        // Don't change lat and long so the button will remain disabled in the DOM!
      }
    );
  }
}