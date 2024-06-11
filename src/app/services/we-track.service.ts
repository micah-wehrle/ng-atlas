import { HttpClient } from '@angular/common/http';
import { Injector, Injectable } from '@angular/core';
import { WeTrackResponse } from '../models/we-track-response.model';
import { Comment, WeTrackTicket } from '../models/we-track-ticket.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class WeTrackService extends ApiService<WeTrackResponse> {
  protected serverUrl: string = 'http://localhost:3000/we-track';
  protected apiResultsConstructor: new (response: any) => WeTrackResponse = WeTrackResponse;
  private selectedTicketId: number = -1;

  constructor(injector: Injector) {
    super('we track', injector);
  }

  //       Basic back end calls to send and retrieve data:
  /**
   * @description Calls the back end to get the list of tickets
   * @returns {void}
   */
  public callTickets(): void {
    this.get('get');
  }

  /**
   * @description Calls the back end to get a list only showing deleted tickets
   * @returns {void}
   */
  public callDeletedTickets(): void {
    this.get('get-deleted');
  }

  /**
   * @description Sends a new ticket to the back end to be added to the database
   * @returns {void}
   */
  public createTicket(ticket: WeTrackTicket): void {
    this.post('create', ticket);
  }

  /**
   * @description Sends a partial ticket to the back end in order to update changes made
   * @returns {void}
   */
  public updateTicket(partialTicket: Partial<WeTrackTicket>): void {
    this.post('update', partialTicket);
  }
  
  /**
   * @description Sends a ticket to the back end in order to change whether or not the ticket is marked as deleted
   * @returns {void}
   */
  public deleteTicket(ticketId: number, isDeleted: boolean): void {
    this.post('delete', { ticketId, isDeleted });
  }

  /**
   * @description Sends a comment to the back end to be added to a specific ticket
   * @returns {void}
   */
  public addComment(ticketId: number, comment: Comment): void {
    this.post('comment', {ticketId, comment});
  }


  //     Methods used by components and services to access and modify data retrieved from the back end
  /**
   * @description Getter for the array of tickets
   * @returns {WeTrackTicket[]} The array of tickets from the back end
   */
  public getTickets(): WeTrackTicket[] {
    return this.apiResults.getTickets();
  }

  /**
   * @description Sets the given ticket to be the currently selected ticket. 
   * @param {WeTrackTicket} ticket The ticket to be selected
   * @returns {void}
   */
  public setSelectedTicket(ticket: WeTrackTicket): void {
    this.selectedTicketId = ticket.uniqueId;
  }

  /**
   * @description Sets the given ticket ID to be the currently selected ticket.
   * @param {number} id The ID of ticket to be selected
   * @returns {void}
   */
  public setSelectedTicketId(id: number): void {
    this.selectedTicketId = id;
  }

  /**
   * @description Used to mark no tickets as being selected, sets the ID to -1
   * @returns {void}
   */
  public deselectTicket(): void {
    this.selectedTicketId = -1;
  }

  /**
   * @description Getter for the selected ticket ID
   * @returns {number} Selected ticket ID
   */
  public getSelectedTicketId(): number {
    return this.selectedTicketId;
  }

  /**
   * @description Getting for the selected ticket
   * @returns {WeTrackTicket} The selected ticket
   */
  public getSelectedTicket(): WeTrackTicket {
    return this.apiResults.getTickets().find(ticket => ticket.uniqueId === this.selectedTicketId);
  }

  /**
   * @description Generates a partial ticket based on the differences between the given ticket and the currently selected ticket. For use with updating the back end with ticket changes.
   * @param {WeTrackTicket} changedTicket The ticket to which changes have been made.
   * @returns {Partial<WeTrackTicket>} The partial weTrack ticket, containing only the ID and any values that were changed in the provided changedTicket.
   */
  public findChangesToSelectedTicket(changedTicket: WeTrackTicket): Partial<WeTrackTicket> {
    const ticket = this.getSelectedTicket();
    const outputTicket = structuredClone(changedTicket);
    for (let key in ticket) {
      if (key === 'uniqueId') {
        continue;
      }
      if (outputTicket[key] === ticket[key]) {
        delete outputTicket[key];
      }
    }

    return outputTicket;
  }

  /**
   * @descriptions Given a ticket or ticket index, will return a numerical value representing where the ticket value should fall in a sorted array. Intended to be used to sort special strings when an order other than alphabetical would make more sense, such as urgency or ticket type.
   * @param {number | WeTrackTicket} ticket Takes the index of the ticket or the ticket object
   * @param {string} ticketVariable The ticket variable from which a sortable value is needed
   * @returns {number} The sortable "weight" of the given ticket value, to be ranked with other possible ticket values
   */
  public getSortableValueFromTicket(ticket: number | WeTrackTicket, ticketVariable: string): number {
    if(!ticket) {
      console.error('Error parsing ticket'); // In case the user passes an empty ticket
    }
    const tickets = this.apiResults.getTickets();
    const ticketToUse: WeTrackTicket = typeof ticket === 'number' ? tickets[ticket] : ticket; // Convert a variable which may be one of two types, into a definite WeTrackTicket type

    switch(ticketVariable) { // Depending on the weTrackTicket variable type, extract various values or return numerical "weights" depending on the value of the given variable
      case 'creationDate':
        return new Date(ticketToUse.creationDate).getTime();
      case 'editDate':
        return new Date(ticketToUse.editDate).getTime();
      case 'type':
        switch(ticketToUse.type) { // Sort the ticket types in the order Idea > Issue > Feature
          case WeTrackTicket.STATIC_DATA.TYPE.FEATURE: 
            return 1;
          case WeTrackTicket.STATIC_DATA.TYPE.ISSUE: 
            return 2;
          case WeTrackTicket.STATIC_DATA.TYPE.IDEA: 
            return 3;
        }
        console.error('Unrecognized ticket type: ', ticketToUse, ticketToUse.type);
        return 0;
      case 'importance': 
        switch(ticketToUse.importance) { // Sort the ticket priorities in the order Urgent > High > Medium > Low
          case WeTrackTicket.STATIC_DATA.PRIORITY.LOW:
            return 1;
          case WeTrackTicket.STATIC_DATA.PRIORITY.MEDIUM:
            return 2;
          case WeTrackTicket.STATIC_DATA.PRIORITY.HIGH:
            return 3;
          case WeTrackTicket.STATIC_DATA.PRIORITY.URGENT:
            return 4; 
        }
        console.error('Unrecognized ticket priority: ', ticketToUse, ticketToUse.importance);
        return 0;
      case 'status':
        switch(ticketToUse.status) { // Sort the ticket status in the order Cancelled > Complete > In-Progress > Assigned > Pending
          case WeTrackTicket.STATIC_DATA.STATUS.PENDING:
            return 1;
          case WeTrackTicket.STATIC_DATA.STATUS.ASSIGNED:
            return 2;
          case WeTrackTicket.STATIC_DATA.STATUS.IN_PROGRESS:
            return 3;
          case WeTrackTicket.STATIC_DATA.STATUS.COMPLETE:
            return 4;
          case WeTrackTicket.STATIC_DATA.STATUS.CANCELLED:
            return 5;
        }
        console.error('Unrecognized ticket status: ', ticketToUse, ticketToUse.status);
        return 0;
      default:
        console.error('Unrecognized ticket variable: ', ticketVariable);
        return 0;
    }
  }
  
}