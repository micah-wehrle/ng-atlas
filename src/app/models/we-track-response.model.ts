import { ApiResponseModel } from "./api-response.model";
import { WeTrackTicket } from "./we-track-ticket.model";

export class WeTrackResponse extends ApiResponseModel {

  private tickets: WeTrackTicket[];

  constructor(response: any) {
    super(response);
  }

  /**
   * @description Called in the abstract class, and created here so that the api response can be parsed properly
   * @param response - The response from the api, passed here to be parsed
   * @returns {void}
   */
  protected processResponse(response: {tickets: WeTrackTicket[]}): void {
    this.tickets = [];
    for (let ticket of response.tickets) {
      this.tickets.push(
        new WeTrackTicket(
          ticket.uniqueId,
          ticket.title,
          ticket.type,
          ticket.description,
          ticket.importance,
          ticket.submitter,
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

  public getTickets(): WeTrackTicket[] {
    return this.tickets.slice();
  }

}