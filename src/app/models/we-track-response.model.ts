import { ApiResponseModel } from "./api-response.model";
import { WeTrackTicket } from "./we-track-ticket.model";

export class WeTrackResponse extends ApiResponseModel {

  private ticketGroups: {[key: string]: WeTrackTicket[]};

  constructor(response: any) {
    super(response);
  }

  /**
   * @description Called in the abstract class, and created here so that the api response can be parsed properly
   * @param response - The response from the api, passed here to be parsed
   * @returns {void}
   */
  protected processResponse(response: WeTrackTicketResponse): void {
    this.ticketGroups = {};
    for (let group in response.tickets) {
      this.ticketGroups[group] = [];
      const tickets = Object.values(response.tickets[group]) as WeTrackTicket[];
      for (let ticket of tickets) {
        this.ticketGroups[group].push(
          new WeTrackTicket(
            ticket.uniqueId,
            ticket.title,
            ticket.type,
            ticket.description,
            ticket.importance,
            ticket.submitter,
            ticket.repoData,
            ticket.assignee,
            ticket.status,
            ticket.creationDate,
            ticket.editDate,
            ticket.comments,
            ticket.tags
          )
        );
      }
    }
  }

  public getGroups(): string[] {
    return Object.keys(this.ticketGroups);
  }

  public getTickets(ticketGroup: string): WeTrackTicket[] {
    return this.ticketGroups[ticketGroup].slice();
  }

}

type WeTrackTicketResponse = {
  tickets: {
    [key: string]: {
      [key: string]: WeTrackTicket
    }
  }
}