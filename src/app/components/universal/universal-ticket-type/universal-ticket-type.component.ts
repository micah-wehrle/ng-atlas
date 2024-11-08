import { Component, Input, OnInit } from '@angular/core';

import { WeTrackTicket } from 'src/app/models/we-track-ticket.model';

@Component({
  selector: 'app-universal-ticket-type',
  templateUrl: './universal-ticket-type.component.html',
  styleUrls: ['./universal-ticket-type.component.scss']
})
export class UniversalTicketTypeComponent implements OnInit {
  @Input() ticketType: string; // Receive the type of ticket from parent
  public typeSymbol: string = ''; // The chosen symbol based on the ticketType input

  public static readonly ticketTypeSymbols = { // Each of the symbols based on the given ticket type
    FEATURE: '&And;',
    ISSUE: '&xotime;',
    IDEA: '&odot;',
    UNKNOWN: '?'
  }

  constructor() { }

  ngOnInit(): void {
    this.determineTypeSymbol();
  }

  /**
   * @description Will compare ticketType variable to various static WeTrackTicket types to determine the correct symbol to use.
   * @returns {void}
   */
  private determineTypeSymbol(): void {
    this.typeSymbol = this.ticketType ? ( // Match each ticket type to the list of symbols in ticketTypeSymbols
      this.ticketType === WeTrackTicket.STATIC_DATA.TYPE.FEATURE ? UniversalTicketTypeComponent.ticketTypeSymbols.FEATURE :
      this.ticketType === WeTrackTicket.STATIC_DATA.TYPE.ISSUE ? UniversalTicketTypeComponent.ticketTypeSymbols.ISSUE :
      this.ticketType === WeTrackTicket.STATIC_DATA.TYPE.IDEA ? UniversalTicketTypeComponent.ticketTypeSymbols.IDEA : 
      UniversalTicketTypeComponent.ticketTypeSymbols.UNKNOWN
    ) : UniversalTicketTypeComponent.ticketTypeSymbols.UNKNOWN; // If ticketType isn't truthy, default to unknown symbol
  }

}
