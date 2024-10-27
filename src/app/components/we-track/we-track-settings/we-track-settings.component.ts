import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';

import { WeTrackTicket } from 'src/app/models/we-track-ticket.model';
import { WeTrackService } from 'src/app/services/we-track.service';
import { HeaderData } from '../../universal/universal-expandable-card/universal-expandable-card.component';
import { ListData, ListElement } from '../../universal/universal-selection-list/universal-selection-list.component';

@Component({
  selector: 'app-we-track-settings',
  templateUrl: './we-track-settings.component.html',
  styleUrls: ['./we-track-settings.component.scss']
})
export class WeTrackSettingsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private headerBaseText: string = 'Deleted Tickets';
  public headerData: HeaderData = {
    text: this.headerBaseText,
    style: {'background-color': 'rgb(215,215,215)'},
    showArrow: true,
  }

  // For use with the universal-selection-list component.
  public deletedTicketData: ListData = {
    topText: 'Select a ticket to restore:',
    canMultiSelect: false,
    listElements: [],
    buttons: [
      {
        bootstrapButtonClass: 'btn-success',
        text: ButtonText.Restore
      },
      {
        bootstrapButtonClass: 'btn-danger',
        text: ButtonText.PermDelete
      }
    ],
  };

  // To display in the ui if tickets are being downloaded.
  public isLoadingDeletedTickets: boolean = true;
  public deletedTickets: WeTrackTicket[];

  public ticketToPreview: number = -1;

  constructor(private router: Router, private weTrackService: WeTrackService) { }

  ngOnInit(): void {
    this.callDeletedTicketsFromBackEnd();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * @description Used by the back button to return to the we-track page
   * @returns {void}
   */
  public onGoBack(): void {
    this.router.navigate(['we-track']);
  }

  /**
   * @description Takes the array of deletedTickets and extracts the data to be inserted into the universal-selection-list component.
   * @returns {void}
   */
  private setUpDeletedTicketData(): void {
    this.deletedTicketData.listElements = this.deletedTickets.map(
      (ticket: WeTrackTicket): ListElement => {
        return {
          text: ticket.title,
          uniqueId: ticket.uniqueId,
          description: ticket.description
        }
      }
    );
  }

  /**
   * @description Calls the back end to specifically get the array of deleted weTrack tickets. Calls, subscribes, and process the response.
   * @returns {void}
   */
  private callDeletedTicketsFromBackEnd(): void {
    this.isLoadingDeletedTickets = true;
    this.weTrackService.callDeletedTickets();
    this.weTrackService.getLoading().pipe(take(2), takeUntil(this.ngUnsubscribe)).subscribe({
      next: (loading: boolean) => {
        if (!loading && this.weTrackService.hasSuccessfullyCompleted()) {
          this.deletedTickets = this.weTrackService.getResults().getTickets(this.weTrackService.getSelectedTicketGroup())
          this.isLoadingDeletedTickets = false;

          if (Array.isArray(this.deletedTickets)) {
            this.headerData.text = `${this.headerBaseText} (${this.deletedTickets.length})`;
          }
          else {
            this.headerData.text = this.headerBaseText;
          }

          this.setUpDeletedTicketData();
        }
      }
    });
  }

  public onDeletedListChanged(selected: boolean[]): void {
    for (let i = 0; i < selected.length; i++) {
      if (selected[i]) {
        this.ticketToPreview = i;
        return;
      }
    }

    this.ticketToPreview = -1;
  }

  public onDeletedListButtonPressed(buttonText: string): void {
    if (this.ticketToPreview === -1 || this.isLoadingDeletedTickets) {
      return;
    }

    switch (buttonText) {
      case ButtonText.Restore:
        this.restoreTicket(this.deletedTickets[this.ticketToPreview].uniqueId);
        break;
      
      case ButtonText.PermDelete:
        this.permanentlyDeleteTicket(this.deletedTickets[this.ticketToPreview].uniqueId);
        break;
    }
  }

  /**
   * @description Receives the ID for a ticket to restore, and then sends the request to the back end and subscribes to the response.
   * @param {number} uniqueId The unique ID for the ticket which is to be restored to the list of tickets
   * @returns {void}
   */
  private restoreTicket(uniqueId: number): void {
    this.isLoadingDeletedTickets = true;
    this.weTrackService.deleteTicket(uniqueId, this.weTrackService.getSelectedTicketGroup(), false);
    this.weTrackService.getLoading().pipe(take(2), takeUntil(this.ngUnsubscribe)).subscribe({
      next: (loading: boolean) => {
        if (!loading && this.weTrackService.hasSuccessfullyCompleted()) {
          this.isLoadingDeletedTickets = false;

          this.callDeletedTicketsFromBackEnd();
        }
      }
    });
  }

  private permanentlyDeleteTicket(uniqueId: number): void {
    this.isLoadingDeletedTickets = true;
    this.weTrackService.permanentlyDeleteTicket(uniqueId, this.weTrackService.getSelectedTicketGroup());
    this.weTrackService.getLoading().pipe(take(2), takeUntil(this.ngUnsubscribe)).subscribe({
      next: (loading: boolean) => {
        if (!loading && this.weTrackService.hasSuccessfullyCompleted()) {
          this.isLoadingDeletedTickets = false;

          this.callDeletedTicketsFromBackEnd();
        }
      }
    });
  }

  /**
   * @description Checks if there are any deleted tickets available to show, returning true or false.
   * @returns {boolean} Whether or not there are deleted tickets
   */
  public getIfThereAreDeletedTickets(): boolean {
    return Array.isArray(this.deletedTickets) && this.deletedTickets.length > 0;
  }

}

enum ButtonText {
  Restore = 'Restore',
  PermDelete = 'Permanently Delete'
}