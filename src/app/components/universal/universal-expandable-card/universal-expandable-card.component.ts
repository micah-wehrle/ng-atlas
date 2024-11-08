import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-universal-expandable-card',
  templateUrl: './universal-expandable-card.component.html',
  styleUrls: ['./universal-expandable-card.component.scss']
})
export class UniversalExpandableCardComponent implements OnInit {

  @Input() headerData: HeaderData; // Received from parent class to set up header text and styling

  public isOpen: boolean = false;
  private isTransitioning: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * @description Called based on the (click) event, to know the moment the user clicks on the card header. Flips isOpen in order to rotate the indication arrow.
   * @returns {void}
   */
  public onHeaderClick(): void {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      this.isOpen = !this.isOpen;
    }
  }

  /**
   * @description Triggered based on the bootstrap collapse system, once the card finishes opening. Ensures arrow indicates "open" and marks the transition as complete.
   * @returns {void}
   */
   public onCardShown(): void {
    this.isOpen = true; // Set here just in case something breaks, we don't want the arrow to be facing the wrong direction
    this.isTransitioning = false;
  }

  /**
   * @description Triggered based on the bootstrap collapse system, once the card finishes closing. Ensures arrow indicates "closed" and marks the transition as complete.
   * @returns {void}
   */
   public onCardHidden(): void {
    this.isOpen = false; // Set here just in case something breaks, we don't want the arrow to be facing the wrong direction
    this.isTransitioning = false;
  }

}

export type HeaderData = {
  text: string,
  style: {[key: string]: string},
  showArrow?: boolean
}